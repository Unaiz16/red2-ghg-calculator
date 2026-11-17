import { describe, expect, it } from 'vitest';
import {
  EFUEL_MAX_EMISSIONS,
  EFUEL_MIN_SAVINGS_PERCENT,
  efuelEmissions,
  meetsEfuelMinimum,
  round,
  savingsPercent,
} from '../src/calc';

describe('e-fuel emissions (Delegated Regulation (EU) 2023/1185, Annex)', () => {
  it('E = ei + ep + etd + eu − eccs', () => {
    expect(efuelEmissions({ ei: 20, ep: 3, etd: 2, eu: 1, eccs: 4 })).toBeCloseTo(22, 10);
  });

  it('treats missing terms as zero', () => {
    expect(efuelEmissions({ ei: 12.5 })).toBe(12.5);
    expect(efuelEmissions({})).toBe(0);
  });

  it('allows a negative input term', () => {
    expect(efuelEmissions({ ei: -10, ep: 5, etd: 2, eu: 70 })).toBeCloseTo(67, 10);
  });
});

describe('70 % minimum against the 94 gCO2eq/MJ comparator', () => {
  it('uses 70 % and a limit of 28.2 gCO2eq/MJ', () => {
    expect(EFUEL_MIN_SAVINGS_PERCENT).toBe(70);
    expect(EFUEL_MAX_EMISSIONS).toBeCloseTo(28.2, 10);
  });

  it('passes exactly at 70 % and fails just below', () => {
    expect(meetsEfuelMinimum(94 * 0.3)).toBe(true);
    expect(meetsEfuelMinimum(28.3)).toBe(false);
    expect(round(savingsPercent(28.3), 1)).toBe(69.9);
  });

  it('passes with low emissions and fails with grid-level emissions', () => {
    expect(meetsEfuelMinimum(5)).toBe(true);
    expect(meetsEfuelMinimum(150)).toBe(false);
    expect(savingsPercent(150)).toBeLessThan(0);
  });
});
