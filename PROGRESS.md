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
- [x] Help tooltips: a "?" button next to every input, term, threshold and result
      label, one plain sentence each in EN and DE (`help`, `helpTerms`,
      `helpEfuelTerms` in `src/i18n.ts`). Shown on hover, keyboard focus and tap through
      the shared floating tooltip; each button and its input point to the sentence with
      `aria-describedby`. The esca "i" button is replaced by its "?" with the same
      RED III text.

## Verified 17.11.2026 (EUR-Lex)

Checked by the owner against Commission Delegated Regulation (EU) 2023/1185 (original
OJ text, not amended) and the RED consolidated text 02018L2001-20240716. All points
below are applied in hints, explainer and "?" help sentences, EN and DE.

1. **Citations.** Formula E = ei + ep + etd + eu − eccs: Annex Part A point 1.
   Comparator 94 and savings = (EF − E) / EF: Part A point 2. Both shown in the UI.
2. **ei** = ei elastic + ei rigid − e ex-use (Part A points 1 and 10). Negative ei is
   allowed; the field accepts it.
3. **eu and captured carbon.** eu = total combustion emissions of the fuel in use
   (point 13). Captured CO₂ from eligible sources is credited inside ei via e ex-use
   (point 10), not by reducing eu. Energy used for capture counts as an input. (The
   first draft had this the other way round; corrected.)
4. **Eligible CO₂ sources** (point 10(a)–(e)): (a) ETS Annex I activities under
   effective carbon pricing, incorporated before 2036 (2041 if not from combusting
   fuels for electricity); (b) air; (c) compliant biofuels/bioliquids/biomass fuels
   without CCU/CCS credit; (d) compliant RFNBO/RCF; (e) geological CO₂ previously
   released naturally. Not eligible: CO₂ from fuel burned specifically to produce CO₂,
   or already credited elsewhere. The 2036/2041 dates are subject to review (point 11).
5. **70 % legal basis.** RFNBO: RED Art. 29a(1) (inserted by RED III; previously
   Art. 25(2)). RCF: RED Art. 29a(2) and Art. 2 of the Regulation.
6. **Electricity** (Part A points 5–6). Fully renewable under RED Art. 27(6) (formerly
   27(3), as cited in the Regulation) = zero. Other grid electricity, per calendar
   year, one of: (a) average intensity of the country or bidding zone (Part C);
   (b) zero if full-load hours fall within hours when renewables/nuclear set the
   price, otherwise 183 gCO₂eq/MJ; (c) marginal unit in the bidding zone if published
   by the TSO. Detailed rules in Delegated Regulation (EU) 2023/1184.
7. **Definitions.** ep = direct processing emissions, waste treatment, leakages
   (point 12); etd = storage and distribution of finished fuel, input transport goes
   in ei (point 16); eu = total combustion emissions in use (point 13); eccs = CO₂
   permanently stored under Directive 2009/31/EC, storage operation emissions in ep
   (point 17).
8. **Same formula** for RFNBO and RCF: confirmed.
9. **German terms** as in the German text of the Regulation: "flüssige oder gasförmige
   erneuerbare Kraftstoffe nicht biogenen Ursprungs für den Verkehr";
   "wiederverwertete kohlenstoffhaltige Kraftstoffe"; ei "Emissionen aus der
   Versorgung mit Einsatzstoffen" (elastic: "mit elastischem Angebot", rigid: "mit
   unelastischem Angebot", ex-use: "Emissionen aus der derzeitigen Nutzung oder
   Bestimmung der Einsatzstoffe"); ep "Emissionen aus der Verarbeitung"; etd
   "Emissionen aus Transport und Verteilung"; eu "Emissionen aus der Verbrennung des
   Kraftstoffs bei der Endnutzung"; eccs "Emissionseinsparungen durch CO2-Abscheidung
   und geologische CO2-Speicherung"; unit "g CO2-Äq./MJ Kraftstoff". Guarded by
   `tests/efuel.test.ts`.
10. **SAF wording.** ReFuelEU Aviation (Regulation (EU) 2023/2405): aviation biofuels
    must meet RED Art. 29; savings calculated under RED Art. 31(1), i.e. the Annex V
    method (Biofuel mode) with the Art. 29(10) thresholds. Synthetic aviation fuels
    (e-SAF) must meet the 70 % threshold of RED Art. 29a(1) (E-fuel mode).
11. **Illustration numbers** (1.5 MJ electricity per MJ fuel, 20 gCO₂eq/MJ) are
    labelled "Illustrative example, not a legal value".
12. **German preset names** match Annex V DE; "Umweltschutzbeauftragter (TÜV
    Rheinland)" matches the owner's profile.

Decided by the owner after PR 3: the German page uses "g CO₂-Äq./MJ" in all modes;
English stays "gCO₂eq/MJ" (`unit` in `src/i18n.ts`, guarded by `tests/i18n.test.ts`).

- [x] PR 4: German unit on the whole German page; About text without "both 2026" and
      without the number of years ("Years of experience leading ..."); LinkedIn post
      updated for biofuels, SAF and e-fuels, supplier comparison, help tooltips and
      EN/DE (178 words); German post in `LINKEDIN_POST_DE.md` (177 words).

## Next

- Decided by the owner: the career profile file is private and must NOT be added to
  this public repo. The job-fit scorer is used privately.

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

- Resolved: the repository was completely empty when work started. With the owner's
  approval, `main` was created from the README-only "Initial commit" of this branch.
- The cloud session needs `red2-ghg-calculator.pages.dev` on its network allowlist to
  check the live site (environment "Unaiz web tools" has it).
