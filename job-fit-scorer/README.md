# Job-fit scorer

A Claude skill that scores a job ad against a career profile.

## Files

- `SKILL.md`: the skill.
- `Career_Agent_Profile_Unaiz.md`: the career profile. **Not in the repository yet; the owner adds it.** The skill refuses to score without it.
- `tests/`: three invented job ads with expected results.

## Use

1. Put `Career_Agent_Profile_Unaiz.md` in this folder.
2. Install the folder as a skill (for Claude Code: copy it to `.claude/skills/job-fit-scorer/`).
3. Paste a job ad and ask for the fit.

## Tests

| Ad | Expected |
| --- | --- |
| `tests/01-strong-fit.md` | score 80 or higher, no flag, `EN Procurement` |
| `tests/02-partial-fit.md` | score 40 to 59, no flag, `DE Sustainability` |
| `tests/03-not-a-fit.md` | score 30 or lower, flag set (junior or graduate programme), `DE Procurement` or `DE General` |

The expected results were written before the profile file existed. They rely only on the facts published in the calculator's About section, and each file lists them. Once the profile is added, run the three ads again and update the expected reasons, gaps and keywords with the additional facts from the profile. The score band, flag, role language and base CV should not change.
