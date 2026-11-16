import { describe, expect, it } from 'vitest';
import { round, savingsPercent, totalEmissions } from '../src/calc';
import { PRESETS } from '../src/presets';

const expected: Record<string, { total: number; saving: number }> = {
  'wco-biodiesel': { total: 14.9, saving: 84 },
  'wco-hvo': { total: 16.0, saving: 83 },
  'rapeseed-biodiesel': { total: 50.1, saving: 47 },
  'sugar-beet-ethanol': { total: 38.2, saving: 59 },
  'sugar-cane-ethanol': { total: 28.6, saving: 70 },
};

describe('presets reproduce Annex V Part A default savings', () => {
  it('contains exactly the five verified presets', () => {
    expect(PRESETS.map((p) => p.id).sort()).toEqual(Object.keys(expected).sort());
  });

  for (const preset of PRESETS) {
    it(`${preset.name}: ${preset.partASavingPercent} %`, () => {
      const e = totalEmissions({ eec: preset.eec, ep: preset.ep, etd: preset.etd });
      expect(e).toBeCloseTo(preset.total, 10);
      expect(preset.total).toBe(expected[preset.id].total);
      expect(round(savingsPercent(e))).toBe(preset.partASavingPercent);
      expect(preset.partASavingPercent).toBe(expected[preset.id].saving);
    });
  }
});
