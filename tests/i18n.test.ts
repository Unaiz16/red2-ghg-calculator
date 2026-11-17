import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DE, EN, STATIC_DE, detectLang } from '../src/i18n';
import { PRESETS } from '../src/presets';
import { TERMS } from '../src/terms';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const staticKeys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);

describe('translations are complete', () => {
  it('every static text block in index.html has a German version', () => {
    expect(staticKeys.length).toBeGreaterThan(20);
    for (const key of staticKeys) expect(STATIC_DE[key], key).toBeTruthy();
  });

  it('has no unused German static texts', () => {
    for (const key of Object.keys(STATIC_DE)) expect(staticKeys, key).toContain(key);
  });

  it('EN and DE define the same messages', () => {
    expect(Object.keys(DE).sort()).toEqual(Object.keys(EN).sort());
    for (const [key, value] of Object.entries(EN)) {
      expect(typeof (DE as unknown as Record<string, unknown>)[key], key).toBe(typeof value);
    }
  });

  it('every term and preset is named in both languages', () => {
    for (const dict of [EN, DE]) {
      for (const term of TERMS) {
        expect(dict.terms[term.key].label).toBeTruthy();
        expect(dict.terms[term.key].explain).toBeTruthy();
      }
      for (const preset of PRESETS) expect(dict.presets[preset.id]).toBeTruthy();
    }
  });

  it('English preset names match the verified preset list', () => {
    for (const preset of PRESETS) expect(EN.presets[preset.id]).toBe(preset.name);
  });

  it('keeps the disclaimer wording', () => {
    expect(EN.disclaimer).toBe(
      "Educational tool. Not for certification, audits or official GHG reporting. Use certified values and your certification scheme's rules.",
    );
  });
});

describe('detectLang', () => {
  it('prefers the lang parameter', () => {
    expect(detectLang('?lang=de', 'en-GB')).toBe('de');
    expect(detectLang('?lang=en&mode=blend', 'de-DE')).toBe('en');
  });

  it('falls back to the browser language, then English', () => {
    expect(detectLang('', 'de-AT')).toBe('de');
    expect(detectLang('?lang=fr', 'fr-FR')).toBe('en');
    expect(detectLang('', undefined)).toBe('en');
  });

  it('formats percentages per language', () => {
    expect(EN.percent('84.1')).toBe('84.1%');
    expect(DE.percent('84,1')).toBe('84,1 %');
  });
});
