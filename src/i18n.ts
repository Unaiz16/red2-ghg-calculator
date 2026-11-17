import type { TermKey } from './calc';

export type Lang = 'en' | 'de';

const UNIT = 'gCO₂eq/MJ';

interface TermText {
  label: string;
  hint?: string;
  explain: string;
}

/** All text produced by the script. Static page text lives in index.html (EN) and STATIC_DE. */
export interface Messages {
  decimal: string;
  /** Formats an already formatted number as a percentage. */
  percent: (n: string) => string;
  docTitle: string;
  metaDescription: string;
  disclaimer: string;
  label: string;
  terms: Record<TermKey, TermText>;
  escaTooltip: string;
  escaInfoLabel: string;
  presets: Record<string, string>;
  customValues: string;
  presetPick: string;
  presetNote: (sum: string, total: string, saving: string) => string;
  presetElWarning: string;
  errNumber: string;
  errNonNegative: string;
  result: string;
  fixInputs: string;
  ghgSavings: string;
  totalEmissions: string;
  noDate: string;
  noDateCopy: string;
  pass: string;
  fail: string;
  passCopy: string;
  failCopy: string;
  gapExact: string;
  gap: (points: string, above: boolean) => string;
  verdict: (pass: boolean, percent: number, point: string, date: string) => string;
  thresholdCopy: (point: string, date: string, percent: number, outcome: string, gap: string) => string;
  netNegative: string;
  noSaving: string;
  netNegativeCopy: string;
  breakdown: string;
  term: string;
  eTotal: string;
  comparatorRow: string;
  chartTermsCaption: string;
  chartEmissions: string;
  chartSubtracted: string;
  chartComparator: string;
  chartMinimum: (percent: number) => string;
  chartHintSolid: string;
  chartHintDashed: (limit: string, percent: number) => string;
  chartHintTip: string;
  tipTerm: (key: string, label: string) => string;
  copyResult: string;
  copied: string;
  copyLink: string;
  print: string;
  copyTitleSingle: string;
  copyPathway: (name: string) => string;
  link: string;
  // blend
  component: (n: number) => string;
  name: string;
  energy: string;
  fossilCheck: string;
  remove: string;
  removeLabel: (n: number) => string;
  addComponent: string;
  maxComponents: string;
  errEnergy: string;
  errIntensity: string;
  blendResult: string;
  errNoEnergy: string;
  blendSavings: string;
  blendIntensity: string;
  blendCompare: (bio: string, saving: string) => string;
  components: string;
  componentCol: string;
  energyCol: string;
  shareCol: string;
  fossilTag: string;
  blend: string;
  chartBlendCaption: string;
  tipComponent: (name: string, share: string, e: string) => string;
  blendNoThreshold: string;
  copyTitleBlend: string;
  copyComponent: (name: string, fossil: boolean, mj: string, e: string) => string;
  copyIntensity: string;
  copyBio: string;
  defaultBio: string;
  defaultFossil: string;
  // status
  inputsReset: string;
  blendReset: string;
  componentRemoved: (n: number) => string;
  linkCopied: string;
  linkFailed: string;
  resultCopied: string;
  resultFailed: string;
}

export const EN: Messages = {
  decimal: '.',
  percent: (n) => `${n}%`,
  docTitle: 'RED II GHG Savings Calculator (as amended by RED III)',
  metaDescription:
    'Free educational calculator for the greenhouse gas savings of a biofuel under RED II as amended by RED III (Directive (EU) 2018/2001, amended by Directive (EU) 2023/2413).',
  disclaimer:
    "Educational tool. Not for certification, audits or official GHG reporting. Use certified values and your certification scheme's rules.",
  label: 'RED II as amended by RED III (Directive (EU) 2018/2001, amended by Directive (EU) 2023/2413)',
  escaTooltip:
    'Since RED III, soil-carbon savings count only with solid, verifiable evidence that soil carbon has increased, with no risk of harming biodiversity, and after accounting for any extra fertiliser or herbicide use (Annex V Part C point 6 as amended).',
  escaInfoLabel: 'Soil carbon savings since RED III: more information',
  terms: {
    eec: {
      label: 'Extraction or cultivation of raw materials',
      explain:
        'Emissions from growing or extracting the raw material, for example fertiliser production, field emissions and diesel for machinery. For wastes and residues such as used cooking oil it is zero, because they carry no emissions up to the point of collection. For crop-based fuels it is often the largest term.',
    },
    el: {
      label: 'Carbon stock changes from land-use change',
      hint: 'Annualised. Annex V default values apply only if this is 0 or below.',
      explain:
        'Annualised emissions from carbon stock changes when land is converted to grow the feedstock, for example grassland turned into cropland. It is zero when no land-use change took place. Annex V default values may only be used when this term is zero or below.',
    },
    ep: {
      label: 'Processing',
      explain:
        'Emissions from turning the raw material into fuel: heat, electricity and chemicals used at the plant. The process fuel makes a large difference, which is why Annex V lists several pathways for the same crop.',
    },
    etd: {
      label: 'Transport and distribution',
      explain:
        'Emissions from moving and storing the raw materials, intermediate products and the finished fuel. Long supply routes raise this term. Among the presets here, sugar cane ethanol has the highest default value.',
    },
    eu: {
      label: 'Fuel in use',
      hint: '0 for biofuels (Annex V Part C point 13).',
      explain:
        'Emissions from burning the fuel. For biofuels this term is taken to be zero (Annex V Part C point 13). The field is kept so the formula is complete; leave it at 0.',
    },
    esca: {
      label: 'Soil carbon accumulation',
      hint: 'Via improved agricultural management.',
      explain:
        'Emission savings from building up carbon in the soil through improved agricultural management. Since RED III, soil-carbon savings count only with solid, verifiable evidence that soil carbon has increased, with no risk of harming biodiversity, and after accounting for any extra fertiliser or herbicide use (Annex V Part C point 6 as amended).',
    },
    eccs: {
      label: 'CO₂ capture and geological storage',
      explain:
        'Emission savings from capturing CO₂ released during the production of the fuel and storing it permanently underground. Only emissions that are actually avoided this way count, and only if they are not already counted in the processing term.',
    },
    eccr: {
      label: 'CO₂ capture and replacement',
      explain:
        'Emission savings from capturing CO₂ of biomass origin and using it to replace fossil-derived CO₂ in commercial products and services. Like the other two savings terms, it is subtracted from the total.',
    },
  },
  presets: {
    'wco-biodiesel': 'Waste cooking oil biodiesel',
    'wco-hvo': 'Hydrotreated oil from waste cooking oil (HVO)',
    'rapeseed-biodiesel': 'Rape seed biodiesel',
    'sugar-beet-ethanol':
      'Sugar beet ethanol (no biogas from slop, natural gas as process fuel in conventional boiler)',
    'sugar-cane-ethanol': 'Sugar cane ethanol',
  },
  customValues: 'Custom values',
  presetPick: 'Pick a pathway to fill in its default values, or enter your own.',
  presetNote: (sum, total, saving) =>
    `Part D default values: ${sum} = ${total} ${UNIT}. Part A default saving: ${saving}.`,
  presetElWarning: 'Default values may only be used when e<sub>l</sub> is zero or below.',
  errNumber: 'Enter a number.',
  errNonNegative: 'Enter 0 or more.',
  result: 'Result',
  fixInputs: 'Fix the highlighted inputs to see a result.',
  ghgSavings: 'GHG savings',
  totalEmissions: 'Total emissions E',
  noDate: 'Enter a valid installation start date to check the threshold.',
  noDateCopy: 'Threshold: no valid installation start date given',
  pass: 'Pass',
  fail: 'Fail',
  passCopy: 'PASS',
  failCopy: 'FAIL',
  gapExact: 'Exactly at the threshold',
  gap: (points, above) => `${points} percentage points ${above ? 'above' : 'below'} the threshold`,
  verdict: (pass, percent, point, date) =>
    `${pass ? 'Meets' : 'Does not meet'} the ${percent}% minimum of Art. 29(10)(${point}) for an installation that started operation on ${date}.`,
  thresholdCopy: (point, date, percent, outcome, gap) =>
    `Threshold Art. 29(10)(${point}), installation start ${date}: ${percent}% minimum: ${outcome} (${gap})`,
  netNegative:
    '<strong>Net-negative emissions.</strong> E is below zero because the savings terms are larger than the emissions, so the saving is above 100%. Check that the soil carbon and CO₂ capture values are backed by evidence.',
  noSaving: `<strong>No saving.</strong> E is above the fossil comparator of 94 ${UNIT}, so this pathway emits more than the fossil fuel it replaces.`,
  netNegativeCopy: 'Note: net-negative emissions, saving above 100%.',
  breakdown: 'Breakdown by term',
  term: 'Term',
  eTotal: 'E (total)',
  comparatorRow: 'Fossil fuel comparator E<sub>F(t)</sub>, Part C point 19',
  chartTermsCaption: `Contribution of each term, ${UNIT}`,
  chartEmissions: 'Emissions',
  chartSubtracted: 'Subtracted',
  chartComparator: 'Fossil comparator 94',
  chartMinimum: (percent) => `${percent}% minimum`,
  chartHintSolid: `Solid line: fossil fuel comparator, 94 ${UNIT}.`,
  chartHintDashed: (limit, percent) => `Dashed line: E must be at or below ${limit} ${UNIT} to save ${percent}%.`,
  chartHintTip: 'Hover, tap or focus a bar for the exact value.',
  tipTerm: (key, label) => `${key}, ${label.toLowerCase()}`,
  copyResult: 'Copy result',
  copied: 'Copied',
  copyLink: 'Copy link',
  print: 'Print',
  copyTitleSingle: 'Biofuel GHG savings',
  copyPathway: (name) => `Pathway: ${name} (Annex V default values)`,
  link: 'Link',
  component: (n) => `Component ${n}`,
  name: 'Name',
  energy: 'Energy (MJ)',
  fossilCheck: 'Fossil component (counts as 94)',
  remove: 'Remove',
  removeLabel: (n) => `Remove component ${n}`,
  addComponent: 'Add component',
  maxComponents: 'Maximum of 5 components',
  errEnergy: 'Enter an energy amount of 0 or more.',
  errIntensity: 'Enter the emission intensity E.',
  blendResult: 'Blend result',
  errNoEnergy: 'Enter an energy amount above 0 for at least one component.',
  blendSavings: 'GHG savings of the blend',
  blendIntensity: 'Energy-weighted intensity',
  blendCompare: (bio, saving) =>
    `Bio content by energy: <strong>${bio}</strong>. GHG savings: <strong>${saving}</strong>. The gap comes from the emissions of making the bio components.`,
  components: 'Components',
  componentCol: 'Component',
  energyCol: 'Energy',
  shareCol: 'Share',
  fossilTag: '(fossil)',
  blend: 'Blend',
  chartBlendCaption: `Contribution of each component to the blend, ${UNIT}`,
  tipComponent: (name, share, e) => `${name}, ${share} of the energy at ${e} ${UNIT}, contributes`,
  blendNoThreshold:
    'The Art. 29(10) minimum saving applies to the biofuel itself, not to a blend with fossil fuel, so no pass/fail is shown here.',
  copyTitleBlend: 'Blend GHG savings',
  copyComponent: (name, fossil, mj, e) => `- ${name}${fossil ? ' (fossil)' : ''}: ${mj} MJ at ${e} ${UNIT}`,
  copyIntensity: 'Energy-weighted intensity',
  copyBio: 'Bio content by energy',
  defaultBio: 'Biofuel',
  defaultFossil: 'Fossil fuel',
  inputsReset: 'Inputs reset.',
  blendReset: 'Blend reset.',
  componentRemoved: (n) => `Component ${n} removed.`,
  linkCopied: 'Link copied. It opens the calculator with these inputs.',
  linkFailed: 'Copying failed. Copy the address from the browser instead.',
  resultCopied: 'Result copied to clipboard.',
  resultFailed: 'Copying failed. Select the result and copy it manually.',
};

export const DE: Messages = {
  decimal: ',',
  percent: (n) => `${n} %`,
  docTitle: 'RED-II-Rechner für THG-Einsparungen (in der Fassung der RED III)',
  metaDescription:
    'Kostenloser Lernrechner für die Treibhausgaseinsparung eines Biokraftstoffs nach RED II in der durch RED III geänderten Fassung (Richtlinie (EU) 2018/2001, geändert durch Richtlinie (EU) 2023/2413).',
  disclaimer:
    'Lernwerkzeug. Nicht für Zertifizierung, Audits oder offizielle THG-Berichterstattung. Verwenden Sie zertifizierte Werte und die Regeln Ihres Zertifizierungssystems.',
  label:
    'RED II in der durch RED III geänderten Fassung (Richtlinie (EU) 2018/2001, geändert durch Richtlinie (EU) 2023/2413)',
  escaTooltip:
    'Seit RED III zählen Einsparungen durch Bodenkohlenstoff nur, wenn belastbar und überprüfbar nachgewiesen ist, dass der Kohlenstoffgehalt des Bodens gestiegen ist, wenn keine Gefahr für die Biodiversität besteht und wenn ein zusätzlicher Einsatz von Dünge- oder Pflanzenschutzmitteln (Herbiziden) berücksichtigt wird (Anhang V Teil C Nummer 6 in der geänderten Fassung).',
  escaInfoLabel: 'Einsparungen durch Bodenkohlenstoff seit RED III: weitere Informationen',
  terms: {
    eec: {
      label: 'Gewinnung oder Anbau der Rohstoffe',
      explain:
        'Emissionen aus dem Anbau oder der Gewinnung des Rohstoffs, zum Beispiel Düngerherstellung, Feldemissionen und Diesel für Maschinen. Für Abfälle und Reststoffe wie Altspeiseöl ist der Wert null, weil ihnen bis zur Sammlung keine Emissionen zugerechnet werden. Bei Kraftstoffen aus Anbaubiomasse ist dies oft der größte Term.',
    },
    el: {
      label: 'Kohlenstoffbestandsänderungen durch Landnutzungsänderungen',
      hint: 'Auf das Jahr umgerechnet. Standardwerte nach Anhang V gelten nur, wenn dieser Wert 0 oder kleiner ist.',
      explain:
        'Auf das Jahr umgerechnete Emissionen aus Kohlenstoffbestandsänderungen, wenn Flächen für den Rohstoffanbau umgewandelt werden, zum Beispiel Grünland in Ackerland. Ohne Landnutzungsänderung ist der Wert null. Die Standardwerte nach Anhang V dürfen nur verwendet werden, wenn dieser Term null oder kleiner ist.',
    },
    ep: {
      label: 'Verarbeitung',
      explain:
        'Emissionen aus der Umwandlung des Rohstoffs in Kraftstoff: Wärme, Strom und Chemikalien in der Anlage. Der Prozessbrennstoff macht einen großen Unterschied. Deshalb führt Anhang V für denselben Rohstoff mehrere Herstellungswege auf.',
    },
    etd: {
      label: 'Transport und Vertrieb',
      explain:
        'Emissionen aus Transport und Lagerung der Rohstoffe, der Zwischenprodukte und des fertigen Kraftstoffs. Lange Lieferwege erhöhen diesen Term. Unter den Voreinstellungen hier hat Ethanol aus Zuckerrohr den höchsten Standardwert.',
    },
    eu: {
      label: 'Nutzung des Kraftstoffs',
      hint: '0 für Biokraftstoffe (Anhang V Teil C Nummer 13).',
      explain:
        'Emissionen aus der Verbrennung des Kraftstoffs. Für Biokraftstoffe wird dieser Term mit null angesetzt (Anhang V Teil C Nummer 13). Das Feld bleibt erhalten, damit die Formel vollständig ist; lassen Sie es bei 0.',
    },
    esca: {
      label: 'Akkumulierung von Kohlenstoff im Boden',
      hint: 'Durch bessere landwirtschaftliche Bewirtschaftung.',
      explain:
        'Emissionseinsparungen durch den Aufbau von Kohlenstoff im Boden infolge besserer landwirtschaftlicher Bewirtschaftung. Seit RED III zählen sie nur, wenn belastbar und überprüfbar nachgewiesen ist, dass der Kohlenstoffgehalt des Bodens gestiegen ist, wenn keine Gefahr für die Biodiversität besteht und wenn ein zusätzlicher Einsatz von Dünge- oder Pflanzenschutzmitteln (Herbiziden) berücksichtigt wird (Anhang V Teil C Nummer 6 in der geänderten Fassung).',
    },
    eccs: {
      label: 'CO₂-Abscheidung und geologische Speicherung',
      explain:
        'Emissionseinsparungen durch die Abscheidung von CO₂, das bei der Herstellung des Kraftstoffs entsteht, und seine dauerhafte Speicherung im Untergrund. Es zählen nur Emissionen, die so tatsächlich vermieden werden und nicht schon im Term Verarbeitung berücksichtigt sind.',
    },
    eccr: {
      label: 'CO₂-Abscheidung und -Ersetzung',
      explain:
        'Emissionseinsparungen durch die Abscheidung von CO₂ aus Biomasse, das fossiles CO₂ in gewerblichen Produkten und Dienstleistungen ersetzt. Wie die beiden anderen Einsparterme wird er von der Summe abgezogen.',
    },
  },
  presets: {
    'wco-biodiesel': 'Biodiesel aus Altspeiseöl',
    'wco-hvo': 'Hydriertes Öl aus Altspeiseöl (HVO)',
    'rapeseed-biodiesel': 'Biodiesel aus Raps',
    'sugar-beet-ethanol':
      'Ethanol aus Zuckerrüben (kein Biogas aus Schlempe, Erdgas als Prozessbrennstoff in konventionellem Kessel)',
    'sugar-cane-ethanol': 'Ethanol aus Zuckerrohr',
  },
  customValues: 'Eigene Werte',
  presetPick: 'Wählen Sie einen Herstellungsweg, um seine Standardwerte einzutragen, oder geben Sie eigene Werte ein.',
  presetNote: (sum, total, saving) =>
    `Standardwerte nach Teil D: ${sum} = ${total} ${UNIT}. Standardwert der Einsparung nach Teil A: ${saving}.`,
  presetElWarning: 'Standardwerte dürfen nur verwendet werden, wenn e<sub>l</sub> null oder kleiner ist.',
  errNumber: 'Bitte eine Zahl eingeben.',
  errNonNegative: 'Bitte 0 oder mehr eingeben.',
  result: 'Ergebnis',
  fixInputs: 'Korrigieren Sie die markierten Eingaben, um ein Ergebnis zu sehen.',
  ghgSavings: 'THG-Einsparung',
  totalEmissions: 'Gesamtemissionen E',
  noDate: 'Geben Sie ein gültiges Datum der Inbetriebnahme ein, um die Mindesteinsparung zu prüfen.',
  noDateCopy: 'Mindesteinsparung: kein gültiges Datum der Inbetriebnahme angegeben',
  pass: 'Erfüllt',
  fail: 'Nicht erfüllt',
  passCopy: 'ERFÜLLT',
  failCopy: 'NICHT ERFÜLLT',
  gapExact: 'Genau am Schwellenwert',
  gap: (points, above) => `${points} Prozentpunkte ${above ? 'über' : 'unter'} dem Schwellenwert`,
  verdict: (pass, percent, point, date) =>
    `${pass ? 'Erfüllt' : 'Erfüllt nicht'} die Mindesteinsparung von ${percent} % nach Art. 29 Abs. 10 Buchst. ${point} für eine Anlage, die am ${date} den Betrieb aufgenommen hat.`,
  thresholdCopy: (point, date, percent, outcome, gap) =>
    `Mindesteinsparung nach Art. 29 Abs. 10 Buchst. ${point}, Inbetriebnahme ${date}: ${percent} %: ${outcome} (${gap})`,
  netNegative:
    '<strong>Netto-negative Emissionen.</strong> E liegt unter null, weil die Einsparterme größer sind als die Emissionen. Die Einsparung liegt deshalb über 100 %. Prüfen Sie, ob die Werte für Bodenkohlenstoff und CO₂-Abscheidung belegt sind.',
  noSaving: `<strong>Keine Einsparung.</strong> E liegt über dem fossilen Vergleichswert von 94 ${UNIT}. Dieser Herstellungsweg verursacht mehr Emissionen als der fossile Kraftstoff, den er ersetzt.`,
  netNegativeCopy: 'Hinweis: netto-negative Emissionen, Einsparung über 100 %.',
  breakdown: 'Aufschlüsselung nach Termen',
  term: 'Term',
  eTotal: 'E (gesamt)',
  comparatorRow: 'Fossiler Vergleichswert E<sub>F(t)</sub>, Teil C Nummer 19',
  chartTermsCaption: `Beitrag der einzelnen Terme, ${UNIT}`,
  chartEmissions: 'Emissionen',
  chartSubtracted: 'Abgezogen',
  chartComparator: 'Fossiler Vergleichswert 94',
  chartMinimum: (percent) => `Mindestens ${percent} %`,
  chartHintSolid: `Durchgezogene Linie: fossiler Vergleichswert, 94 ${UNIT}.`,
  chartHintDashed: (limit, percent) =>
    `Gestrichelte Linie: E darf höchstens ${limit} ${UNIT} betragen, um ${percent} % einzusparen.`,
  chartHintTip: 'Balken mit Maus, Finger oder Tastatur ansteuern, um den genauen Wert zu sehen.',
  tipTerm: (key, label) => `${key}, ${label}`,
  copyResult: 'Ergebnis kopieren',
  copied: 'Kopiert',
  copyLink: 'Link kopieren',
  print: 'Drucken',
  copyTitleSingle: 'THG-Einsparung eines Biokraftstoffs',
  copyPathway: (name) => `Herstellungsweg: ${name} (Standardwerte nach Anhang V)`,
  link: 'Link',
  component: (n) => `Komponente ${n}`,
  name: 'Bezeichnung',
  energy: 'Energie (MJ)',
  fossilCheck: 'Fossile Komponente (zählt mit 94)',
  remove: 'Entfernen',
  removeLabel: (n) => `Komponente ${n} entfernen`,
  addComponent: 'Komponente hinzufügen',
  maxComponents: 'Höchstens 5 Komponenten',
  errEnergy: 'Bitte eine Energiemenge von 0 oder mehr eingeben.',
  errIntensity: 'Bitte die Emissionsintensität E eingeben.',
  blendResult: 'Ergebnis der Mischung',
  errNoEnergy: 'Geben Sie für mindestens eine Komponente eine Energiemenge über 0 ein.',
  blendSavings: 'THG-Einsparung der Mischung',
  blendIntensity: 'Energiegewichtete Intensität',
  blendCompare: (bio, saving) =>
    `Bioanteil nach Energie: <strong>${bio}</strong>. THG-Einsparung: <strong>${saving}</strong>. Der Unterschied entsteht durch die Emissionen bei der Herstellung der Biokomponenten.`,
  components: 'Komponenten',
  componentCol: 'Komponente',
  energyCol: 'Energie',
  shareCol: 'Anteil',
  fossilTag: '(fossil)',
  blend: 'Mischung',
  chartBlendCaption: `Beitrag der einzelnen Komponenten zur Mischung, ${UNIT}`,
  tipComponent: (name, share, e) => `${name}, ${share} der Energie mit ${e} ${UNIT}, Beitrag`,
  blendNoThreshold:
    'Die Mindesteinsparung nach Art. 29 Abs. 10 gilt für den Biokraftstoff selbst, nicht für eine Mischung mit fossilem Kraftstoff. Deshalb wird hier kein Prüfergebnis angezeigt.',
  copyTitleBlend: 'THG-Einsparung einer Mischung',
  copyComponent: (name, fossil, mj, e) => `- ${name}${fossil ? ' (fossil)' : ''}: ${mj} MJ mit ${e} ${UNIT}`,
  copyIntensity: 'Energiegewichtete Intensität',
  copyBio: 'Bioanteil nach Energie',
  defaultBio: 'Biokraftstoff',
  defaultFossil: 'Fossiler Kraftstoff',
  inputsReset: 'Eingaben zurückgesetzt.',
  blendReset: 'Mischung zurückgesetzt.',
  componentRemoved: (n) => `Komponente ${n} entfernt.`,
  linkCopied: 'Link kopiert. Er öffnet den Rechner mit diesen Eingaben.',
  linkFailed: 'Kopieren fehlgeschlagen. Kopieren Sie die Adresse aus dem Browser.',
  resultCopied: 'Ergebnis in die Zwischenablage kopiert.',
  resultFailed: 'Kopieren fehlgeschlagen. Markieren Sie das Ergebnis und kopieren Sie es von Hand.',
};

const EURLEX_DE = 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02018L2001-20240716';

/**
 * German text for the static parts of index.html, keyed by data-i18n.
 * Trusted HTML written here, never user input. English is read from the page.
 */
export const STATIC_DE: Record<string, string> = {
  skip: 'Zum Rechner springen',
  eyebrow: 'RED II in der Fassung der RED III',
  h1: 'THG-Einsparungsrechner für Biokraftstoffe',
  subtitle:
    'Berechnet die Treibhausgaseinsparung eines Biokraftstoffs nach RED II in der durch RED III geänderten Fassung (Richtlinie (EU) 2018/2001, geändert durch Richtlinie (EU) 2023/2413) und erklärt das Ergebnis in einfacher Sprache.',
  disclaimer:
    '<strong>Lernwerkzeug.</strong> Nicht für Zertifizierung, Audits oder offizielle THG-Berichterstattung. Verwenden Sie zertifizierte Werte und die Regeln Ihres Zertifizierungssystems.',
  'calc-heading': 'Rechner',
  'mode-legend': 'Berechnungsmodus',
  'mode-single': 'Einzelner Herstellungsweg',
  'mode-blend': 'Mischung',
  inputs: 'Eingaben',
  'preset-label': 'Voreinstellung (Standardwerte nach Anhang V)',
  'preset-source': `Quelle: Anhang V Teile A und D, Richtlinie (EU) 2018/2001, konsolidierte Fassung <a href="${EURLEX_DE}" target="_blank" rel="noopener">02018L2001-20240716</a>. Disaggregierte Standardwerte in gCO<sub>2</sub>eq/MJ.`,
  'legend-emissions': 'Emissionen <span class="legend-note">werden addiert, gCO<sub>2</sub>eq/MJ</span>',
  'legend-credits': 'Emissionseinsparungen <span class="legend-note">werden abgezogen, gCO<sub>2</sub>eq/MJ</span>',
  'date-label': 'Datum der Inbetriebnahme der Anlage',
  'date-hint':
    'Bestimmt die Mindesteinsparung nach Art. 29 Abs. 10 Buchst. a–c: 50 % (in Betrieb am oder vor dem 05.10.2015), 60 % (06.10.2015–31.12.2020), 65 % (ab 01.01.2021).',
  'reset-single': 'Eingaben zurücksetzen',
  'blend-heading': 'Komponenten der Mischung',
  'blend-hint':
    'Bis zu 5 Komponenten. Geben Sie für jede die Energiemenge (MJ) und die Emissionsintensität E (gCO<sub>2</sub>eq/MJ) ein. Fossile Komponenten zählen mit 94.',
  'reset-blend': 'Mischung zurücksetzen',
  'explainer-heading': 'So lesen Sie das Ergebnis',
  'bio-card': `<h3>Bioanteil ist nicht gleich THG-Einsparung</h3>
          <p>Der Bioanteil sagt, woher der Kohlenstoff im Kraftstoff stammt. Die THG-Einsparung sagt, wie viel weniger Treibhausgase die gesamte Lieferkette je Megajoule verursacht als der fossile Vergleichswert von 94 gCO<sub>2</sub>eq/MJ. Das sind zwei verschiedene Fragen.</p>
          <p>Anbau oder Sammlung des Rohstoffs, Verarbeitung und Transport verursachen Emissionen. Ein Kraftstoff, der nach Energie zu 99 % biogen ist, mit 20 gCO<sub>2</sub>eq/MJ hergestellt und mit 1 % fossilem Kraftstoff gemischt wird, kommt auf 20,74 gCO<sub>2</sub>eq/MJ und spart 77,9 % ein, nicht 99 %. Der Modus „Mischung“ oben startet mit genau diesem Beispiel.</p>
          <p>Am wichtigsten ist der Rohstoff. Mit den Standardwerten nach Anhang V spart Biodiesel aus Altspeiseöl 84 % ein, Biodiesel aus Raps dagegen 47 %. Der Hauptgrund: Einem Abfall werden keine Anbauemissionen zugerechnet.</p>
          <p class="formula" aria-label="Formel">E = e<sub>ec</sub> + e<sub>l</sub> + e<sub>p</sub> + e<sub>td</sub> + e<sub>u</sub> − e<sub>sca</sub> − e<sub>ccs</sub> − e<sub>ccr</sub><br />Einsparung = (94 − E) / 94</p>
          <p class="hint">Anhang V Teil C Nummer 1 Buchstabe a und Nummer 19 (fossiler Vergleichswert E<sub>F(t)</sub> = 94 gCO<sub>2</sub>eq/MJ).</p>`,
  'terms-heading': 'Was die einzelnen Terme bedeuten',
  'good-card': `<h3>Gut zu wissen</h3>
          <ul>
            <li><strong>Standardwerte und Landnutzungsänderungen.</strong> Die Standardwerte nach Anhang V dürfen nur verwendet werden, wenn keine Nettoemissionen aus Landnutzungsänderungen entstehen, also wenn e<sub>l</sub> null oder kleiner ist.</li>
            <li><strong>ETBE und TAEE.</strong> Für den erneuerbaren Anteil von ETBE und TAEE gilt der Wert des verwendeten Herstellungswegs für Ethanol.</li>
            <li><strong>Schwellenwerte von 70 % und 80 %.</strong> Die Schwellenwerte in Art. 29 Abs. 10 Buchst. d–h gelten für Strom, Wärme und Kälte aus Biomasse-Brennstoffen, nicht für Biokraftstoffe im Verkehr. Dieses Werkzeug prüft nur Art. 29 Abs. 10 Buchst. a–c; diese hat RED III nicht geändert.</li>
            <li><strong>Mischungen.</strong> Die Mindesteinsparung gilt für den Biokraftstoff selbst. Der Modus „Mischung“ zeigt den Durchschnitt einer Mischung und veranschaulicht den Unterschied zwischen Bioanteil und Einsparung.</li>
          </ul>`,
  'about-heading': 'Über das Projekt',
  'about-text':
    'Erstellt von Unaiz Ahmed Khan, Chemieingenieur in Berlin. Vier Jahre Leitung von Produktion und Einkauf bei einem Hersteller erneuerbarer Kraftstoffe; dort hat er die THG-Einsparung der Kraftstoffe des Unternehmens durch die Beschaffung biobasierter Rohstoffe auf 78 % gesteigert (RED-II-Methodik). Umweltschutzbeauftragter (TÜV Rheinland) und zertifizierter Projektmanager nach IPMA Level D, beides 2026.',
  'footer-source': `Rechtsquelle: Richtlinie (EU) 2018/2001, geändert durch Richtlinie (EU) 2023/2413, konsolidierte Fassung vom 16.07.2024, <a href="${EURLEX_DE}" target="_blank" rel="noopener">CELEX 02018L2001-20240716 auf EUR-Lex</a>.`,
  'footer-disclaimer':
    'Lernwerkzeug. Nicht für Zertifizierung, Audits oder offizielle THG-Berichterstattung. Verwenden Sie zertifizierte Werte und die Regeln Ihres Zertifizierungssystems.',
  'footer-privacy': 'Läuft vollständig in Ihrem Browser. Keine Cookies, kein Tracking.',
  noscript: 'Dieser Rechner benötigt JavaScript.',
};

/** Language from ?lang=, else from the browser, else English. */
export function detectLang(search: string, browserLang: string | undefined): Lang {
  const param = new URLSearchParams(search).get('lang');
  if (param === 'de' || param === 'en') return param;
  return browserLang?.toLowerCase().startsWith('de') ? 'de' : 'en';
}

export function messages(lang: Lang): Messages {
  return lang === 'de' ? DE : EN;
}
