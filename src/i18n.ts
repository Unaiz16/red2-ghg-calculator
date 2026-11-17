import type { EfuelKey, TermKey } from './calc';

export type Lang = 'en' | 'de';

const UNIT = 'gCO₂eq/MJ';
/** German unit, as written in the German text of Delegated Regulation (EU) 2023/1185. Used on the whole German page. */
const UNIT_DE = 'g CO₂-Äq./MJ';

export type HelpKey =
  | 'preset'
  | 'date'
  | 'savings'
  | 'totalE'
  | 'threshold'
  | 'comparator'
  | 'blendName'
  | 'blendEnergy'
  | 'blendE'
  | 'blendFossil'
  | 'blendSavings'
  | 'blendIntensity'
  | 'efuelThreshold';

interface TermText {
  label: string;
  hint?: string;
  explain: string;
}

/** All text produced by the script. Static page text lives in index.html (EN) and STATIC_DE. */
export interface Messages {
  decimal: string;
  /** Emission intensity unit in this language. */
  unit: string;
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
  chartTermsCaption: (unit: string) => string;
  chartEmissions: string;
  chartSubtracted: string;
  chartComparator: string;
  chartMinimum: (percent: number) => string;
  chartHintSolid: (unit: string) => string;
  chartHintDashed: (limit: string, percent: number, unit: string) => string;
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
  savingCol: string;
  // help tooltips: one plain sentence each
  helpName: (label: string) => string;
  helpTerms: Record<TermKey, string>;
  helpEfuelTerms: Record<EfuelKey, string>;
  help: Record<HelpKey, string>;
  // e-fuel
  efuelTerms: Record<EfuelKey, TermText>;
  efuelResult: string;
  efuelVerdict: (pass: boolean) => string;
  efuelThresholdCopy: (outcome: string, gap: string) => string;
  efuelBreakdownNote: string;
  copyTitleEfuel: string;
  efuelLabel: string;
  efuelComparatorRow: string;
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
  unit: UNIT,
  percent: (n) => `${n}%`,
  docTitle: 'GHG Savings Calculator for Renewable Fuels (EU RED)',
  metaDescription:
    'GHG savings calculator for renewable transport fuels – biofuels, SAF and e-fuels (EU RED). Free educational tool using the method of RED II as amended by RED III.',
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
  chartTermsCaption: (unit) => `Contribution of each term, ${unit}`,
  chartEmissions: 'Emissions',
  chartSubtracted: 'Subtracted',
  chartComparator: 'Fossil comparator 94',
  chartMinimum: (percent) => `${percent}% minimum`,
  chartHintSolid: (unit) => `Solid line: fossil fuel comparator, 94 ${unit}.`,
  chartHintDashed: (limit, percent, unit) => `Dashed line: E must be at or below ${limit} ${unit} to save ${percent}%.`,
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
  savingCol: 'Saving',
  helpName: (label) => `Help: ${label}`,
  helpTerms: {
    eec: 'Emissions from growing or extracting the raw material; zero for wastes and residues.',
    el: 'Yearly share of the emissions caused when land was converted to grow the feedstock; zero without land-use change.',
    ep: 'Emissions from the energy and chemicals used to turn the raw material into fuel.',
    etd: 'Emissions from transporting and storing the raw materials and the finished fuel.',
    eu: 'Emissions from burning the fuel, which are set to zero for biofuels.',
    esca: 'Since RED III, soil-carbon savings count only with solid, verifiable evidence that soil carbon has increased, with no risk of harming biodiversity, and after accounting for any extra fertiliser or herbicide use (Annex V Part C point 6 as amended).',
    eccs: 'Savings from capturing CO₂ from the process and storing it permanently underground.',
    eccr: 'Savings from capturing CO₂ of biomass origin that replaces fossil CO₂ in products.',
  },
  helpEfuelTerms: {
    ei: 'Emissions from supplying all inputs, including electricity and the energy for CO₂ capture, minus the emissions avoided from the inputs\' existing use (e ex-use), which is where captured CO₂ from eligible sources is credited.',
    ep: 'Direct emissions from processing, from waste treatment and from leakages.',
    etd: 'Emissions from storing and distributing the finished fuel; transport of inputs belongs in the inputs term.',
    eu: 'The total combustion emissions of the fuel in use, entered in full; captured CO₂ is credited in the inputs term, not here.',
    eccs: 'Savings from CO₂ that is captured and permanently stored underground under Directive 2009/31/EC.',
  },
  help: {
    preset: 'Fills in the default values that the Directive lists for this production pathway.',
    date: 'The date the plant started operating decides whether a saving of 50%, 60% or 65% is required.',
    savings: 'How much less greenhouse gas this fuel causes per megajoule than the fossil fuel comparator.',
    totalE: 'All emissions of the supply chain minus the savings terms, per megajoule of fuel.',
    threshold: 'The minimum saving the Directive requires for this fuel.',
    comparator: 'The emissions of the fossil fuel that the renewable fuel is compared with, fixed at 94 gCO₂eq/MJ.',
    blendName: 'A label for this component or supplier offer.',
    blendEnergy: 'How much energy this component contributes to the mix, in megajoules.',
    blendE: 'The emissions of this component per megajoule.',
    blendFossil: 'Tick this for a fossil fuel, which always counts as 94 gCO₂eq/MJ.',
    blendSavings: 'The saving of the whole mix against the fossil fuel comparator.',
    blendIntensity: 'The average emissions of the mix, weighted by the energy of each component.',
    efuelThreshold: 'RFNBO must save at least 70% under RED Art. 29a(1) and recycled carbon fuels under RED Art. 29a(2) and Art. 2 of the Regulation, which means at most 28.2 gCO₂eq/MJ.',
  },
  efuelTerms: {
    ei: {
      label: 'Supply of inputs',
      hint: 'eᵢ = eᵢ elastic + eᵢ rigid − e ex-use (Annex Part A points 1 and 10). Includes electricity and the energy used for CO₂ capture. Captured CO₂ from eligible sources is credited here through e ex-use, so the value can be negative.',
      explain:
        'Emissions from the supply of inputs: eᵢ elastic (inputs with elastic supply) plus eᵢ rigid (inputs with rigid supply) minus e ex-use (emissions from the inputs\' existing use or fate). It includes the electricity, the transport of inputs and the energy used to capture CO₂. CO₂ from an eligible source that ends up in the fuel is credited here through e ex-use, which is why this term can be negative (Annex Part A points 1 and 10).',
    },
    ep: {
      label: 'Processing',
      hint: 'Direct emissions from processing, waste treatment and leakages (point 12).',
      explain:
        'Direct atmospheric emissions from the processing itself, from waste treatment and from leakages. Emissions of the CO₂ storage operation are also counted here (Annex Part A points 12 and 17).',
    },
    etd: {
      label: 'Transport and distribution',
      hint: 'Storage and distribution of the finished fuel. Transport of inputs belongs in eᵢ (point 16).',
      explain:
        'Emissions from the storage and distribution of the finished fuel. The transport of inputs is not counted here; it belongs in the inputs term (Annex Part A point 16).',
    },
    eu: {
      label: 'Combustion in end use',
      hint: 'Total combustion emissions of the fuel in use (point 13). Enter them in full: captured CO₂ is credited in eᵢ, not here.',
      explain:
        'The total combustion emissions of the fuel in use (Annex Part A point 13). Hydrogen contains no carbon, so this is zero for it. For carbon-containing fuels enter the full combustion emissions; captured CO₂ from an eligible source does not reduce this term, it is credited inside the inputs term through e ex-use.',
    },
    eccs: {
      label: 'CO₂ capture and geological storage',
      hint: 'CO₂ permanently stored under Directive 2009/31/EC (point 17).',
      explain:
        'Emission savings from CO₂ that is captured and permanently stored in a geological storage site in line with Directive 2009/31/EC. The emissions of the storage operation itself are counted in the processing term (Annex Part A point 17). It is the only term that is subtracted in the formula.',
    },
  },
  efuelResult: 'E-fuel result',
  efuelVerdict: (pass) =>
    `${pass ? 'Meets' : 'Does not meet'} the 70% minimum: RFNBO under RED Art. 29a(1), recycled carbon fuels under RED Art. 29a(2) and Art. 2 of Delegated Regulation (EU) 2023/1185 (E at or below 28.20 ${UNIT}).`,
  efuelThresholdCopy: (outcome, gap) =>
    `Minimum saving 70% (RFNBO: RED Art. 29a(1); recycled carbon fuels: RED Art. 29a(2) and Art. 2 of Delegated Regulation (EU) 2023/1185): ${outcome} (${gap})`,
  efuelBreakdownNote: 'No default values exist for e-fuels. All values are your own inputs.',
  copyTitleEfuel: 'E-fuel GHG savings (RFNBO / recycled carbon fuel)',
  efuelLabel: 'Commission Delegated Regulation (EU) 2023/1185, Annex Part A points 1 and 2',
  efuelComparatorRow: 'Fossil fuel comparator E<sub>F</sub>, Part A point 2',
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
  unit: UNIT_DE,
  percent: (n) => `${n} %`,
  docTitle: 'THG-Einsparungsrechner für erneuerbare Kraftstoffe (EU RED)',
  metaDescription:
    'THG-Einsparungsrechner für erneuerbare Kraftstoffe im Verkehr – Biokraftstoffe, SAF und E-Fuels (EU RED). Kostenloses Lernwerkzeug nach der Methode der RED II in der durch RED III geänderten Fassung.',
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
    `Standardwerte nach Teil D: ${sum} = ${total} ${UNIT_DE}. Standardwert der Einsparung nach Teil A: ${saving}.`,
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
  noSaving: `<strong>Keine Einsparung.</strong> E liegt über dem fossilen Vergleichswert von 94 ${UNIT_DE}. Dieser Herstellungsweg verursacht mehr Emissionen als der fossile Kraftstoff, den er ersetzt.`,
  netNegativeCopy: 'Hinweis: netto-negative Emissionen, Einsparung über 100 %.',
  breakdown: 'Aufschlüsselung nach Termen',
  term: 'Term',
  eTotal: 'E (gesamt)',
  comparatorRow: 'Fossiler Vergleichswert E<sub>F(t)</sub>, Teil C Nummer 19',
  chartTermsCaption: (unit) => `Beitrag der einzelnen Terme, ${unit}`,
  chartEmissions: 'Emissionen',
  chartSubtracted: 'Abgezogen',
  chartComparator: 'Fossiler Vergleichswert 94',
  chartMinimum: (percent) => `Mindestens ${percent} %`,
  chartHintSolid: (unit) => `Durchgezogene Linie: fossiler Vergleichswert, 94 ${unit}.`,
  chartHintDashed: (limit, percent, unit) =>
    `Gestrichelte Linie: E darf höchstens ${limit} ${unit} betragen, um ${percent}\u00a0% einzusparen.`,
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
  chartBlendCaption: `Beitrag der einzelnen Komponenten zur Mischung, ${UNIT_DE}`,
  tipComponent: (name, share, e) => `${name}, ${share} der Energie mit ${e} ${UNIT_DE}, Beitrag`,
  blendNoThreshold:
    'Die Mindesteinsparung nach Art. 29 Abs. 10 gilt für den Biokraftstoff selbst, nicht für eine Mischung mit fossilem Kraftstoff. Deshalb wird hier kein Prüfergebnis angezeigt.',
  copyTitleBlend: 'THG-Einsparung einer Mischung',
  copyComponent: (name, fossil, mj, e) => `- ${name}${fossil ? ' (fossil)' : ''}: ${mj} MJ mit ${e} ${UNIT_DE}`,
  copyIntensity: 'Energiegewichtete Intensität',
  copyBio: 'Bioanteil nach Energie',
  defaultBio: 'Biokraftstoff',
  defaultFossil: 'Fossiler Kraftstoff',
  savingCol: 'Einsparung',
  helpName: (label) => `Hilfe: ${label}`,
  helpTerms: {
    eec: 'Emissionen aus Anbau oder Gewinnung des Rohstoffs; null bei Abfällen und Reststoffen.',
    el: 'Jährlicher Anteil der Emissionen, die durch die Umwandlung von Flächen für den Rohstoffanbau entstanden sind; null ohne Landnutzungsänderung.',
    ep: 'Emissionen aus Energie und Chemikalien für die Umwandlung des Rohstoffs in Kraftstoff.',
    etd: 'Emissionen aus Transport und Lagerung der Rohstoffe und des fertigen Kraftstoffs.',
    eu: 'Emissionen aus der Verbrennung des Kraftstoffs; für Biokraftstoffe mit null angesetzt.',
    esca: 'Seit RED III zählen Einsparungen durch Bodenkohlenstoff nur, wenn belastbar und überprüfbar nachgewiesen ist, dass der Kohlenstoffgehalt des Bodens gestiegen ist, wenn keine Gefahr für die Biodiversität besteht und wenn ein zusätzlicher Einsatz von Dünge- oder Pflanzenschutzmitteln (Herbiziden) berücksichtigt wird (Anhang V Teil C Nummer 6 in der geänderten Fassung).',
    eccs: 'Einsparungen durch die Abscheidung von CO₂ aus dem Prozess und seine dauerhafte Speicherung im Untergrund.',
    eccr: 'Einsparungen durch die Abscheidung von CO₂ aus Biomasse, das fossiles CO₂ in Produkten ersetzt.',
  },
  helpEfuelTerms: {
    ei: 'Emissionen aus der Versorgung mit allen Einsatzstoffen, einschließlich Strom und der Energie für die CO₂-Abscheidung, abzüglich der Emissionen aus der derzeitigen Nutzung oder Bestimmung der Einsatzstoffe (e ex-use); dort wird abgeschiedenes CO₂ aus anrechenbaren Quellen gutgeschrieben.',
    ep: 'Direkte Emissionen aus der Verarbeitung, aus der Abfallbehandlung und aus Leckagen.',
    etd: 'Emissionen aus Lagerung und Verteilung des fertigen Kraftstoffs; der Transport der Einsatzstoffe gehört in den Term für die Einsatzstoffe.',
    eu: 'Die gesamten Emissionen aus der Verbrennung des Kraftstoffs bei der Endnutzung, in voller Höhe einzutragen; abgeschiedenes CO₂ wird im Term für die Einsatzstoffe gutgeschrieben, nicht hier.',
    eccs: 'Einsparungen durch CO₂, das abgeschieden und nach der Richtlinie 2009/31/EG dauerhaft geologisch gespeichert wird.',
  },
  help: {
    preset: 'Trägt die Standardwerte ein, die die Richtlinie für diesen Herstellungsweg nennt.',
    date: 'Das Datum der Inbetriebnahme der Anlage entscheidet, ob eine Einsparung von 50\u00a0%, 60\u00a0% oder 65\u00a0% verlangt wird.',
    savings: 'Wie viel weniger Treibhausgase dieser Kraftstoff je Megajoule verursacht als der fossile Vergleichswert.',
    totalE: 'Alle Emissionen der Lieferkette abzüglich der Einsparterme, je Megajoule Kraftstoff.',
    threshold: 'Die Mindesteinsparung, die die Richtlinie für diesen Kraftstoff verlangt.',
    comparator: 'Die Emissionen des fossilen Kraftstoffs, mit dem der erneuerbare Kraftstoff verglichen wird; festgelegt auf 94 g CO₂-Äq./MJ.',
    blendName: 'Eine Bezeichnung für diese Komponente oder dieses Lieferantenangebot.',
    blendEnergy: 'Wie viel Energie diese Komponente zur Mischung beiträgt, in Megajoule.',
    blendE: 'Die Emissionen dieser Komponente je Megajoule.',
    blendFossil: 'Für fossilen Kraftstoff ankreuzen; er zählt immer mit 94 g CO₂-Äq./MJ.',
    blendSavings: 'Die Einsparung der gesamten Mischung gegenüber dem fossilen Vergleichswert.',
    blendIntensity: 'Die durchschnittlichen Emissionen der Mischung, gewichtet nach der Energie der Komponenten.',
    efuelThreshold: 'RFNBO müssen nach Art. 29a Abs. 1 RED mindestens 70\u00a0% einsparen, wiederverwertete kohlenstoffhaltige Kraftstoffe nach Art. 29a Abs. 2 RED und Art. 2 der Verordnung; das heißt höchstens 28,2 g CO₂-Äq./MJ Kraftstoff.',
  },
  efuelTerms: {
    ei: {
      label: 'Emissionen aus der Versorgung mit Einsatzstoffen',
      hint: 'eᵢ = eᵢ elastic + eᵢ rigid − e ex-use (Anhang Teil A Nummern 1 und 10). Einschließlich Strom und der Energie für die CO₂-Abscheidung. Abgeschiedenes CO₂ aus anrechenbaren Quellen wird hier über e ex-use gutgeschrieben; der Wert kann daher negativ sein.',
      explain:
        'Emissionen aus der Versorgung mit Einsatzstoffen: eᵢ elastic (Emissionen aus Einsatzstoffen mit elastischem Angebot) plus eᵢ rigid (Emissionen aus Einsatzstoffen mit unelastischem Angebot) minus e ex-use (Emissionen aus der derzeitigen Nutzung oder Bestimmung der Einsatzstoffe). Dazu gehören der Strom, der Transport der Einsatzstoffe und die Energie für die CO₂-Abscheidung. CO₂ aus einer anrechenbaren Quelle, das in den Kraftstoff eingeht, wird hier über e ex-use gutgeschrieben; deshalb kann dieser Term negativ sein (Anhang Teil A Nummern 1 und 10).',
    },
    ep: {
      label: 'Emissionen aus der Verarbeitung',
      hint: 'Direkte Emissionen aus Verarbeitung, Abfallbehandlung und Leckagen (Nummer 12).',
      explain:
        'Direkte Emissionen in die Atmosphäre aus der Verarbeitung selbst, aus der Abfallbehandlung und aus Leckagen. Auch die Emissionen des CO₂-Speicherbetriebs werden hier gezählt (Anhang Teil A Nummern 12 und 17).',
    },
    etd: {
      label: 'Emissionen aus Transport und Verteilung',
      hint: 'Lagerung und Verteilung des fertigen Kraftstoffs. Der Transport der Einsatzstoffe gehört in eᵢ (Nummer 16).',
      explain:
        'Emissionen aus der Lagerung und Verteilung des fertigen Kraftstoffs. Der Transport der Einsatzstoffe wird nicht hier gezählt, sondern im Term für die Einsatzstoffe (Anhang Teil A Nummer 16).',
    },
    eu: {
      label: 'Emissionen aus der Verbrennung des Kraftstoffs bei der Endnutzung',
      hint: 'Gesamte Verbrennungsemissionen des Kraftstoffs bei der Nutzung (Nummer 13). In voller Höhe eintragen: Abgeschiedenes CO₂ wird in eᵢ gutgeschrieben, nicht hier.',
      explain:
        'Die gesamten Emissionen aus der Verbrennung des Kraftstoffs bei der Endnutzung (Anhang Teil A Nummer 13). Wasserstoff enthält keinen Kohlenstoff, der Wert ist dann null. Bei kohlenstoffhaltigen Kraftstoffen tragen Sie die Verbrennungsemissionen in voller Höhe ein; abgeschiedenes CO₂ aus einer anrechenbaren Quelle mindert diesen Term nicht, es wird im Term für die Einsatzstoffe über e ex-use gutgeschrieben.',
    },
    eccs: {
      label: 'Emissionseinsparungen durch CO₂-Abscheidung und geologische CO₂-Speicherung',
      hint: 'CO₂, das nach der Richtlinie 2009/31/EG dauerhaft gespeichert wird (Nummer 17).',
      explain:
        'Emissionseinsparungen durch CO₂, das abgeschieden und nach der Richtlinie 2009/31/EG dauerhaft in einer geologischen Speicherstätte gespeichert wird. Die Emissionen des Speicherbetriebs selbst werden im Term Verarbeitung gezählt (Anhang Teil A Nummer 17). Dies ist der einzige Term, der in der Formel abgezogen wird.',
    },
  },
  efuelResult: 'Ergebnis E-Fuel',
  efuelVerdict: (pass) =>
    `${pass ? 'Erfüllt' : 'Erfüllt nicht'} die Mindesteinsparung von 70\u00a0%: RFNBO nach Art. 29a Abs. 1 RED, wiederverwertete kohlenstoffhaltige Kraftstoffe nach Art. 29a Abs. 2 RED und Art. 2 der Delegierten Verordnung (EU) 2023/1185 (E höchstens 28,20 ${UNIT_DE}).`,
  efuelThresholdCopy: (outcome, gap) =>
    `Mindesteinsparung 70 % (RFNBO: Art. 29a Abs. 1 RED; wiederverwertete kohlenstoffhaltige Kraftstoffe: Art. 29a Abs. 2 RED und Art. 2 der Delegierten Verordnung (EU) 2023/1185): ${outcome} (${gap})`,
  efuelBreakdownNote: 'Für E-Fuels gibt es keine Standardwerte. Alle Werte sind Ihre eigenen Eingaben.',
  copyTitleEfuel: 'THG-Einsparung eines E-Fuels (RFNBO / wiederverwertete kohlenstoffhaltige Kraftstoffe)',
  efuelLabel: 'Delegierte Verordnung (EU) 2023/1185 der Kommission, Anhang Teil A Nummern 1 und 2',
  efuelComparatorRow: 'Fossiler Vergleichswert E<sub>F</sub>, Teil A Nummer 2',
  inputsReset: 'Eingaben zurückgesetzt.',
  blendReset: 'Mischung zurückgesetzt.',
  componentRemoved: (n) => `Komponente ${n} entfernt.`,
  linkCopied: 'Link kopiert. Er öffnet den Rechner mit diesen Eingaben.',
  linkFailed: 'Kopieren fehlgeschlagen. Kopieren Sie die Adresse aus dem Browser.',
  resultCopied: 'Ergebnis in die Zwischenablage kopiert.',
  resultFailed: 'Kopieren fehlgeschlagen. Markieren Sie das Ergebnis und kopieren Sie es von Hand.',
};

const EURLEX_DE_1185 = 'https://eur-lex.europa.eu/eli/reg_del/2023/1185/oj';
const EURLEX_DE = 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02018L2001-20240716';

/**
 * German text for the static parts of index.html, keyed by data-i18n.
 * Trusted HTML written here, never user input. English is read from the page.
 */
export const STATIC_DE: Record<string, string> = {
  skip: 'Zum Rechner springen',
  eyebrow: 'RED II in der Fassung der RED III',
  h1: 'THG-Einsparungsrechner für erneuerbare Kraftstoffe',
  subtitle:
    'THG-Einsparungsrechner für erneuerbare Kraftstoffe im Verkehr – Biokraftstoffe, SAF und E-Fuels (EU RED). Methode der RED II in der durch RED III geänderten Fassung (Richtlinie (EU) 2018/2001, geändert durch Richtlinie (EU) 2023/2413), mit einer Erklärung des Ergebnisses in einfacher Sprache.',
  disclaimer:
    '<strong>Lernwerkzeug.</strong> Nicht für Zertifizierung, Audits oder offizielle THG-Berichterstattung. Verwenden Sie zertifizierte Werte und die Regeln Ihres Zertifizierungssystems.',
  'calc-heading': 'Rechner',
  'mode-legend': 'Berechnungsmodus',
  'mode-single': 'Biokraftstoff',
  'mode-blend': 'Mischung / Vergleich',
  'mode-efuel': 'E-Fuel',
  inputs: 'Eingaben',
  'preset-label': 'Voreinstellung (Standardwerte nach Anhang V)',
  'preset-source': `Quelle: Anhang V Teile A und D, Richtlinie (EU) 2018/2001, konsolidierte Fassung <a href="${EURLEX_DE}" target="_blank" rel="noopener">02018L2001-20240716</a>. Disaggregierte Standardwerte in g CO<sub>2</sub>-Äq./MJ.`,
  'legend-emissions': 'Emissionen <span class="legend-note">werden addiert, g CO<sub>2</sub>-Äq./MJ</span>',
  'legend-credits': 'Emissionseinsparungen <span class="legend-note">werden abgezogen, g CO<sub>2</sub>-Äq./MJ</span>',
  'date-label': 'Datum der Inbetriebnahme der Anlage',
  'date-hint':
    'Bestimmt die Mindesteinsparung nach Art. 29 Abs. 10 Buchst. a–c: 50 % (in Betrieb am oder vor dem 05.10.2015), 60 % (06.10.2015–31.12.2020), 65 % (ab 01.01.2021).',
  'reset-single': 'Eingaben zurücksetzen',
  'blend-heading': 'Mischung / Lieferantenangebote vergleichen',
  'blend-hint':
    'Bis zu 5 Komponenten. Geben Sie für jede die Energiemenge (MJ) und die Emissionsintensität E (g CO<sub>2</sub>-Äq./MJ) ein. Fossile Komponenten zählen mit 94. Um Lieferantenangebote zu vergleichen, geben Sie jedes Angebot als Komponente ein: Die Tabelle zeigt die Einsparung jedes Angebots und der Mischung.',
  'reset-blend': 'Mischung zurücksetzen',
  'efuel-heading': 'Eingaben E-Fuel (RFNBO / wiederverwertete kohlenstoffhaltige Kraftstoffe)',
  'efuel-hint':
    'Methode der Delegierten Verordnung (EU) 2023/1185 der Kommission. Für E-Fuels gibt es keine Standardwerte: Geben Sie eigene Werte in g CO<sub>2</sub>-Äq./MJ Kraftstoff ein.',
  'efuel-legend': 'Terme <span class="legend-note">g CO<sub>2</sub>-Äq./MJ Kraftstoff</span>',
  'efuel-source': `Quelle: Delegierte Verordnung (EU) 2023/1185 der Kommission, <a href="${EURLEX_DE_1185}" target="_blank" rel="noopener">EUR-Lex</a>. Formel: Anhang Teil A Nummer 1. Fossiler Vergleichswert 94 g CO<sub>2</sub>-Äq./MJ und Einsparung = (E<sub>F</sub> − E) / E<sub>F</sub>: Anhang Teil A Nummer 2. Mindesteinsparung 70\u00a0%: RFNBO nach Art. 29a Abs. 1 RED (eingefügt durch RED III, zuvor Art. 25 Abs. 2), wiederverwertete kohlenstoffhaltige Kraftstoffe nach Art. 29a Abs. 2 RED und Art. 2 der Verordnung.`,
  'efuel-card': `<h3>E-Fuels: Warum Netzstrom die Mindesteinsparung von 70\u00a0% verfehlen kann</h3>
          <p>E-Fuels sind hier flüssige oder gasförmige erneuerbare Kraftstoffe nicht biogenen Ursprungs für den Verkehr (RFNBO), etwa Wasserstoff aus Elektrolyse und daraus hergestellte Kraftstoffe, sowie wiederverwertete kohlenstoffhaltige Kraftstoffe. Für beide gilt dieselbe Formel der Delegierten Verordnung (EU) 2023/1185 der Kommission (Anhang Teil A Nummer 1) und derselbe fossile Vergleichswert von 94 g CO<sub>2</sub>-Äq./MJ (Teil A Nummer 2). Die Mindesteinsparung beträgt 70\u00a0%: für RFNBO nach Art. 29a Abs. 1 RED (eingefügt durch RED III, zuvor Art. 25 Abs. 2), für wiederverwertete kohlenstoffhaltige Kraftstoffe nach Art. 29a Abs. 2 RED und Art. 2 der Verordnung. Für die gesamte Kette bleiben damit höchstens 28,2 g CO<sub>2</sub>-Äq./MJ Kraftstoff.</p>
          <p>Fast die gesamte Energie eines E-Fuels stammt aus Strom, und wegen der Umwandlungsverluste wird je Megajoule Kraftstoff mehr als ein Megajoule Strom gebraucht. Die Emissionen des Stroms werden also vervielfacht, nicht verdünnt.</p>
          <p class="example"><strong>Veranschaulichendes Beispiel, kein rechtlicher Wert:</strong> Braucht ein Prozess 1,5 MJ Strom je MJ Kraftstoff, ergibt Strom mit 20 g CO<sub>2</sub>-Äq./MJ bereits 30 g CO<sub>2</sub>-Äq./MJ Kraftstoff. Das liegt über der Grenze, noch bevor Verarbeitung und Verteilung gezählt sind.</p>
          <h4>Wie Strom angerechnet wird (Teil A Nummern 5 und 6)</h4>
          <p>Strom, der nach Art. 27 Abs. 6 RED (früher Art. 27 Abs. 3, so in der Verordnung zitiert) als vollständig erneuerbar gilt, wird mit null Emissionen angesetzt. Anderer Netzstrom wird je Kalenderjahr nach einer von drei Möglichkeiten angerechnet:</p>
          <ul>
            <li>(a) mit der durchschnittlichen Emissionsintensität des Landes oder der Gebotszone (Teil C des Anhangs);</li>
            <li>(b) mit null, wenn die Volllaststunden innerhalb der Stunden liegen, in denen erneuerbare Energien oder Kernkraft den Preis gesetzt haben, sonst mit 183 g CO<sub>2</sub>-Äq./MJ;</li>
            <li>(c) mit dem Wert des Grenzkraftwerks in der Gebotszone, wenn der Übertragungsnetzbetreiber ihn veröffentlicht.</li>
          </ul>
          <p>Die genauen Regeln für erneuerbaren Strom stehen in der Delegierten Verordnung (EU) 2023/1184.</p>
          <h4>Woher der Kohlenstoff stammt (Teil A Nummer 10)</h4>
          <p>e<sub>u</sub> enthält die gesamten Verbrennungsemissionen des Kraftstoffs bei der Nutzung (Nummer 13). Abgeschiedenes CO<sub>2</sub>, das in den Kraftstoff eingeht, wird nicht dort abgezogen, sondern in e<sub>i</sub> über e ex-use gutgeschrieben, und nur aus diesen anrechenbaren Quellen (Nummer 10 Buchstaben a bis e):</p>
          <ul>
            <li>(a) CO<sub>2</sub> aus Tätigkeiten nach Anhang I der EHS-Richtlinie, das einer wirksamen CO<sub>2</sub>-Bepreisung unterliegt und vor 2036 in den Kraftstoff eingeht (vor 2041, wenn es nicht aus der Verbrennung von Brennstoffen zur Stromerzeugung stammt);</li>
            <li>(b) CO<sub>2</sub> aus der Luft;</li>
            <li>(c) CO<sub>2</sub> aus konformen Biokraftstoffen, flüssigen Biobrennstoffen oder Biomasse-Brennstoffen, für das keine Gutschrift für CO<sub>2</sub>-Abscheidung und -Nutzung oder -Speicherung beansprucht wurde;</li>
            <li>(d) CO<sub>2</sub> aus konformen RFNBO oder wiederverwerteten kohlenstoffhaltigen Kraftstoffen;</li>
            <li>(e) geologisches CO<sub>2</sub>, das zuvor auf natürliche Weise freigesetzt wurde.</li>
          </ul>
          <p>Nicht anrechenbar ist CO<sub>2</sub> aus einem Brennstoff, der eigens zur Erzeugung von CO<sub>2</sub> verbrannt wird, und CO<sub>2</sub>, für das bereits an anderer Stelle eine Gutschrift gewährt wurde. Die Jahre 2036 und 2041 stehen unter Überprüfungsvorbehalt (Nummer 11). Die Energie für die Abscheidung zählt als Einsatzstoff.</p>
          <p class="formula" aria-label="Formel">E = e<sub>i</sub> + e<sub>p</sub> + e<sub>td</sub> + e<sub>u</sub> − e<sub>ccs</sub> &nbsp;(Anhang Teil A Nummer 1)<br />e<sub>i</sub> = e<sub>i</sub> elastic + e<sub>i</sub> rigid − e ex-use<br />Einsparung = (E<sub>F</sub> − E) / E<sub>F</sub>, E<sub>F</sub> = 94 &nbsp;(Teil A Nummer 2), mindestens 70\u00a0%</p>
          <dl id="efuel-term-list" class="term-list"></dl>`,
  'explainer-heading': 'So lesen Sie das Ergebnis',
  'bio-card': `<h3>Bioanteil ist nicht gleich THG-Einsparung</h3>
          <p>Der Bioanteil sagt, woher der Kohlenstoff im Kraftstoff stammt. Die THG-Einsparung sagt, wie viel weniger Treibhausgase die gesamte Lieferkette je Megajoule verursacht als der fossile Vergleichswert von 94 g CO<sub>2</sub>-Äq./MJ. Das sind zwei verschiedene Fragen.</p>
          <p>Anbau oder Sammlung des Rohstoffs, Verarbeitung und Transport verursachen Emissionen. Ein Kraftstoff, der nach Energie zu 99 % biogen ist, mit 20 g CO<sub>2</sub>-Äq./MJ hergestellt und mit 1 % fossilem Kraftstoff gemischt wird, kommt auf 20,74 g CO<sub>2</sub>-Äq./MJ und spart 77,9 % ein, nicht 99 %. Der Modus „Mischung“ oben startet mit genau diesem Beispiel.</p>
          <p>Am wichtigsten ist der Rohstoff. Mit den Standardwerten nach Anhang V spart Biodiesel aus Altspeiseöl 84 % ein, Biodiesel aus Raps dagegen 47 %. Der Hauptgrund: Einem Abfall werden keine Anbauemissionen zugerechnet.</p>
          <p class="formula" aria-label="Formel">E = e<sub>ec</sub> + e<sub>l</sub> + e<sub>p</sub> + e<sub>td</sub> + e<sub>u</sub> − e<sub>sca</sub> − e<sub>ccs</sub> − e<sub>ccr</sub><br />Einsparung = (94 − E) / 94</p>
          <p class="hint">Anhang V Teil C Nummer 1 Buchstabe a und Nummer 19 (fossiler Vergleichswert E<sub>F(t)</sub> = 94 g CO<sub>2</sub>-Äq./MJ).</p>`,
  'terms-heading': 'Was die einzelnen Terme bedeuten',
  'good-card': `<h3>Gut zu wissen</h3>
          <ul>
            <li><strong>Standardwerte und Landnutzungsänderungen.</strong> Die Standardwerte nach Anhang V dürfen nur verwendet werden, wenn keine Nettoemissionen aus Landnutzungsänderungen entstehen, also wenn e<sub>l</sub> null oder kleiner ist.</li>
            <li><strong>Nachhaltige Flugkraftstoffe (SAF).</strong> Nach ReFuelEU Aviation (Verordnung (EU) 2023/2405) müssen Biokraftstoffe für die Luftfahrt Art. 29 RED erfüllen; ihre Einsparung wird nach Art. 31 Abs. 1 RED berechnet, also nach der Methode des Anhangs V wie im Modus „Biokraftstoff“, mit den Schwellenwerten des Art. 29 Abs. 10. Synthetische Flugkraftstoffe (e-SAF) müssen die 70-%-Schwelle des Art. 29a Abs. 1 RED erfüllen – verwenden Sie den Modus „E-Fuel“.</li>
            <li><strong>ETBE und TAEE.</strong> Für den erneuerbaren Anteil von ETBE und TAEE gilt der Wert des verwendeten Herstellungswegs für Ethanol.</li>
            <li><strong>Schwellenwerte von 70 % und 80 %.</strong> Die Schwellenwerte in Art. 29 Abs. 10 Buchst. d–h gelten für Strom, Wärme und Kälte aus Biomasse-Brennstoffen, nicht für Biokraftstoffe im Verkehr. Dieses Werkzeug prüft nur Art. 29 Abs. 10 Buchst. a–c; diese hat RED III nicht geändert.</li>
            <li><strong>Mischungen.</strong> Die Mindesteinsparung gilt für den Biokraftstoff selbst. Der Modus „Mischung“ zeigt den Durchschnitt einer Mischung und veranschaulicht den Unterschied zwischen Bioanteil und Einsparung.</li>
          </ul>`,
  'about-heading': 'Über das Projekt',
  'about-text':
    'Erstellt von Unaiz Ahmed Khan, Chemieingenieur in Berlin. Mehrjährige Erfahrung in der Leitung von Produktion und Einkauf bei einem Hersteller erneuerbarer Kraftstoffe; dort hat er die THG-Einsparung der Kraftstoffe des Unternehmens durch die Beschaffung biobasierter Rohstoffe auf 78\u00a0% gesteigert (RED-II-Methodik). Umweltschutzbeauftragter (TÜV Rheinland) und zertifizierter Projektmanager nach IPMA Level D.',
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
