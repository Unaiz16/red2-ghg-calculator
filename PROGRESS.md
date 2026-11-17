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

## Next

- [ ] Owner: add `job-fit-scorer/Career_Agent_Profile_Unaiz.md`. Then run the three
      test ads through the skill and extend the expected reasons, gaps and keywords
      with the additional profile facts (score band, flag, language and base CV should
      stay as they are).
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
