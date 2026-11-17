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

## Next

- [ ] 6. Push branch `claude/gracious-euler-1vnfuh`, open PR to `main`, confirm CI is
      green on GitHub, owner merges, Cloudflare Pages deploys.
- [ ] After deploy: put the live URL into `README.md` (marker `<!-- LIVE_URL -->`) and
      `LINKEDIN_POST.md` (`LIVE_URL`), check the live site (loads, no console errors).
- [ ] 8. Final acceptance check on the live URL and report to the owner.
- [ ] Stretch, only after everything above is live: A. German version (EN/DE toggle),
      B. `job-fit-scorer/` Claude skill. Not started.

## Acceptance criteria status (local, production build via `vite preview`)

| Criterion | Status |
| --- | --- |
| E = 20.68 → 78.0%; E = 94 → 0%; E = 0 → 100%; negative E handled and labelled | pass (unit tests + browser check) |
| Thresholds at 05.10.2015, 06.10.2015, 01.01.2021 | pass (unit tests + browser check) |
| Blend 50% fossil + 50% at E = 20 → 57 g/MJ, 39.4% | pass (unit test + browser check) |
| Presets reproduce 84, 83, 47, 59, 70% | pass (unit tests) |
| Vitest green in GitHub Actions | pending first run on GitHub |
| Usable at 360 px (no horizontal overflow), Lighthouse accessibility ≥ 90, no console errors | pass locally: accessibility 100, best practices 100, 0 console errors |
| Live URL works | pending deploy |
| README complete | done except live URL |
| LinkedIn draft | done except live URL |

## How the browser checks were run

`npm run build && npx vite preview --port 4173`, then Playwright (Chromium) for the
scenarios and screenshots, and `npx lighthouse http://localhost:4173/` with
`CHROME_PATH` pointing at Chromium. These scripts are not in the repo.

## Open questions

- Resolved: the repository was completely empty when work started. With the owner's
  approval, `main` was created from the README-only "Initial commit" of this branch.
- Live URL is not known yet (depends on the Cloudflare Pages project name).
