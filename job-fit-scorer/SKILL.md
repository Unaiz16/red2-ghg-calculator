---
name: job-fit-scorer
description: Scores how well a job ad fits Unaiz Ahmed Khan's career profile. Use when given a job ad (pasted text, file or link content) and asked whether to apply, how good the fit is, which CV to send, or which keywords to mirror. Returns a fit score from 1 to 100, top reasons, gaps, role language, the base CV to use, keywords to mirror and a not-a-fit flag. Uses only facts from Career_Agent_Profile_Unaiz.md.
---

# Job-fit scorer

Scores one job ad against the career profile in `Career_Agent_Profile_Unaiz.md` (same folder as this file) and says what to do with it.

## Inputs

1. **The job ad.** Full text. If only a link is given and the text cannot be read, ask for the text. Do not score from a title alone.
2. **The profile.** Read `Career_Agent_Profile_Unaiz.md` completely before scoring, every time. If the file is missing or empty, stop and say so. Do not score from memory or from earlier conversations.

## The one hard rule

**Use only facts that are written in the profile file. Never invent.**

- Every reason, every keyword and every claim about experience must be traceable to a sentence in the profile. Quote or paraphrase it closely.
- If the ad asks for something the profile does not mention, that is a **gap**, even if it seems likely he has it. Write "not stated in the profile", not a guess.
- Do not upgrade facts: no rounded-up years, no stronger titles, no higher language levels, no tools or certificates that are not listed.
- Do not infer the employer's name, salary, team size or anything else the ad does not state. Write "not stated in the ad".

## Procedure

### 1. Read the ad

Extract, in the ad's own words:

- role title, company, location, remote or on-site, contract type
- must-have requirements and nice-to-have requirements, kept separate
- main tasks
- language of the ad and language requirements stated in it
- seniority (years asked, "junior", "graduate", "trainee", "senior", "lead", "head of")

### 2. Check the not-a-fit rules first

Set `not_a_fit: true` if the role is mainly one of these. Each rule needs evidence from the ad.

| Rule | Applies when |
| --- | --- |
| Pure lab or R&D | The work is mainly bench work, laboratory analysis or research with no production, procurement, project or sustainability responsibility. |
| Field sales without technical content | The role is mainly quota-carrying outside sales or account hunting, and the ad names no technical or engineering content. |
| C2 German as main requirement | The ad requires native-level or C2 German ("verhandlungssicher auf muttersprachlichem Niveau", "C2", "Muttersprache") and the role's core is German-language writing, negotiation or public representation. Compare with the German level stated in the profile. If the ad asks for a level at or below the profile's stated level, this rule does not apply. |
| Junior or graduate programme | Trainee, graduate programme, internship, working student, or a role limited to 0–2 years of experience. |

If a rule applies, cap the score at 30, name the rule and the sentence in the ad that triggers it, and still fill in the other fields briefly. A not-a-fit result is a useful answer; do not soften it.

Mixed roles (for example technical sales with real engineering content, or process development with plant responsibility) are not automatically not-a-fit. Score them normally and mention the concern under gaps.

### 3. Score

Score each dimension from the profile and the ad only. Add them up.

| Dimension | Points | What to look at |
| --- | ---: | --- |
| Core experience match | 35 | Do the main tasks match what the profile says he has done (for example production, procurement, renewable fuels, sustainability, project management)? |
| Must-have requirements | 25 | Share of must-haves covered by a profile fact. A missing must-have costs more than a missing nice-to-have. |
| Industry and domain | 15 | Same or neighbouring industry and regulation as in the profile. |
| Seniority and scope | 10 | Level, team or budget responsibility asked compared with what the profile states. |
| Language and location | 10 | Language requirements against the profile's stated levels; location and remote set-up against the profile's stated preferences. |
| Nice-to-haves | 5 | Certificates, tools, extras that the profile lists. |

Bands:

- **80–100** strong fit: apply.
- **60–79** good fit: apply, address the gaps in the cover letter.
- **40–59** partial fit: apply only if the role is attractive for other reasons; say which.
- **1–39** weak fit or not-a-fit: do not apply.

Give one whole number. Do not give a range. If the ad is too thin to judge a dimension, give that dimension half its points and say so.

### 4. Role language

`EN` or `DE`: the language the application should be written in. Use the language of the ad, unless the ad asks for applications in another language. If the ad is bilingual, choose the language of the requirements section.

### 5. Base CV

Choose exactly one of the eight base CVs: language × focus.

- Language: same as the role language (`EN` or `DE`).
- Focus:
  - **Procurement**: sourcing, purchasing, supplier management, feedstock or commodity buying is the main task.
  - **Production**: plant operation, manufacturing, process or operations management is the main task.
  - **Sustainability**: GHG accounting, certification, environmental compliance, ESG or regulation is the main task.
  - **General**: mixed roles, project management, or none of the three clearly leads.

Name it as `EN Procurement`, `DE Sustainability` and so on. Give one sentence saying which tasks in the ad decided it.

### 6. Keywords to mirror

List the ad's own terms that he can truthfully use in the CV or cover letter.

- Include a keyword **only if a profile fact supports it**. Add the supporting fact in brackets.
- Keep the ad's exact wording and language, so the application matches the screening.
- Put keywords from the ad that the profile does not support in **gaps**, not here.
- 5 to 12 keywords. Fewer is fine if fewer are true.

## Output format

Return exactly this structure, in English, regardless of the ad's language.

```
## Job fit: <role title> at <company or "not stated in the ad">

**Fit score:** <1–100> (<strong fit | good fit | partial fit | weak fit | not a fit>)
**Not-a-fit flag:** <no | yes: rule and the sentence from the ad>
**Role language:** <EN | DE>
**Base CV:** <EN|DE> <General|Procurement|Production|Sustainability>: <one sentence why>

### Top reasons
1. <requirement from the ad> ↔ <fact from the profile>
2. ...
(3 to 5, strongest first)

### Gaps
- <requirement from the ad>: <not stated in the profile | profile states less: what it states>
(all must-have gaps, then the main nice-to-have gaps; "none found" if there are none)

### Keywords to mirror
- <keyword from the ad> (<supporting profile fact>)

### Score breakdown
| Dimension | Points |
| --- | ---: |
| Core experience match | x / 35 |
| Must-have requirements | x / 25 |
| Industry and domain | x / 15 |
| Seniority and scope | x / 10 |
| Language and location | x / 10 |
| Nice-to-haves | x / 5 |

### Recommendation
<apply | apply and address gaps | apply only if ... | do not apply>, in one or two sentences.
```

## Checks before answering

- Every line under "Top reasons" and "Keywords to mirror" points to a fact that is in the profile file.
- No requirement of the ad is described as met without a profile fact.
- The score equals the sum of the breakdown, and respects the cap of 30 when the not-a-fit flag is set.
- Role language and CV language are the same.
- Exactly one base CV is named.

## Tests

`tests/` holds three job ads (strong fit, partial fit, not-a-fit) with expected results. After changing this skill or the profile, run the skill on each ad and compare with the `expected-*.md` file next to it. The companies in the test ads are invented.
