import { describe, expect, it } from 'vitest';
import {
  FOSSIL_COMPARATOR,
  blend,
  isIsoDate,
  meetsThreshold,
  round,
  savingsPercent,
  thresholdForStartDate,
  totalEmissions,
} from '../src/calc';

describe('totalEmissions (Annex V Part C point 1(a))', () => {
  it('adds emissions and subtracts credits', () => {
    const e = totalEmissions({ eec: 10, el: 2, ep: 8, etd: 3, eu: 0, esca: 1, eccs: 0.5, eccr: 0.82 });
    expect(e).toBeCloseTo(20.68, 10);
  });

  it('treats missing terms as zero', () => {
    expect(totalEmissions({ ep: 13, etd: 1.9 })).toBeCloseTo(14.9, 10);
    expect(totalEmissions({})).toBe(0);
  });

  it('can go negative with large esca / eccr', () => {
    expect(totalEmissions({ eec: 5, ep: 10, etd: 2, esca: 12, eccr: 15 })).toBeCloseTo(-10, 10);
  });
});

describe('savings vs fossil comparator 94', () => {
  it('uses EF(t) = 94 gCO2eq/MJ', () => {
    expect(FOSSIL_COMPARATOR).toBe(94);
  });

  it('E = 20.68 gives 78.0 %', () => {
    expect(round(savingsPercent(20.68), 1)).toBe(78.0);
  });

  it('E = 94 gives 0 %', () => {
    expect(savingsPercent(94)).toBe(0);
  });

  it('E = 0 gives 100 %', () => {
    expect(savingsPercent(0)).toBe(100);
  });

  it('negative E gives more than 100 %', () => {
    expect(savingsPercent(-9.4)).toBeCloseTo(110, 10);
  });

  it('E above the comparator gives negative savings', () => {
    expect(savingsPercent(103.4)).toBeCloseTo(-10, 10);
  });
});

describe('threshold by installation start date (Art. 29(10)(a)-(c))', () => {
  it('05.10.2015 is the last day of the 50 % band', () => {
    expect(thresholdForStartDate('2015-10-05')).toEqual({ percent: 50, point: 'a' });
  });

  it('06.10.2015 is the first day of the 60 % band', () => {
    expect(thresholdForStartDate('2015-10-06')).toEqual({ percent: 60, point: 'b' });
  });

  it('31.12.2020 is the last day of the 60 % band', () => {
    expect(thresholdForStartDate('2020-12-31')).toEqual({ percent: 60, point: 'b' });
  });

  it('01.01.2021 is the first day of the 65 % band', () => {
    expect(thresholdForStartDate('2021-01-01')).toEqual({ percent: 65, point: 'c' });
  });

  it('covers dates far from the boundaries', () => {
    expect(thresholdForStartDate('1998-03-12')?.percent).toBe(50);
    expect(thresholdForStartDate('2018-07-01')?.percent).toBe(60);
    expect(thresholdForStartDate('2026-11-16')?.percent).toBe(65);
  });

  it('rejects invalid dates', () => {
    expect(thresholdForStartDate('')).toBeNull();
    expect(thresholdForStartDate('05.10.2015')).toBeNull();
    expect(thresholdForStartDate('2015-02-30')).toBeNull();
    expect(isIsoDate('2024-02-29')).toBe(true);
    expect(isIsoDate('2023-02-29')).toBe(false);
  });

  it('passes exactly at the threshold and fails just below', () => {
    const c = thresholdForStartDate('2021-01-01')!;
    expect(meetsThreshold(94 * 0.35, c)).toBe(true); // exactly 65 %
    expect(meetsThreshold(33, c)).toBe(false); // 64.9 %
    const a = thresholdForStartDate('2015-10-05')!;
    expect(meetsThreshold(47, a)).toBe(true); // exactly 50 %
    expect(meetsThreshold(50.1, a)).toBe(false); // rape seed default, 46.7 %
  });
});

describe('blend', () => {
  it('50 % fossil + 50 % at E = 20 gives 57 g/MJ and 39.4 %', () => {
    const r = blend([
      { energyMJ: 50, e: 0, fossil: true },
      { energyMJ: 50, e: 20 },
    ])!;
    expect(r.intensity).toBeCloseTo(57, 10);
    expect(round(r.savingsPercent, 1)).toBe(39.4);
    expect(r.bioSharePercent).toBe(50);
  });

  it('fossil components always count as 94', () => {
    const r = blend([{ energyMJ: 10, e: 3, fossil: true }])!;
    expect(r.intensity).toBe(94);
    expect(r.savingsPercent).toBe(0);
    expect(r.bioSharePercent).toBe(0);
  });

  it('weights by energy, not by count', () => {
    const r = blend([
      { energyMJ: 99, e: 20 },
      { energyMJ: 1, e: 0, fossil: true },
    ])!;
    expect(r.intensity).toBeCloseTo(20.74, 10);
    expect(round(r.savingsPercent, 1)).toBe(77.9);
    expect(r.bioSharePercent).toBe(99);
  });

  it('ignores zero-energy components and returns null with no energy', () => {
    expect(blend([{ energyMJ: 0, e: 20 }])).toBeNull();
    expect(blend([])).toBeNull();
    const r = blend([
      { energyMJ: 0, e: 500 },
      { energyMJ: 5, e: 10 },
    ])!;
    expect(r.intensity).toBe(10);
  });

  it('allows at most 5 components and rejects negative energy', () => {
    const six = Array.from({ length: 6 }, () => ({ energyMJ: 1, e: 10 }));
    expect(() => blend(six)).toThrow(RangeError);
    expect(blend(six.slice(0, 5))).not.toBeNull();
    expect(() => blend([{ energyMJ: -1, e: 10 }])).toThrow(RangeError);
  });
});

describe('round', () => {
  it('rounds half up despite float noise', () => {
    expect(round(1.005, 2)).toBe(1.01);
    expect(round(78.04, 1)).toBe(78.0);
    expect(round(-0.04, 1)).toBe(-0);
  });
});
