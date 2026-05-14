# GTM Pack — Acumen Advisors AI-CFO

Everything needed to identify the ICP, build a 100–150+ prospect cycle, and
close 10 paying customers in 30 days.

## Files

| File                              | What's in it                                                                                                  |
|-----------------------------------|---------------------------------------------------------------------------------------------------------------|
| `01-ICP.md`                       | The ideal customer profile, persona, verticals, geographies, buying triggers, anti-ICP, and addressable TAM. |
| `02-prospect-list.csv`            | Mix of (a) ~20 named, verifiable real companies, and (b) ~40 cohort-recipes that resolve to **2,500+ named prospects** once mined. |
| `03-outreach-playbook.md`         | 7-channel mix with templates: cold email, LinkedIn DM, X, accelerator partnerships, communities, content, referral. |
| `04-30-day-execution-plan.md`     | Week-by-week, day-by-day plan with KPI targets and stop-loss tripwires.                                       |
| `05-tracking-template.csv`        | The pipeline tracker. Open in Google Sheets / Airtable.                                                       |

## How to read the prospect list

`02-prospect-list.csv` has two kinds of rows:

1. **`entry_type=named_company`** — a specific, individually verifiable
   company (e.g. Beacon Health, OrbitShift, Multibagg AI). These came from
   public sources in May 2026: TechCrunch, Inc42, The SaaS News, YC W26
   demo day coverage. Each has 1 prospect.
2. **`entry_type=cohort_recipe`** — a defined slice of a public list that
   resolves to N named companies once mined (e.g. "YC W26 batch — all B2B
   SaaS & AI-services companies, ~120 of 196"). Each row tells you exactly
   which page to mine and an estimated count.

**Why this structure:** Honesty. A reliable 150-name verified-and-enriched
list takes 2 days of work in Apollo / Sales Navigator / Crunchbase. Without
those tools, hand-curating 150 verified prospects from this environment
would either (a) leave you with broad guesses or (b) silently hallucinate
names. The cohort-recipe structure resolves to **far more than 150 named
prospects** when you spend 2 hours mining the linked source pages.

**Mining instructions for the highest-yield row:**
> Row: "YC W26 batch — all B2B SaaS & AI-services companies"
>
> Go to `https://www.ycombinator.com/companies?batch=Winter+2026`,
> filter industry → B2B + AI, open each company page, copy:
> - Company name
> - Founder names (YC publishes them)
> - Founder emails (YC publishes them on most pages)
> - Website
> - One-line description (for personalisation)
>
> Drop into `05-tracking-template.csv`. This single row produces ~120
> rows of named, enriched prospects. Repeat for YC S25 (~130) and W25 (~110).
> **Total from YC alone: ~360 named prospects.**

## How to read the playbook

Section 0 of `03-outreach-playbook.md` shows you the funnel math: to hit
10 paid customers you need ~160 free Snapshots, which means ~460 engaged
conversations, which means ~5,800 prospect touches across all channels.

That's why this isn't a "send 150 emails" plan — it's a **7-channel
parallel push** where cold email is one of seven workstreams, accelerator
partnerships are the highest-leverage bet, and organic content is the
compounding flywheel.

## How to read the 30-day plan

`04-30-day-execution-plan.md` is opinionated and dated. Day 0 is today
(2026-05-14). It has a daily action checklist, weekly KPI targets,
five stop-loss tripwires, and a ranked list of "if you only do 5 things
from this plan" bets.

## What's NOT in this pack (because Claude can't do it remotely)

- **Sending the actual emails** — you (or a paid VA) need to run the
  Apollo / Smartlead loop. Templates and sequence dates are in
  `03-outreach-playbook.md`.
- **Verified contact info per named prospect** — needs Apollo / Lusha /
  Hunter / LinkedIn Sales Navigator. Tracking template has empty cells
  for these. Budget ~$220/mo on tooling (breakdown in playbook §4).
- **Partnership-channel negotiations** — pure human work. Templates and
  target list in playbook §1D.
- **The actual Snapshot output PDF template** — the single biggest
  Snapshot → Paid conversion lever. Spec is in playbook §5.

## Suggested order of operations starting today

1. Read `01-ICP.md` end-to-end (15 min). Confirm it matches your intent.
2. Skim `04-30-day-execution-plan.md` Week 0 setup section. Order the
   tooling today (Apollo, Smartlead, Sales Nav, Calendly). Domain warmup
   takes 7 days so start NOW.
3. Pull the YC W26 + S25 batch lists into the tracking sheet by EOD
   tomorrow — this alone is ~250 named founders.
4. Send the 5 partnership-pitch emails (playbook §1D template) by EOD
   tomorrow. These are higher-leverage than any cold email.
5. F2 publishes LinkedIn post #1 ("3 numbers every founder gets wrong")
   on Day 1 of Week 1. The content engine is what gives you inbound and
   compounds beyond month 1.

## Honest expectation-setting

10 paid in 30 days is **achievable but not guaranteed**. Realistic ranges
by channel-mix execution quality:

| Execution quality | Likely paid customers in 30 days |
|-------------------|----------------------------------|
| Excellent (3 partnerships live, daily cadence held, content posted)  | 12–18 |
| Good (2 partnerships, mostly on cadence, 60% content)                 | 8–12  |
| Mediocre (1 partnership, cold email only, no content)                 | 3–6   |
| Poor (no partnerships, partial cadence)                                | 0–3   |

The single highest-variance factor is **the 3 partnerships in Week 1**.
One serious accelerator partnership (Antler India, Surge, Accel Atoms,
Blume) sends you 30–60 free Snapshots in 30 days. The cold/content side
will then convert ~10–20% of those. That's the most likely path to 10.

## Branch & repo

Working branch: `claude/icp-client-strategy-fvZKR`

Everything in this `gtm/` folder is the deliverable. The site code in
`index.html`, `snapshot.html` etc. was not modified.
