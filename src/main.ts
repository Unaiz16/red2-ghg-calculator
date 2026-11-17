import {
  CREDIT_TERMS,
  EMISSION_TERMS,
  FOSSIL_COMPARATOR,
  MAX_BLEND_COMPONENTS,
  ZERO_INPUTS,
  blend,
  isIsoDate,
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

interface Segment {
  /** Short label, trusted HTML (symbol or escaped name). */
  labelHtml: string;
  /** Plain-text name for tooltips and screen readers. */
  name: string;
  /** Signed contribution in gCO2eq/MJ: positive adds, negative subtracts. */
  value: number;
  tone?: 'fossil';
}

interface ChartSpec {
  caption: string;
  addedLabel: string;
  totalLabel: string;
  segments: Segment[];
  total: number;
  /** Minimum saving in percent; draws the threshold line when set. */
  thresholdPercent?: number;
}

function renderChart(spec: ChartSpec): string {
  const added = spec.segments.filter((sg) => sg.value > 0);
  const subtracted = spec.segments.filter((sg) => sg.value < 0);
  const gross = added.reduce((sum, sg) => sum + sg.value, 0);
  const lo = Math.min(0, spec.total);
  const hi = Math.max(FOSSIL_COMPARATOR, gross) * 1.04;
  const x = (v: number) => ((v - lo) / (hi - lo)) * 100;
  const pct = (v: number) => `${v.toFixed(3)}%`;

  const seg = (sg: Segment, from: number, to: number, cls: string) => {
    const tip = `${sg.name}: ${fmt(sg.value, 2)} ${UNIT}`;
    return `<span class="seg ${cls}" style="left:${pct(x(from))};width:${pct(x(to) - x(from))}" tabindex="0" role="img" aria-label="${esc(tip)}" data-tip="${esc(tip)}"></span>`;
  };

  let cursor = 0;
  let tint = 0;
  const addedSegs = added
    .map((sg) => {
      const from = cursor;
      cursor += sg.value;
      const cls = sg.tone === 'fossil' ? 'fossil' : `t${tint++ % 5}`;
      return { sg, cls, html: seg(sg, from, cursor, cls) };
    });

  let back = gross;
  const subtractedSegs = subtracted.map((sg) => {
    const to = back;
    back += sg.value;
    return seg(sg, back, to, 'minus');
  });

  const totalTip = `${spec.totalLabel}: ${fmt(spec.total, 2)} ${UNIT}`;
  const totalSeg = `<span class="seg total" style="left:${pct(x(Math.min(0, spec.total)))};width:${pct(Math.abs(x(spec.total) - x(0)))}" tabindex="0" role="img" aria-label="${esc(totalTip)}" data-tip="${esc(totalTip)}"></span>`;

  const limit =
    spec.thresholdPercent === undefined ? undefined : FOSSIL_COMPARATOR * (1 - spec.thresholdPercent / 100);

  const lines = [
    lo < 0 ? `<span class="vline zero" style="left:${pct(x(0))}"></span>` : '',
    limit === undefined ? '' : `<span class="vline threshold" style="left:${pct(x(limit))}"></span>`,
    `<span class="vline comparator" style="left:${pct(x(FOSSIL_COMPARATOR))}"></span>`,
  ].join('');

  const row = (label: string, content: string, cls = '') =>
    `<div class="plot-row ${cls}"><span class="plot-label">${label}</span><span class="track">${content}</span></div>`;

  const legend = [
    ...addedSegs.map(
      ({ sg, cls }) => `<li><span class="key ${cls}"></span>${sg.labelHtml} <span class="num">${fmt(sg.value, 2)}</span></li>`,
    ),
    ...subtracted.map(
      (sg) => `<li><span class="key minus"></span>${sg.labelHtml} <span class="num">${fmt(sg.value, 2)}</span></li>`,
    ),
    `<li><span class="key total"></span>${esc(spec.totalLabel)} <span class="num">${fmt(spec.total, 2)}</span></li>`,
  ].join('');

  const mid = (lo + hi / 1.04) / 2;
  return `<figure class="chart">
    <figcaption>${spec.caption}</figcaption>
    <div class="plot">
      <div class="plot-row marks" aria-hidden="true"><span class="plot-label"></span><span class="track">
        <span class="mark comparator" style="left:${pct(x(FOSSIL_COMPARATOR))}">Fossil comparator 94</span>
        ${limit === undefined ? '' : `<span class="mark threshold" style="left:${pct(x(limit))}">${spec.thresholdPercent}% minimum</span>`}
      </span></div>
      <div class="plot-body">
        ${row(esc(spec.addedLabel), addedSegs.map((a) => a.html).join(''))}
        ${subtractedSegs.length ? row('Subtracted', subtractedSegs.join('')) : ''}
        ${row(esc(spec.totalLabel), totalSeg, 'net')}
        <div class="plot-lines" aria-hidden="true"><span class="plot-label"></span><span class="track">${lines}</span></div>
      </div>
      <div class="plot-row axis" aria-hidden="true"><span class="plot-label">${UNIT}</span><span class="track">
        <span class="tick" style="left:${pct(x(lo))}">${fmtInput(lo)}</span>
        <span class="tick" style="left:${pct(x(mid))}">${fmtInput(mid)}</span>
        <span class="tick" style="left:${pct(x(hi / 1.04))}">${fmtInput(hi / 1.04)}</span>
      </span></div>
    </div>
    <ul class="chart-legend">${legend}</ul>
    <p class="hint">${
      limit === undefined
        ? `Solid line: fossil fuel comparator, 94 ${UNIT}.`
        : `Solid line: fossil fuel comparator, 94 ${UNIT}. Dashed line: E must be at or below ${fmt(limit, 2)} ${UNIT} to save ${spec.thresholdPercent}%.`
    } Hover, tap or focus a bar for the exact value.</p>
  </figure>`;
}

/* Floating tooltip for chart segments: hover, tap and keyboard focus. */
function initChartTooltips(): void {
  const tip = document.createElement('div');
  tip.className = 'chart-tip';
  tip.hidden = true;
  tip.setAttribute('aria-hidden', 'true');
  document.body.appendChild(tip);
  let current: HTMLElement | null = null;

  const show = (el: HTMLElement) => {
    current = el;
    tip.textContent = el.dataset.tip ?? '';
    tip.hidden = false;
    const r = el.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const left = Math.min(Math.max(8, r.left + r.width / 2 - t.width / 2), window.innerWidth - t.width - 8);
    const above = r.top - t.height - 6;
    tip.style.left = `${left + window.scrollX}px`;
    tip.style.top = `${(above < 4 ? r.bottom + 6 : above) + window.scrollY}px`;
  };
  const hide = () => {
    current = null;
    tip.hidden = true;
  };
  const target = (e: Event) => (e.target instanceof Element ? e.target.closest<HTMLElement>('[data-tip]') : null);

  document.addEventListener('pointerover', (e) => {
    const el = target(e);
    if (el) show(el);
    else if (current && !current.matches(':focus-visible')) hide();
  });
  document.addEventListener('focusin', (e) => {
    const el = target(e);
    if (el) show(el);
    else hide();
  });
  document.addEventListener('click', (e) => {
    const el = target(e);
    if (el) show(el);
    else hide();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide();
  });
  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);
  // Results re-render on every input; drop a tooltip whose bar is gone.
  new MutationObserver(() => {
    if (current && !current.isConnected) hide();
  }).observe(document.body, { childList: true, subtree: true });
}

/* ---------- Number transitions (≤ 200 ms, off with reduced motion) ---------- */

const previousValues = new Map<string, number>();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function animNum(key: string, value: number, decimals: number, suffix = ''): string {
  return `<span data-anim="${key}" data-value="${value}" data-dec="${decimals}" data-suffix="${suffix}">${fmt(value, decimals)}${suffix}</span>`;
}

function runNumberTransitions(root: HTMLElement): void {
  for (const el of root.querySelectorAll<HTMLElement>('[data-anim]')) {
    const key = el.dataset.anim!;
    const to = Number(el.dataset.value);
    const decimals = Number(el.dataset.dec);
    const suffix = el.dataset.suffix ?? '';
    const from = previousValues.get(key);
    previousValues.set(key, to);
    if (from === undefined || from === to || reducedMotion.matches) continue;
    const start = performance.now();
    const duration = 180;
    const step = (now: number) => {
      if (!el.isConnected) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      el.textContent = `${fmt(from + (to - from) * eased, decimals)}${suffix}`;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
}

/* ---------- Shareable link: inputs live in the URL ---------- */

let urlTimer: number | undefined;
function scheduleUrlUpdate(): void {
  window.clearTimeout(urlTimer);
  urlTimer = window.setTimeout(() => {
    try {
      history.replaceState(null, '', `${location.pathname}?${buildQuery()}`);
    } catch {
      // history can be unavailable (e.g. file://); sharing still works via the button.
    }
  }, 250);
}

function shareUrl(): string {
  return `${location.origin}${location.pathname}?${buildQuery()}`;
}

function currentMode(): 'single' | 'blend' {
  return document.querySelector<HTMLInputElement>('input[name="mode"]:checked')?.value === 'blend' ? 'blend' : 'single';
}

function buildQuery(): string {
  const q = new URLSearchParams();
  q.set('mode', currentMode());
  if (currentMode() === 'blend') {
    for (const row of blendRows) {
      q.append('c', [row.name.replace(/~/g, ' '), row.fossil ? 'f' : 'b', row.energy, row.fossil ? '' : row.e].join('~'));
    }
    return q.toString();
  }
  if (presetSelect.value) q.set('preset', presetSelect.value);
  for (const term of TERMS) {
    const v = termInput(term.key).value.trim();
    if (v !== '' && Number(v) !== 0) q.set(term.key, v);
  }
  if (startDate.value) q.set('start', startDate.value);
  return q.toString();
}

function applyQuery(): void {
  const q = new URLSearchParams(location.search);
  if ([...q.keys()].length === 0) return;

  const preset = q.get('preset');
  const hasTerms = TERMS.some((t) => q.has(t.key));
  if (preset && PRESETS.some((p) => p.id === preset)) {
    presetSelect.value = preset;
    applyPreset(preset);
  } else if (hasTerms || q.has('mode')) {
    presetSelect.value = '';
    for (const term of TERMS) termInput(term.key).value = '0';
  }
  for (const term of TERMS) {
    const raw = q.get(term.key);
    if (raw !== null && raw.trim() !== '' && Number.isFinite(Number(raw))) termInput(term.key).value = String(Number(raw));
  }
  // A link with edited values is a custom calculation, as in the form itself.
  const active = PRESETS.find((p) => p.id === presetSelect.value);
  if (active) {
    const expected: Partial<Record<TermKey, number>> = { eec: active.eec, ep: active.ep, etd: active.etd };
    const edited = TERMS.some((t) => t.key !== 'el' && Number(termInput(t.key).value) !== (expected[t.key] ?? 0));
    if (edited) presetSelect.value = '';
  }
  const start = q.get('start');
  if (start && isIsoDate(start)) startDate.value = start;

  const comps = q.getAll('c').slice(0, MAX_BLEND_COMPONENTS);
  const rows: BlendRow[] = [];
  for (const c of comps) {
    const [name = '', kind = 'b', energy = '', e = ''] = c.split('~');
    const num = (v: string) => (v.trim() !== '' && Number.isFinite(Number(v)) ? String(Number(v)) : '');
    rows.push({ name: name.slice(0, 40), fossil: kind === 'f', energy: num(energy), e: kind === 'f' ? '94' : num(e) });
  }
  if (rows.length) blendRows = rows;

  if (q.get('mode') === 'blend') {
    const radio = $<HTMLInputElement>('input[name="mode"][value="blend"]');
    radio.checked = true;
  }
}

const ACTIONS = (mode: 'single' | 'blend') => `<div class="row-actions">
    <button type="button" class="btn primary" data-copy="${mode}">Copy result</button>
    <button type="button" class="btn" data-copy-link>Copy link</button>
    <button type="button" class="btn" data-print>Print</button>
  </div>`;

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
  scheduleUrlUpdate();
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
    const gap = round(saving, 1) - threshold.percent;
    const gapText =
      round(gap, 1) === 0
        ? 'exactly at the threshold'
        : `${fmt(Math.abs(gap))} percentage points ${pass ? 'above' : 'below'} the threshold`;
    badge = `<div class="verdict ${pass ? 'pass' : 'fail'}">
      <span class="badge">${pass ? 'Pass' : 'Fail'}</span>
      <p><strong>${gapText.charAt(0).toUpperCase()}${gapText.slice(1)}.</strong> ${pass ? 'Meets' : 'Does not meet'} the ${threshold.percent}% minimum of Art. 29(10)(${threshold.point}) for an installation that started operation on ${fmtDate(startDate.value)}.</p>
    </div>`;
    thresholdLine = `Threshold Art. 29(10)(${threshold.point}), installation start ${fmtDate(startDate.value)}: ${threshold.percent}% minimum: ${pass ? 'PASS' : 'FAIL'} (${gapText})`;
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

  const segments: Segment[] = TERMS.map((term) => {
    const credit = (CREDIT_TERMS as readonly string[]).includes(term.key);
    return {
      labelHtml: sym(term),
      name: `${term.key}, ${term.label.toLowerCase()}`,
      value: (credit ? -inputs[term.key] : inputs[term.key]) + 0,
    };
  });

  const preset = PRESETS.find((p) => p.id === presetSelect.value);

  singleResults.innerHTML = `
    <h3>Result</h3>
    <div class="headline">
      <div class="big"><span class="big-label">GHG savings</span><span class="big-num">${animNum('s-saving', saving, 1, '%')}</span></div>
      <div class="big"><span class="big-label">Total emissions E</span><span class="big-num">${animNum('s-e', e, 2)} <span class="unit">${UNIT}</span></span></div>
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
    ${renderChart({
      caption: `Contribution of each term, ${UNIT}`,
      addedLabel: 'Emissions',
      totalLabel: 'E (total)',
      segments,
      total: e,
      thresholdPercent: threshold?.percent,
    })}
    ${ACTIONS('single')}
  `;
  runNumberTransitions(singleResults);

  const termText = (keys: readonly TermKey[], sign: string) =>
    keys.map((k) => `${sign} ${k} ${fmtInput(inputs[k])}`).join(' ');
  lastSingleCopy = [
    `Biofuel GHG savings, ${LABEL}`,
    preset ? `Pathway: ${preset.name} (Annex V default values)` : '',
    `E = ${fmt(e, 2)} ${UNIT} (${termText(EMISSION_TERMS, '+').replace(/^\+ /, '')} ${termText(CREDIT_TERMS, '−')})`,
    `GHG savings = (94 − ${fmt(e, 2)}) / 94 = ${fmt(saving)}%`,
    e < 0 ? 'Note: net-negative emissions, saving above 100%.' : '',
    thresholdLine,
    `Link: ${shareUrl()}`,
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
  scheduleUrlUpdate();
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

  const segments: Segment[] = components
    .filter((c) => c.energyMJ > 0)
    .map((c) => ({
      labelHtml: esc(c.name),
      name: `${c.name}, ${fmt((c.energyMJ / result.totalEnergyMJ) * 100)}% of the energy at ${fmt(c.e, 2)} ${UNIT}, contributes`,
      value: ((c.energyMJ / result.totalEnergyMJ) * c.e) + 0,
      tone: c.fossil ? ('fossil' as const) : undefined,
    }));

  blendResults.innerHTML = `
    <h3>Blend result</h3>
    <div class="headline">
      <div class="big"><span class="big-label">GHG savings of the blend</span><span class="big-num">${animNum('b-saving', result.savingsPercent, 1, '%')}</span></div>
      <div class="big"><span class="big-label">Energy-weighted intensity</span><span class="big-num">${animNum('b-e', result.intensity, 2)} <span class="unit">${UNIT}</span></span></div>
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
    ${renderChart({
      caption: `Contribution of each component to the blend, ${UNIT}`,
      addedLabel: 'Components',
      totalLabel: 'Blend',
      segments,
      total: result.intensity,
    })}
    <p class="hint">The Art. 29(10) minimum saving applies to the biofuel itself, not to a blend with fossil fuel, so no pass/fail is shown here.</p>
    ${ACTIONS('blend')}
  `;
  runNumberTransitions(blendResults);

  lastBlendCopy = [
    `Blend GHG savings, ${LABEL}`,
    ...components.map(
      (c) => `- ${c.name}${c.fossil ? ' (fossil)' : ''}: ${fmtInput(c.energyMJ)} MJ at ${fmt(c.e)} ${UNIT}`,
    ),
    `Energy-weighted intensity = ${fmt(result.intensity, 2)} ${UNIT}`,
    `GHG savings = (94 − ${fmt(result.intensity, 2)}) / 94 = ${fmt(result.savingsPercent)}%`,
    `Bio content by energy = ${fmt(result.bioSharePercent)}%`,
    `Link: ${shareUrl()}`,
    DISCLAIMER,
  ].join('\n');
}

function initBlend(): void {

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
  const sync = () => {
    single.hidden = currentMode() !== 'single';
    blendPanel.hidden = currentMode() !== 'blend';
  };
  for (const radio of document.querySelectorAll<HTMLInputElement>('input[name="mode"]')) {
    radio.addEventListener('change', () => {
      sync();
      scheduleUrlUpdate();
    });
  }
  sync();
}

function initCopy(): void {
  document.addEventListener('click', async (event) => {
    const el = event.target as HTMLElement;
    if (el.closest('[data-print]')) {
      window.print();
      return;
    }
    const linkBtn = el.closest<HTMLButtonElement>('[data-copy-link]');
    if (linkBtn) {
      const done = await copyText(shareUrl());
      announce(done ? 'Link copied. It opens the calculator with these inputs.' : 'Copying failed. Copy the address from the browser instead.');
      return;
    }
    const btn = el.closest<HTMLButtonElement>('[data-copy]');
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

initSingle();
initBlend();
applyQuery();
initModeSwitch();
renderBlendRows();
renderSingle();
renderBlend();
initCopy();
initChartTooltips();
initExplainer();
