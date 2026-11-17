import { describe, expect, it } from 'vitest';
import { DE, EN } from '../src/i18n';
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

describe('e-fuel wording follows the verified legal text', () => {
  it('eu is the total combustion emissions, with the carbon credit in ei', () => {
    expect(EN.efuelTerms.eu.hint).toContain('Total combustion emissions');
    expect(EN.efuelTerms.eu.hint).toContain('credited in eᵢ');
    expect(EN.efuelTerms.ei.hint).toContain('eᵢ = eᵢ elastic + eᵢ rigid − e ex-use');
    expect(EN.helpEfuelTerms.eu).not.toMatch(/not from an eligible source/);
  });

  it('uses the German terms of the Regulation', () => {
    expect(DE.efuelTerms.ei.label).toBe('Emissionen aus der Versorgung mit Einsatzstoffen');
    expect(DE.efuelTerms.ep.label).toBe('Emissionen aus der Verarbeitung');
    expect(DE.efuelTerms.etd.label).toBe('Emissionen aus Transport und Verteilung');
    expect(DE.efuelTerms.eu.label).toBe('Emissionen aus der Verbrennung des Kraftstoffs bei der Endnutzung');
    expect(DE.efuelTerms.eccs.label).toBe(
      'Emissionseinsparungen durch CO₂-Abscheidung und geologische CO₂-Speicherung',
    );
    expect(DE.unit).toBe('g CO₂-Äq./MJ');
    expect(EN.unit).toBe('gCO₂eq/MJ');
  });

  it('names the legal basis of the 70 % minimum', () => {
    for (const dict of [EN, DE]) {
      expect(dict.efuelVerdict(true)).toMatch(/29a/);
      expect(dict.help.efuelThreshold).toMatch(/29a/);
    }
  });
});
