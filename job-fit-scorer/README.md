# Job-fit scorer

A Claude skill that scores a job ad against a career profile.

## Files

- `SKILL.md`: the skill.
- `tests/`: three invented job ads with expected results.

## Use

The skill needs a career profile file, `Career_Agent_Profile_Unaiz.md`. That file is private and is **not part of this public repository; do not commit it here**. The skill is used privately, with the profile kept next to the private copy of the skill. Without the profile the skill refuses to score.

## Tests

| Ad | Expected |
| --- | --- |
| `tests/01-strong-fit.md` | score 80 or higher, no flag, `EN Procurement` |
| `tests/02-partial-fit.md` | score 40 to 59, no flag, `DE Sustainability` |
| `tests/03-not-a-fit.md` | score 30 or lower, flag set (junior or graduate programme), `DE Procurement` or `DE General` |

The expected results rely only on the facts published in the calculator's About section, and each file lists them. A private profile contains more facts, so a private run may list more reasons, gaps and keywords. The score band, flag, role language and base CV should not change.
