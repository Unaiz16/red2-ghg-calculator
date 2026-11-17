# Progress

Handover file so another session can continue. Update after every step.

## Plan

1. Plan in PROGRESS.md
2. Calculation module + tests (`src/calc.ts`, `tests/calc.test.ts`)
3. UI (`index.html`, `src/main.ts`, `src/terms.ts`, `src/style.css`)
4. Presets + preset tests (`src/presets.ts`, `tests/presets.test.ts`)
5. CI (`.github/workflows/ci.yml`: install, test, build)
6. Push + PR to `main`, owner merges, confirm deploy, check live URL
7. README + LinkedIn draft
8. Final check against every acceptance criterion

## Done

- [x] 1. Plan
- [x] 2. Calculation module + tests (28 tests, all green locally)
- [x] 3. UI, restyled to the owner's design brief (datasheet look: neutral palette,
      one muted green accent, monospace tabular figures, thin rules, no gradients,
      shadows or animation). Checked by screenshot at 360 px and 1280 px.
- [x] 3b. Owner's second brief: live recalculation, number transitions (180 ms, off
      with reduced motion), stacked chart with comparator and threshold lines and
      tooltips, percentage points above/below threshold, shareable link (inputs in the
      URL query), light and dark mode, print stylesheet (one page), container queries.
      Owner said: do not send screenshots, take all design decisions yourself.
- [x] 4. Presets + one test per preset against the Annex V Part A default saving
- [x] 5. CI workflow written (runs on pull requests and on pushes to `main`)
- [x] 7. README (screenshot, method, sources, disclaimer, how to run) and
      `LINKEDIN_POST.md` (175 words, 3 hashtags). Both still need the live URL.

- [x] 6. PR 1 merged, Cloudflare Pages deploys from `main`.
      Live: https://red2-ghg-calculator.pages.dev
- [x] 7b. Live URL added to README and LinkedIn post; post wording fixed as the
      owner asked (generic opening, removed a sentence that was not a profile fact).
- [x] 8. Final acceptance check on the live URL (17.11.2026): all pass.

- [x] Stretch A: German version. EN/DE toggle in the header, texts in `src/i18n.ts`
      (script texts as `EN`/`DE`, static page texts as `STATIC_DE` keyed by
      `data-i18n` in `index.html`). Language comes from `?lang=`, else the browser
      language, else English. German uses decimal commas. `tests/i18n.test.ts` fails
      if a text is missing in either language.

- [x] Stretch B: `job-fit-scorer/` (SKILL.md, README, 3 invented test ads with
      expected results: strong fit, partial fit, not-a-fit). Written before the profile
      file existed; expected results rely only on the About facts.

- [x] PR 3 work: e-fuel mode (RFNBO / recycled carbon fuel) per Delegated Regulation
      (EU) 2023/1185: E = ei + ep + etd + eu − eccs, comparator 94, minimum 70 %
      (E ≤ 28.2). No default values. EN + DE, explainer on grid electricity, SAF note,
      new tagline, blend heading "Blend / compare supplier offers" with a saving column
      per component. `src/calc.ts` (EFUEL_*), `tests/efuel.test.ts`.
- [x] Removed the instruction to add the career profile to this public repo.

## To verify (owner checks on EUR-Lex before PR 3 is marked ready)

Written from memory of the legal texts, not checked against EUR-Lex in this session.

E-fuel mode, Commission Delegated Regulation (EU) 2023/1185:

1. **Formula and numbering.** E = ei + ep + etd + eu − eccs is in the Annex, Part A
   point 1. The UI cites only "Annex".
2. **Structure of ei.** I believe ei = ei elastic + ei rigid − e ex-use (emissions from
   the inputs' existing use or fate). The ei hint says it is "net of the emissions
   avoided from an input's existing use, so it can be negative", and the field accepts
   negative values. Confirm the definition and whether a negative ei is possible.
3. **Where the captured carbon is credited (most important).** The UI says, as
   specified by the owner, that eu counts combustion CO₂ "where the carbon in the fuel
   is not from an eligible source". My recollection is that the Annex books it
   differently: eu counts the combustion emissions of the fuel, and the CO₂ taken up
   from an eligible source is credited inside ei via e ex-use. The total E is the same
   either way, but the wording of the eu and ei hints and explanations should match
   the Annex.
4. **"Eligible source" of CO₂.** Which sources count (for example CO₂ from activities
   under the EU ETS until a cut-off date, direct air capture, biogenic CO₂, geological
   CO₂ released naturally) and the cut-off dates. The UI only says "eligible source"
   and gives no list.
5. **Comparator.** 94 gCO₂eq/MJ is the fossil fuel comparator for RFNBO and recycled
   carbon fuels, and savings = (94 − E) / 94.
6. **70 % minimum and its legal basis.** I believe: RFNBO at least 70 % under RED
   Art. 29a(1) as inserted by RED III (formerly Art. 25(2) RED II); recycled carbon
   fuels at least 70 % under RED Art. 29a(2) and/or Art. 2 of Delegated Regulation
   2023/1185. The UI states 70 % next to the citation of the Delegated Regulation
   without naming an article.
7. **Electricity.** "Electricity that counts as fully renewable under the RED rules is
   taken to have zero emissions; other electricity is counted with its emission
   intensity." Confirm the zero-emission rule and its reference (RED Art. 27 and
   Delegated Regulation (EU) 2023/1184), and how other electricity is counted
   (country values in the Annex or other permitted methods).
8. **Definitions of ep, etd, eu, eccs** as written in `src/i18n.ts` (`efuelTerms`):
   ep "emissions from the production process itself that are not already covered by
   the inputs"; etd "transporting, storing and distributing the finished fuel"; eu
   "emissions from burning the fuel in its end use"; eccs "capturing CO₂ from the
   production process and storing it permanently underground".
9. **Same method for both fuel types.** That the Annex formula applies to RFNBO and to
   recycled carbon fuels alike.
10. **Amendments.** Whether Delegated Regulation 2023/1185 has been amended since
    publication (use the consolidated text if so), and that the link
    https://eur-lex.europa.eu/eli/reg_del/2023/1185/oj opens it.
11. **German terms.** "erneuerbare Kraftstoffe nicht biogenen Ursprungs", "wieder-
    verwertete kohlenstoffhaltige Kraftstoffe", and the German term names
    (Bereitstellung der Inputs, Verarbeitung, Transport und Vertrieb, Verbrennung bei
    der Endnutzung, CO₂-Abscheidung und geologische Speicherung) against the German
    text of the Regulation.

SAF note:

12. "Bio-based SAF, for example HEFA, uses the biofuel method" (Annex V) and "synthetic
    aviation fuel made from renewable electricity uses the e-fuel method". Confirm, and
    confirm that the Art. 29(10)(a)–(c) thresholds apply to biofuels used in aviation.

Not legal values, for information:

13. The explainer's "1.5 MJ of electricity per MJ of fuel" and "20 gCO₂eq/MJ" are an
    illustration with round numbers, labelled as such, not values from the Regulation.

Still open from PR 2:

14. German preset names and the certificate title "Umweltschutzbeauftragter
    (TÜV Rheinland)".

## Next

- Decided by the owner: the career profile file is private and must NOT be added to
  this public repo. The job-fit scorer is used privately.
- [ ] Owner: read the German texts once (see open questions).

## Acceptance criteria status (checked on the live URL)

| Criterion | Status |
| --- | --- |
| E = 20.68 → 78.0%; E = 94 → 0%; E = 0 → 100%; negative E handled and labelled | pass |
| Thresholds at 05.10.2015, 06.10.2015, 01.01.2021 | pass |
| Blend 50% fossil + 50% at E = 20 → 57 g/MJ, 39.4% | pass |
| Presets reproduce 84, 83, 47, 59, 70% | pass |
| Vitest green in GitHub Actions | pass (PR 1) |
| Usable at 360 px, Lighthouse accessibility ≥ 90, no console errors | pass: accessibility 100, best practices 100, 0 console errors |
| Live URL works | pass |
| README: screenshot, method, sources, disclaimer, how to run | pass |
| LinkedIn draft: 120–180 words, max 3 hashtags, About facts only, link | pass (169 words) |

## How the browser checks were run

`npm run build && npx vite preview --port 4173`, then Playwright (Chromium) for the
scenarios and screenshots, and `npx lighthouse http://localhost:4173/` with
`CHROME_PATH` pointing at Chromium. These scripts are not in the repo.

## Open questions

- German wording should be read once by the owner, especially the certificate title
  "Umweltschutzbeauftragter (TÜV Rheinland)" in the About text and the German
  preset names (written to follow the German text of Annex V, not checked against it).

- Resolved: the repository was completely empty when work started. With the owner's
  approval, `main` was created from the README-only "Initial commit" of this branch.
- The cloud session needs `red2-ghg-calculator.pages.dev` on its network allowlist to
  check the live site (environment "Unaiz web tools" has it).
