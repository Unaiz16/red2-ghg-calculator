/**
 * GHG savings of a biofuel under RED II as amended by RED III
 * (Directive (EU) 2018/2001, consolidated text 02018L2001-20240716).
 *
 * All intensities are in gCO2eq per MJ of fuel.
 */

/** Fossil fuel comparator EF(t) for transport biofuels, Annex V Part C point 19. */
export const FOSSIL_COMPARATOR = 94;

export const EMISSION_TERMS = ['eec', 'el', 'ep', 'etd', 'eu'] as const;
export const CREDIT_TERMS = ['esca', 'eccs', 'eccr'] as const;
export const ALL_TERMS = [...EMISSION_TERMS, ...CREDIT_TERMS] as const;

export type TermKey = (typeof ALL_TERMS)[number];
export type PathwayInputs = Record<TermKey, number>;

export const ZERO_INPUTS: PathwayInputs = {
  eec: 0,
  el: 0,
  ep: 0,
  etd: 0,
  eu: 0,
  esca: 0,
  eccs: 0,
  eccr: 0,
};

/** E = eec + el + ep + etd + eu − esca − eccs − eccr (Annex V Part C point 1(a)). */
export function totalEmissions(inputs: Partial<PathwayInputs>): number {
  const i = { ...ZERO_INPUTS, ...inputs };
  return i.eec + i.el + i.ep + i.etd + i.eu - i.esca - i.eccs - i.eccr;
}

/** Savings = (EF(t) − E) / EF(t), as a fraction (0.78 = 78 %). */
export function savingsFraction(e: number): number {
  return (FOSSIL_COMPARATOR - e) / FOSSIL_COMPARATOR;
}

export function savingsPercent(e: number): number {
  return savingsFraction(e) * 100;
}

/** Rounds half away from zero to the given number of decimals, tolerant of float noise. */
export function round(value: number, decimals = 0): number {
  const f = 10 ** decimals;
  const r = Math.round(Math.abs(value) * f * (1 + Number.EPSILON)) / f;
  return value < 0 ? -r : r;
}

export type ThresholdPoint = 'a' | 'b' | 'c';

export interface Threshold {
  /** Required minimum savings in percent. */
  percent: 50 | 60 | 65;
  /** Point of Art. 29(10) that applies. */
  point: ThresholdPoint;
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True for a real calendar date written as YYYY-MM-DD. */
export function isIsoDate(value: string): boolean {
  const m = ISO_DATE.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

/**
 * Minimum GHG savings for transport biofuels by the date the installation
 * started operation, Art. 29(10)(a)–(c):
 *  (a) 50 % – in operation on or before 5 October 2015
 *  (b) 60 % – 6 October 2015 to 31 December 2020
 *  (c) 65 % – from 1 January 2021
 * Returns null if the date is not a valid YYYY-MM-DD date.
 */
export function thresholdForStartDate(isoDate: string): Threshold | null {
  if (!isIsoDate(isoDate)) return null;
  // ISO dates compare correctly as strings.
  if (isoDate <= '2015-10-05') return { percent: 50, point: 'a' };
  if (isoDate <= '2020-12-31') return { percent: 60, point: 'b' };
  return { percent: 65, point: 'c' };
}

export function meetsThreshold(e: number, threshold: Threshold): boolean {
  return savingsPercent(e) >= threshold.percent;
}

export interface BlendComponent {
  /** Energy amount in MJ. */
  energyMJ: number;
  /** Emission intensity in gCO2eq/MJ. Ignored when fossil is true. */
  e: number;
  /** Fossil components count as the fossil comparator (94). */
  fossil?: boolean;
}

export interface BlendResult {
  totalEnergyMJ: number;
  /** Energy-weighted intensity in gCO2eq/MJ. */
  intensity: number;
  savingsPercent: number;
  /** Share of non-fossil energy in the blend, in percent. */
  bioSharePercent: number;
}

export const MAX_BLEND_COMPONENTS = 5;

/** Energy-weighted blend of up to 5 components. Null if there is no energy. */
export function blend(components: BlendComponent[]): BlendResult | null {
  if (components.length > MAX_BLEND_COMPONENTS) {
    throw new RangeError(`A blend can have at most ${MAX_BLEND_COMPONENTS} components.`);
  }
  let totalEnergyMJ = 0;
  let emissions = 0;
  let bioEnergy = 0;
  for (const c of components) {
    if (!(c.energyMJ >= 0) || !Number.isFinite(c.energyMJ)) {
      throw new RangeError('Energy amounts must be zero or positive numbers.');
    }
    const e = c.fossil ? FOSSIL_COMPARATOR : c.e;
    if (!Number.isFinite(e)) throw new RangeError('Emission intensities must be numbers.');
    totalEnergyMJ += c.energyMJ;
    emissions += c.energyMJ * e;
    if (!c.fossil) bioEnergy += c.energyMJ;
  }
  if (totalEnergyMJ === 0) return null;
  const intensity = emissions / totalEnergyMJ;
  return {
    totalEnergyMJ,
    intensity,
    savingsPercent: savingsPercent(intensity),
    bioSharePercent: (bioEnergy / totalEnergyMJ) * 100,
  };
}
