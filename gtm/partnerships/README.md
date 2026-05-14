# Partnership Pack — Index

> Everything needed to land 3+ accelerator partnerships in 14 days, and
> use those partnerships to deliver ~5 of the 10 paid customers in the
> overall 30-day plan.

## Files

| File                          | What's in it                                                                                                |
|-------------------------------|-------------------------------------------------------------------------------------------------------------|
| `00-strategy.md`              | Why partnerships are the top channel, the 3-tier structure, value exchange, principles, KPIs.                |
| `01-priority-targets.md`      | 10 priority accelerators / pre-seed funds, with named decision-makers where verified, draft outreach for each. |
| `02-offer-mechanics.md`       | How the partnership operationally works, the one-page partnership agreement template, pricing math.          |
| `03-cobrand-assets.md`        | Ready-to-use copy: cohort email (3 versions), Snapshot delivery email, CFO clinic agenda, quarterly report.  |
| `04-pipeline-tracker.csv`     | The partnership pipeline. Open in Sheets / Airtable.                                                          |
| `05-execution-sprint.md`      | Day-by-day 14-day sprint, the 20-min partnership-call structure, stop-loss tripwires.                         |

## Live site additions (committed to this branch)

- **`/partners.html`** — public partner landing page. Footer of `index.html`
  now links to it. Supports `?partner={slug}` query parameter to show a
  partner-specific welcome banner and tag downstream Snapshot intake with
  attribution. Pre-wired slugs:
  - `?partner=blume` → Blume Ventures
  - `?partner=atoms` → Accel Atoms
  - `?partner=surge` → Sequoia Surge / Peak XV
  - `?partner=antler` → Antler India
  - `?partner=100x` → 100x.vc
  - `?partner=techstars` → Techstars
  - `?partner=ondeck` → On Deck
  - `?partner=stellaris` → Stellaris Ventures
  - `?partner=3one4` → 3one4 Capital
  - `?partner=iterative` → Iterative VC

  Add a new partner by appending to the `PARTNERS` map at the bottom of
  `partners.html`.

## The 14-day plan in one paragraph

Day 1: send 4 priority partnership emails (Blume → Gautham Sivaramakrishnan,
Accel Atoms Program Manager, Surge → Rajan Anandan InMail, Antler India
Platform Lead) + 4 LinkedIn connects + 4 Twitter touches.
Day 2: send 6 second-tier (100x Sanjay Mehta DM, 3 Techstars MDs, Stellaris,
3one4 Siddarth Pai). Day 3: warm-intro work via portfolio alumni. Days 5–6:
follow-up + Iterative + On Deck + Together Fund + Lightspeed. Day 7: Week-1
retro. Days 8–14: hold the calls, send the one-page agreement, build the
co-branded landing page (1 day after a verbal yes), get the first cohort
email out.

Targets at Day 14:
- 12+ partnership first-touches sent
- 6+ calls held
- 3 Tier 1 signed
- 1 Tier 2 in active negotiation
- First 10+ Snapshots arriving via partner traffic

## Why these 10 partners (and not others)

Each priority partner was selected on three criteria:
1. **Portfolio is in our ICP** (pre-seed / seed / first-time founders)
2. **They run a perks / founder-support program** (not just write checks)
3. **They have a titled platform person we can pitch directly** (not just GPs)

The verified named contacts are in `01-priority-targets.md` for:
- **Blume Ventures**: Gautham Sivaramakrishnan (Lead, Market Networks) —
  highest confidence; he literally runs strategic partnerships at Blume
- **Sequoia Surge / Peak XV**: Rajan Anandan (MD; mentors Surge cohorts)
- **Accel Atoms**: Prayank Swaroop + Anand Daniel (Partners on Atoms
  steering); current Program Manager to verify on `atoms.accel.com`
- **Antler India**: Platform Lead to verify on `antler.co/location/india`
- Others have named-role recommendations + clear discovery paths

## What's deliberately NOT here

- The actual sending of the outreach (your accounts / your domains)
- DocuSign / HelloSign agreement workflow (use whichever you prefer; the
  template is in `02-offer-mechanics.md` §5)
- Per-partner discount code wiring (one paragraph spec is in
  `02-offer-mechanics.md` — half-day implementation when checkout is live)
- Stripe checkout for Deep Dive / Founder Call (out of scope of this
  partnership pack; needed once cash conversion goes live)

## What to do today

1. Read `00-strategy.md` then `01-priority-targets.md` (30 min)
2. Open the deployed `partners.html` in a browser at
   `https://acumenadvisors-ai-cfo.vercel.app/partners.html` to see what
   the partner pitch will look like
3. Test the partner attribution URLs:
   `https://acumenadvisors-ai-cfo.vercel.app/partners.html?partner=blume`
   should show "courtesy of **Blume Ventures**"
4. Open `04-pipeline-tracker.csv` in Sheets / Airtable. Confirm the
   priority order matches what you want.
5. Send the four Day-1 priority emails (Blume, Atoms, Surge, Antler)
   following the templates in `01-priority-targets.md`. Each takes ~15
   min to personalise.
6. Add the four LinkedIn connections + four Twitter quote-tweets per the
   sprint plan.
