import {
  CREDIT_TERMS,
  EMISSION_TERMS,
  FOSSIL_COMPARATOR,
  MAX_BLEND_COMPONENTS,
  ZERO_INPUTS,
  blend,
  meetsThreshold,
  round,
  savingsPercent,
  thresholdForStartDate,
  totalEmissions,
  type PathwayInputs,
  type TermKey,
} from './calc';
import { PRESETS } from './presets';
import { ESCA_TOOLTIP, TERMS, type TermInfo } from './terms';

const UNIT = 'gCO₂eq/MJ';
const DISCLAIMER =
  "Educational tool. Not for certification, audits or official GHG reporting. Use certified values and your certification scheme's rules.";
const LABEL = 'RED II as amended by RED III (Directive (EU) 2018/2001, amended by Directive (EU) 2023/2413)';

function $<T extends HTMLElement>(selector: string): T {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element ${selector}`);
  return el;
}

function esc(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/** Fixed decimals with a real minus sign and no "-0.0". */
function fmt(value: number, decimals = 1): string {
  const r = round(value, decimals) + 0;
  const s = Math.abs(r).toFixed(decimals);
  return r < 0 ? `−${s}` : s;
}

/** Up to 2 decimals, trailing zeros removed (for echoing inputs). */
function fmtInput(value: number): string {
  const r = round(value, 2) + 0;
  const s = String(Math.abs(r));
  return r < 0 ? `−${s}` : s;
}

/** 2021-01-01 -> 01.01.2021 */
function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}`;
}

function sym(term: TermInfo): string {
  return `e<sub>${term.sub}</sub>`;
}

let statusTimer: number | undefined;
function announce(message: string): void {
  const el = $('#live-status');
  el.textContent = message;
  window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => (el.textContent = ''), 4000);
}

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to the legacy path
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  ta.remove();
  return ok;
}

/* ---------- Chart ---------- */

interface Bar {
  labelHtml: string;
  value: number;
  kind: 'emission' | 'credit' | 'total' | 'fossil';
}

function renderChart(bars: Bar[], caption: string): string {
  const max = Math.max(FOSSIL_COMPARATOR, ...bars.map((b) => Math.abs(b.value)));
  const rows = bars
    .map((b) => {
      const negative = b.kind === 'credit' || b.value < 0;
      const width = (Math.abs(b.value) / max) * 100;
      const shown = b.kind === 'credit' ? -Math.abs(b.value) : b.value;
      return `<li class="bar-row ${b.kind}${negative ? ' negative' : ''}">
        <span class="bar-label">${b.labelHtml}</span>
        <span class="bar-track" aria-hidden="true"><span class="bar" style="width:${width.toFixed(2)}%"></span></span>
        <span class="bar-value">${fmt(shown, 2)}</span>
      </li>`;
    })
    .join('');
  return `<figure class="chart">
    <figcaption>${caption}</figcaption>
    <ul class="bars">${rows}
      <li class="bar-row axis" aria-hidden="true"><span class="axis-unit">${UNIT}</span><span class="axis-ticks"><span>0</span><span>${fmtInput(max / 2)}</span><span>${fmtInput(max)}</span></span><span></span></li>
    </ul>
    <p class="chart-legend"><span><span class="key"></span>Emissions</span><span><span class="key total"></span>Total</span><span><span class="key negative"></span>Subtracted or negative</span><span><span class="key fossil"></span>Fossil, 94</span></p>
  </figure>`;
}

function savingsNote(e: number): string {
  if (e < 0) {
    return `<p class="flag info"><strong>Net-negative emissions.</strong> E is below zero because the savings terms are larger than the emissions, so the saving is above 100%. Check that the soil carbon and CO₂ capture values are backed by evidence.</p>`;
  }
  if (e > FOSSIL_COMPARATOR) {
    return `<p class="flag warn"><strong>No saving.</strong> E is above the fossil comparator of 94 ${UNIT}, so this pathway emits more than the fossil fuel it replaces.</p>`;
  }
  return '';
}

/* ---------- Single pathway ---------- */

const singleForm = $<HTMLFormElement>('#single-form');
const presetSelect = $<HTMLSelectElement>('#preset');
const presetNote = $('#preset-note');
const startDate = $<HTMLInputElement>('#start-date');
const singleResults = $('#single-results');
let lastSingleCopy = '';

function termField(term: TermInfo): string {
  const id = `in-${term.key}`;
  const describedBy: string[] = [];
  if (term.hint) describedBy.push(`hint-${term.key}`);
  if (term.key === 'esca') describedBy.push('tip-esca');
  describedBy.push(`err-${term.key}`);
  const info =
    term.key === 'esca'
      ? `<button type="button" class="info-btn" id="esca-info" aria-expanded="false" aria-controls="tip-esca" aria-label="Soil carbon savings since RED III: more information">i</button>`
      : '';
  const tip =
    term.key === 'esca' ? `<p class="tooltip" id="tip-esca" role="tooltip" hidden>${esc(ESCA_TOOLTIP)}</p>` : '';
  return `<div class="term-field">
    <div class="label-row"><label for="${id}"><span class="sym">${sym(term)}</span> ${esc(term.label)}</label>${info}</div>
    <input type="number" id="${id}" name="${term.key}" inputmode="decimal" step="0.1" ${term.allowNegative ? '' : 'min="0"'} value="0" aria-describedby="${describedBy.join(' ')}" />
    ${term.hint ? `<p class="hint" id="hint-${term.key}">${esc(term.hint)}</p>` : ''}
    ${tip}
    <p class="error" id="err-${term.key}" hidden></p>
  </div>`;
}

function termInput(key: TermKey): HTMLInputElement {
  return $<HTMLInputElement>(`#in-${key}`);
}

function readSingle(): { inputs: PathwayInputs; valid: boolean } {
  const inputs: PathwayInputs = { ...ZERO_INPUTS };
  let valid = true;
  for (const term of TERMS) {
    const input = termInput(term.key);
    const err = $(`#err-${term.key}`);
    const raw = input.value.trim();
    const value = raw === '' ? (input.validity.badInput ? NaN : 0) : Number(raw);
    let message = '';
    if (!Number.isFinite(value)) message = 'Enter a number.';
    else if (value < 0 && !term.allowNegative) message = 'Enter 0 or more.';
    err.textContent = message;
    err.hidden = message === '';
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) valid = false;
    else inputs[term.key] = value;
  }
  return { inputs, valid };
}

function updatePresetNote(inputs: PathwayInputs): void {
  const preset = PRESETS.find((p) => p.id === presetSelect.value);
  if (!preset) {
    presetNote.innerHTML = 'Pick a pathway to fill in its default values, or enter your own.';
    return;
  }
  const warn =
    inputs.el > 0
      ? ` <strong class="text-warn">Default values may only be used when e<sub>l</sub> is zero or below.</strong>`
      : '';
  presetNote.innerHTML = `Part D default values: e<sub>ec</sub> ${fmt(preset.eec)} + e<sub>p</sub> ${fmt(preset.ep)} + e<sub>td</sub> ${fmt(preset.etd)} = ${fmt(preset.total)} ${UNIT}. Part A default saving: ${preset.partASavingPercent}%.${warn}`;
}

function renderSingle(): void {
  const { inputs, valid } = readSingle();
  updatePresetNote(inputs);

  if (!valid) {
    lastSingleCopy = '';
    singleResults.innerHTML = `<h3>Result</h3><p class="flag warn">Fix the highlighted inputs to see a result.</p>`;
    return;
  }

  const e = totalEmissions(inputs);
  const saving = savingsPercent(e);
  const threshold = thresholdForStartDate(startDate.value);

  let badge = `<p class="flag warn">Enter a valid installation start date to check the threshold.</p>`;
  let thresholdLine = 'Threshold: no valid installation start date given';
  if (threshold) {
    const pass = meetsThreshold(e, threshold);
    badge = `<p class="verdict ${pass ? 'pass' : 'fail'}">
      <span class="badge">${pass ? 'Pass' : 'Fail'}</span>
      <span>${pass ? 'Meets' : 'Does not meet'} the ${threshold.percent}% minimum of Art. 29(10)(${threshold.point}) for an installation that started operation on ${fmtDate(startDate.value)}.</span>
    </p>`;
    thresholdLine = `Threshold Art. 29(10)(${threshold.point}), installation start ${fmtDate(startDate.value)}: ${threshold.percent}% minimum: ${pass ? 'PASS' : 'FAIL'}`;
  }

  const rows = TERMS.map((term) => {
    const credit = (CREDIT_TERMS as readonly string[]).includes(term.key);
    const v = inputs[term.key];
    const contribution = credit ? -v : v;
    return `<tr>
      <th scope="row"><span class="sym">${sym(term)}</span> <span class="term-name">${esc(term.label)}</span></th>
      <td class="num">${fmt(contribution + 0, 2)}</td>
    </tr>`;
  }).join('');

  const bars: Bar[] = [];
  for (const term of TERMS) {
    const v = inputs[term.key];
    if (v === 0) continue;
    const credit = (CREDIT_TERMS as readonly string[]).includes(term.key);
    bars.push({ labelHtml: sym(term), value: v, kind: credit ? 'credit' : 'emission' });
  }
  bars.push({ labelHtml: 'E total', value: e, kind: 'total' });
  bars.push({ labelHtml: 'Fossil', value: FOSSIL_COMPARATOR, kind: 'fossil' });

  const preset = PRESETS.find((p) => p.id === presetSelect.value);

  singleResults.innerHTML = `
    <h3>Result</h3>
    <div class="headline">
      <div class="big"><span class="big-label">GHG savings</span><span class="big-num">${fmt(saving)}%</span></div>
      <div class="big"><span class="big-label">Total emissions E</span><span class="big-num">${fmt(e, 2)} <span class="unit">${UNIT}</span></span></div>
    </div>
    <p class="calc-line">(94 − ${fmt(e, 2)}) / 94 = ${fmt(saving)}%</p>
    ${savingsNote(e)}
    ${badge}
    <div class="table-wrap">
      <table class="breakdown">
        <caption>Breakdown by term</caption>
        <thead><tr><th scope="col">Term</th><th scope="col" class="num">${UNIT}</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr><th scope="row">E (total)</th><td class="num">${fmt(e, 2)}</td></tr>
          <tr><th scope="row">Fossil fuel comparator E<sub>F(t)</sub>, Part C point 19</th><td class="num">${fmt(FOSSIL_COMPARATOR, 2)}</td></tr>
          <tr><th scope="row">GHG savings</th><td class="num">${fmt(saving)}%</td></tr>
        </tfoot>
      </table>
    </div>
    ${renderChart(bars, `Emissions by term compared with the fossil comparator, ${UNIT}`)}
    <button type="button" class="btn primary" data-copy="single">Copy result</button>
  `;

  const termText = (keys: readonly TermKey[], sign: string) =>
    keys.map((k) => `${sign} ${k} ${fmtInput(inputs[k])}`).join(' ');
  lastSingleCopy = [
    `Biofuel GHG savings, ${LABEL}`,
    preset ? `Pathway: ${preset.name} (Annex V default values)` : '',
    `E = ${fmt(e, 2)} ${UNIT} (${termText(EMISSION_TERMS, '+').replace(/^\+ /, '')} ${termText(CREDIT_TERMS, '−')})`,
    `GHG savings = (94 − ${fmt(e, 2)}) / 94 = ${fmt(saving)}%`,
    e < 0 ? 'Note: net-negative emissions, saving above 100%.' : '',
    thresholdLine,
    DISCLAIMER,
  ]
    .filter(Boolean)
    .join('\n');
}

function applyPreset(id: string): void {
  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) return;
  for (const term of TERMS) termInput(term.key).value = '0';
  termInput('eec').value = String(preset.eec);
  termInput('ep').value = String(preset.ep);
  termInput('etd').value = String(preset.etd);
}

function initSingle(): void {
  const emissionKeys = EMISSION_TERMS as readonly string[];
  $('#emission-fields').innerHTML = TERMS.filter((t) => emissionKeys.includes(t.key)).map(termField).join('');
  $('#credit-fields').innerHTML = TERMS.filter((t) => !emissionKeys.includes(t.key)).map(termField).join('');

  presetSelect.innerHTML =
    `<option value="">Custom values</option>` +
    PRESETS.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join('');

  presetSelect.addEventListener('change', () => {
    applyPreset(presetSelect.value);
    renderSingle();
  });

  singleForm.addEventListener('input', (event) => {
    const target = event.target as HTMLElement;
    // Editing a preset value turns it into a custom calculation, except for
    // el, which is not part of the default values and triggers a warning instead.
    if (target instanceof HTMLInputElement && target.type === 'number' && presetSelect.value) {
      const preset = PRESETS.find((p) => p.id === presetSelect.value)!;
      const key = target.name as TermKey;
      const expected = key === 'eec' ? preset.eec : key === 'ep' ? preset.ep : key === 'etd' ? preset.etd : 0;
      if (key !== 'el' && Number(target.value) !== expected) presetSelect.value = '';
    }
    renderSingle();
  });
  singleForm.addEventListener('submit', (e) => e.preventDefault());

  $('#reset-single').addEventListener('click', () => {
    for (const term of TERMS) termInput(term.key).value = '0';
    presetSelect.value = '';
    startDate.value = '2021-01-01';
    renderSingle();
    announce('Inputs reset.');
  });

  // esca tooltip: click or keyboard toggles, hover shows, Escape closes.
  const infoBtn = $<HTMLButtonElement>('#esca-info');
  const tip = $('#tip-esca');
  let pinned = false;
  const show = (open: boolean) => {
    tip.hidden = !open;
    infoBtn.setAttribute('aria-expanded', String(open));
  };
  infoBtn.addEventListener('click', () => {
    pinned = !pinned;
    show(pinned);
  });
  infoBtn.addEventListener('mouseenter', () => show(true));
  infoBtn.addEventListener('mouseleave', () => show(pinned));
  infoBtn.addEventListener('focus', () => show(true));
  infoBtn.addEventListener('blur', () => show(pinned));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !tip.hidden) {
      pinned = false;
      show(false);
    }
  });

  // Start with a preset so the page shows a real result straight away.
  presetSelect.value = PRESETS[0].id;
  applyPreset(PRESETS[0].id);
  renderSingle();
}

/* ---------- Blend ---------- */

interface BlendRow {
  name: string;
  fossil: boolean;
  energy: string;
  e: string;
}

const DEFAULT_BLEND: BlendRow[] = [
  { name: 'Biofuel', fossil: false, energy: '99', e: '20' },
  { name: 'Fossil fuel', fossil: true, energy: '1', e: '94' },
];

let blendRows: BlendRow[] = DEFAULT_BLEND.map((r) => ({ ...r }));
const blendRowsEl = $('#blend-rows');
const blendResults = $('#blend-results');
const addComponentBtn = $<HTMLButtonElement>('#add-component');
let lastBlendCopy = '';

function renderBlendRows(): void {
  blendRowsEl.innerHTML = blendRows
    .map((row, i) => {
      const n = i + 1;
      return `<fieldset class="blend-row" data-index="${i}">
        <legend>Component ${n}</legend>
        <div class="blend-grid">
          <div class="field name">
            <label for="b-name-${i}">Name</label>
            <input type="text" id="b-name-${i}" data-field="name" maxlength="40" value="${esc(row.name)}" autocomplete="off" />
          </div>
          <div class="field">
            <label for="b-energy-${i}">Energy (MJ)</label>
            <input type="number" id="b-energy-${i}" data-field="energy" inputmode="decimal" min="0" step="any" value="${esc(row.energy)}" aria-describedby="b-err-${i}" />
          </div>
          <div class="field">
            <label for="b-e-${i}">E (${UNIT})</label>
            <input type="number" id="b-e-${i}" data-field="e" inputmode="decimal" step="0.1" value="${row.fossil ? '94' : esc(row.e)}" ${row.fossil ? 'disabled' : ''} aria-describedby="b-err-${i}" />
          </div>
        </div>
        <div class="blend-foot">
          <label class="check"><input type="checkbox" data-field="fossil" ${row.fossil ? 'checked' : ''} /> Fossil component (counts as 94)</label>
          <button type="button" class="btn ghost small" data-remove="${i}" ${blendRows.length <= 1 ? 'disabled' : ''} aria-label="Remove component ${n}">Remove</button>
        </div>
        <p class="error" id="b-err-${i}" hidden></p>
      </fieldset>`;
    })
    .join('');
  addComponentBtn.disabled = blendRows.length >= MAX_BLEND_COMPONENTS;
  addComponentBtn.textContent =
    blendRows.length >= MAX_BLEND_COMPONENTS ? 'Maximum of 5 components' : 'Add component';
}

function renderBlend(): void {
  let valid = true;
  const components = blendRows.map((row, i) => {
    const energy = row.energy.trim() === '' ? NaN : Number(row.energy);
    const e = row.fossil ? FOSSIL_COMPARATOR : row.e.trim() === '' ? NaN : Number(row.e);
    const err = document.getElementById(`b-err-${i}`);
    let message = '';
    if (!Number.isFinite(energy) || energy < 0) message = 'Enter an energy amount of 0 or more.';
    else if (!Number.isFinite(e)) message = 'Enter the emission intensity E.';
    if (err) {
      err.textContent = message;
      err.hidden = message === '';
    }
    if (message) valid = false;
    return { energyMJ: energy, e, fossil: row.fossil, name: row.name.trim() || `Component ${i + 1}` };
  });

  if (!valid) {
    lastBlendCopy = '';
    blendResults.innerHTML = `<h3>Blend result</h3><p class="flag warn">Fix the highlighted inputs to see a result.</p>`;
    return;
  }

  const result = blend(components);
  if (!result) {
    lastBlendCopy = '';
    blendResults.innerHTML = `<h3>Blend result</h3><p class="flag warn">Enter an energy amount above 0 for at least one component.</p>`;
    return;
  }

  const rows = components
    .map((c) => {
      const share = (c.energyMJ / result.totalEnergyMJ) * 100;
      return `<tr>
        <th scope="row">${esc(c.name)}${c.fossil ? ' <span class="tag">(fossil)</span>' : ''}</th>
        <td class="num">${fmtInput(c.energyMJ)}</td>
        <td class="num">${fmt(share)}</td>
        <td class="num">${fmt(c.e, 2)}</td>
      </tr>`;
    })
    .join('');

  const bars: Bar[] = components.map((c) => ({
    labelHtml: esc(c.name),
    value: c.e,
    kind: c.fossil ? 'fossil' : 'emission',
  }));
  bars.push({ labelHtml: 'Blend', value: result.intensity, kind: 'total' });
  bars.push({ labelHtml: 'Fossil', value: FOSSIL_COMPARATOR, kind: 'fossil' });

  blendResults.innerHTML = `
    <h3>Blend result</h3>
    <div class="headline">
      <div class="big"><span class="big-label">GHG savings of the blend</span><span class="big-num">${fmt(result.savingsPercent)}%</span></div>
      <div class="big"><span class="big-label">Energy-weighted intensity</span><span class="big-num">${fmt(result.intensity, 2)} <span class="unit">${UNIT}</span></span></div>
    </div>
    <p class="calc-line">(94 − ${fmt(result.intensity, 2)}) / 94 = ${fmt(result.savingsPercent)}%</p>
    <p class="compare">Bio content by energy: <strong>${fmt(result.bioSharePercent)}%</strong>. GHG savings: <strong>${fmt(result.savingsPercent)}%</strong>. The gap comes from the emissions of making the bio components.</p>
    ${savingsNote(result.intensity)}
    <div class="table-wrap">
      <table class="breakdown">
        <caption>Components</caption>
        <thead><tr><th scope="col">Component</th><th scope="col" class="num">Energy<br />MJ</th><th scope="col" class="num">Share<br />%</th><th scope="col" class="num">E<br />${UNIT}</th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th scope="row">Blend</th><td class="num">${fmtInput(result.totalEnergyMJ)}</td><td class="num">100.0</td><td class="num">${fmt(result.intensity, 2)}</td></tr></tfoot>
      </table>
    </div>
    ${renderChart(bars, `Emission intensity of each component and of the blend, ${UNIT}`)}
    <p class="hint">The Art. 29(10) minimum saving applies to the biofuel itself, not to a blend with fossil fuel, so no pass/fail is shown here.</p>
    <button type="button" class="btn primary" data-copy="blend">Copy result</button>
  `;

  lastBlendCopy = [
    `Blend GHG savings, ${LABEL}`,
    ...components.map(
      (c) => `- ${c.name}${c.fossil ? ' (fossil)' : ''}: ${fmtInput(c.energyMJ)} MJ at ${fmt(c.e)} ${UNIT}`,
    ),
    `Energy-weighted intensity = ${fmt(result.intensity, 2)} ${UNIT}`,
    `GHG savings = (94 − ${fmt(result.intensity, 2)}) / 94 = ${fmt(result.savingsPercent)}%`,
    `Bio content by energy = ${fmt(result.bioSharePercent)}%`,
    DISCLAIMER,
  ].join('\n');
}

function initBlend(): void {
  renderBlendRows();
  renderBlend();

  blendRowsEl.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    const rowEl = target.closest<HTMLElement>('.blend-row');
    if (!rowEl) return;
    const row = blendRows[Number(rowEl.dataset.index)];
    const field = target.dataset.field;
    if (field === 'name') row.name = target.value;
    else if (field === 'energy') row.energy = target.value;
    else if (field === 'e') row.e = target.value;
    else if (field === 'fossil') {
      row.fossil = target.checked;
      const eInput = rowEl.querySelector<HTMLInputElement>('[data-field="e"]')!;
      eInput.disabled = row.fossil;
      if (row.fossil) eInput.value = '94';
      else eInput.value = row.e === '94' ? '' : row.e;
      if (!row.fossil) row.e = eInput.value;
    }
    renderBlend();
  });

  blendRowsEl.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-remove]');
    if (!btn) return;
    const index = Number(btn.dataset.remove);
    blendRows.splice(index, 1);
    renderBlendRows();
    renderBlend();
    announce(`Component ${index + 1} removed.`);
    addComponentBtn.focus();
  });

  addComponentBtn.addEventListener('click', () => {
    if (blendRows.length >= MAX_BLEND_COMPONENTS) return;
    blendRows.push({ name: `Component ${blendRows.length + 1}`, fossil: false, energy: '0', e: '0' });
    renderBlendRows();
    renderBlend();
    document.getElementById(`b-name-${blendRows.length - 1}`)?.focus();
  });

  $('#reset-blend').addEventListener('click', () => {
    blendRows = DEFAULT_BLEND.map((r) => ({ ...r }));
    renderBlendRows();
    renderBlend();
    announce('Blend reset.');
  });

  $('#blend-form').addEventListener('submit', (e) => e.preventDefault());
}

/* ---------- Shared ---------- */

function initModeSwitch(): void {
  const single = $('#panel-single');
  const blendPanel = $('#panel-blend');
  for (const radio of document.querySelectorAll<HTMLInputElement>('input[name="mode"]')) {
    radio.addEventListener('change', () => {
      if (!radio.checked) return;
      single.hidden = radio.value !== 'single';
      blendPanel.hidden = radio.value !== 'blend';
    });
  }
}

function initCopy(): void {
  document.addEventListener('click', async (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-copy]');
    if (!btn) return;
    const text = btn.dataset.copy === 'blend' ? lastBlendCopy : lastSingleCopy;
    if (!text) return;
    const ok = await copyText(text);
    announce(ok ? 'Result copied to clipboard.' : 'Copying failed. Select the result and copy it manually.');
    if (ok) {
      btn.textContent = 'Copied';
      window.setTimeout(() => {
        if (btn.isConnected) btn.textContent = 'Copy result';
      }, 2000);
    }
  });
}

function initExplainer(): void {
  $('#term-list').innerHTML = TERMS.map(
    (term) =>
      `<div class="term"><dt><span class="sym">${sym(term)}</span> ${esc(term.label)}</dt><dd>${esc(term.explain)}</dd></div>`,
  ).join('');
}

initModeSwitch();
initSingle();
initBlend();
initCopy();
initExplainer();
