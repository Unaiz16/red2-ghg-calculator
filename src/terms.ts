import type { TermKey } from './calc';

export interface TermInfo {
  key: TermKey;
  /** Subscript part of the symbol, e.g. "ec" for e_ec. */
  sub: string;
  label: string;
  /** Short hint shown under the input. */
  hint?: string;
  /** Plain-language explanation, 2–3 sentences. HTML allowed (static, trusted). */
  explain: string;
  /** Whether negative values are allowed in the input. */
  allowNegative?: boolean;
}

export const ESCA_TOOLTIP =
  'Since RED III, soil-carbon savings count only with solid, verifiable evidence that soil carbon has increased, with no risk of harming biodiversity, and after accounting for any extra fertiliser or herbicide use (Annex V Part C point 6 as amended).';

export const TERMS: readonly TermInfo[] = [
  {
    key: 'eec',
    sub: 'ec',
    label: 'Extraction or cultivation of raw materials',
    explain:
      'Emissions from growing or extracting the raw material, for example fertiliser production, field emissions and diesel for machinery. For wastes and residues such as used cooking oil it is zero, because they carry no emissions up to the point of collection. For crop-based fuels it is often the largest term.',
  },
  {
    key: 'el',
    sub: 'l',
    label: 'Carbon stock changes from land-use change',
    hint: 'Annualised. Annex V default values apply only if this is 0 or below.',
    allowNegative: true,
    explain:
      'Annualised emissions from carbon stock changes when land is converted to grow the feedstock, for example grassland turned into cropland. It is zero when no land-use change took place. Annex V default values may only be used when this term is zero or below.',
  },
  {
    key: 'ep',
    sub: 'p',
    label: 'Processing',
    explain:
      'Emissions from turning the raw material into fuel: heat, electricity and chemicals used at the plant. The process fuel makes a large difference, which is why Annex V lists several pathways for the same crop.',
  },
  {
    key: 'etd',
    sub: 'td',
    label: 'Transport and distribution',
    explain:
      'Emissions from moving and storing the raw materials, intermediate products and the finished fuel. Long supply routes raise this term. Among the presets here, sugar cane ethanol has the highest default value.',
  },
  {
    key: 'eu',
    sub: 'u',
    label: 'Fuel in use',
    hint: '0 for biofuels (Annex V Part C point 13).',
    explain:
      'Emissions from burning the fuel. For biofuels this term is taken to be zero (Annex V Part C point 13). The field is kept so the formula is complete; leave it at 0.',
  },
  {
    key: 'esca',
    sub: 'sca',
    label: 'Soil carbon accumulation',
    hint: 'Via improved agricultural management.',
    explain: `Emission savings from building up carbon in the soil through improved agricultural management. ${ESCA_TOOLTIP}`,
  },
  {
    key: 'eccs',
    sub: 'ccs',
    label: 'CO₂ capture and geological storage',
    explain:
      'Emission savings from capturing CO₂ released during the production of the fuel and storing it permanently underground. Only emissions that are actually avoided this way count, and only if they are not already counted in the processing term.',
  },
  {
    key: 'eccr',
    sub: 'ccr',
    label: 'CO₂ capture and replacement',
    explain:
      'Emission savings from capturing CO₂ of biomass origin and using it to replace fossil-derived CO₂ in commercial products and services. Like the other two savings terms, it is subtracted from the total.',
  },
];
