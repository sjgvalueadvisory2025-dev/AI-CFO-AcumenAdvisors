# Partnership Offer Mechanics

> How the partnership actually works, day-by-day, once signed. This is
> what we hand to the partner during the call as a one-pager.

---

## What a founder in a partnership cohort experiences

1. They get an email from their accelerator / VC titled something like
   *"New CFO benefit for {Antler / Atoms / Surge} founders"*.
2. The email contains a unique link: `https://acumenadvisors-ai-cfo.vercel.app/partners/{partner-slug}`
3. The landing page shows the partner's logo at the top, a personalised
   "Welcome, {partner-name} founder" message, and **one button**: "Claim
   your free Snapshot."
4. They fill out the Snapshot intake form (same `snapshot.html` flow,
   but with a hidden `partner_slug` field that attributes the lead).
5. Within 24 hours, they receive a PDF Snapshot. The email comes with
   **co-branding**: "Reviewed by an Acumen Advisors senior CFO, brought
   to you by your friends at {partner}."
6. The Snapshot output includes a CTA for the **discounted Deep Dive
   ($49 instead of $99)** with a unique partner discount code (e.g.,
   `BLUME50`).
7. If they pay for Deep Dive, the partner gets credit in our attribution
   table and (Tier 2/3 only) a 15-20% revenue share.

## What the partner experiences

1. They sign a simple one-page agreement (Section 5 below).
2. We build them a custom landing page in 1 business day, with their
   logo and brand colour. We email them the link.
3. They send ONE email to their cohort. We provide the copy (see
   `03-cobrand-assets.md`).
4. (Tier 2/3 only) Once per quarter we run a 60-min "CFO clinic" Zoom
   for their cohort. We do everything — they just promote it.
5. Monthly: we email them a 1-page report: *"This month, {N} of your
   founders requested Snapshots. {N} upgraded to Deep Dive. {N} booked
   Founder Calls. Testimonials below."*
6. Quarterly: video call to review, plan next quarter, and (Tier 2/3)
   pay revenue share via wire.

## How the discount codes work

Every partner gets two codes:

- `{PARTNER_SLUG}50` → 50% off Deep Dive ($49 instead of $99)
- `{PARTNER_SLUG}25` → 25% off Founder Call ($261 instead of $349)

Examples:
- `BLUME50`, `BLUME25`
- `ATOMS50`, `ATOMS25`
- `SURGE50`, `SURGE25`
- `ANTLER50`, `ANTLER25`

These codes are also used for attribution: when a founder enters
`BLUME50` at checkout, the row is tagged `attribution_partner=blume`.

### Technical implementation note

The current `snapshot.html` / `deep-dive.html` / `founder-call.html`
flows don't yet have discount codes or partner attribution. Three small
additions needed (low effort, ~half a day's work):

1. Add an optional `?partner=blume` URL parameter that:
   - Renders the partner logo in the form header
   - Adds a hidden `partner_slug` field to the form
   - Forwards `partner_slug` to the `/api/submit` endpoint
2. In `/api/submit.js`, append `partner_slug` to the email body so the
   founder team sees it.
3. Build `/partners/{slug}` landing-page variants (or use the new
   `partners.html` with query params to switch logos — the lightest-weight
   option).

Until paid checkout exists (right now the site has free Snapshot only and
collects info but doesn't take card), the discount codes live only in
the Snapshot output PDF as a one-time link to a Stripe checkout.

## Revenue share & attribution

**Tier 1 partners:** no revenue share. Listed perk only.

**Tier 2 partners:** 15% of net paid revenue from their attributed
founders, paid quarterly, only on:
- Deep Dive ($99) — partner gets $14.85
- Founder Call ($349) — partner gets $52.35
- First 12 months of any fractional-CFO retainer signed by a partner-
  attributed founder — partner gets 15% of monthly retainer (e.g., $4k
  retainer = $600/mo to partner for 12 months)

**Tier 3 partners:** 20% of net paid revenue, same scope. Plus
exclusivity in their geo for 90 days.

**Attribution rules:**
- A founder is attributed to the FIRST partner whose link they click
- Attribution windows: 60 days from first click to Snapshot, 90 days
  from Snapshot to first paid purchase
- If a founder enters TWO partner codes, attribution goes to the FIRST
  in time
- If a founder is attributed to a partner but later signs an ongoing
  retainer that was directly sold by Acumen (not through the partner
  channel), partner still gets the 15-20% (Tier 2/3 only). This keeps
  the partner motivated for high-value upsells.

## What we promise the partner in writing

The partnership one-pager (Section 5) commits us to:

1. 24-hour Snapshot turnaround for partner founders (same as standard)
2. NDA-equivalent confidentiality on all founder data
3. Never use founder data to train models
4. Never solicit a partner's founder for a competing accelerator's program
5. Deliver a quarterly transparency report on usage and conversions
6. Pay revenue share within 30 days of quarter-end (Tier 2/3)
7. Notify partner 60 days in advance if we ever wind down the perk

## What we do NOT promise

1. Won't promise the partner exclusivity unless they're Tier 3
2. Won't tie the partner's brand to specific Acumen revenue forecasts —
   we promise effort, not outcomes
3. Won't share individual founder data with the partner (we share
   aggregated stats only — protects founders, keeps us trustworthy)
4. Won't agree to the partner pre-approving our Snapshot recommendations
   (we are the CFO; that's the value)

## The partner one-pager agreement (template)

This is the actual document we send via DocuSign / HelloSign / paper
once they verbally agree. Designed to be a one-page yes/no — not a
heavy MSA.

```
ACUMEN ADVISORS × {PARTNER NAME} — FOUNDER BENEFIT AGREEMENT

Effective: {date}
Term: 12 months, auto-renewing for 12-month periods unless either party
terminates with 30 days' notice.

Tier: {1 / 2 / 3}

What Acumen provides:
  • Free Snapshot for every {Partner} portfolio / cohort founder
  • $49 Deep Dive (50% off list) for every {Partner} portfolio founder
  • $261 Founder Call (25% off list) for every {Partner} portfolio founder
  [Tier 2+] • Custom landing page at acumenadvisors-ai-cfo.vercel.app/partners/{slug}
  [Tier 2+] • Quarterly 60-min CFO clinic for the cohort
  [Tier 3]  • Free Founder Call for every founder in the cohort
  [Tier 3]  • Co-authored quarterly "State of Pre-Seed Finance" report

What {Partner} provides:
  • One email or Slack message per quarter to the cohort introducing the
    benefit
  • Logo and brand assets for the co-branded landing page
  [Tier 2+] • Quarterly 30-min review call

Revenue share:
  Tier 1: none
  Tier 2: 15% of net paid revenue from Partner-attributed founders,
          paid quarterly, on Deep Dive, Founder Call, and the first 12
          months of any retainer
  Tier 3: 20% (same scope) + 90-day geographic exclusivity

Confidentiality:
  All founder data is treated under NDA-equivalent terms. Never used to
  train models. Deleted on founder's request. Acumen will share with
  {Partner} only aggregated, anonymised usage statistics.

Termination:
  Either party may terminate with 30 days' written notice. Acumen will
  honour any Snapshot in-progress at termination date.

Signed,
__________________________     __________________________
{Acumen signatory}              {Partner signatory}
Acumen Advisors                 {Partner}
```

## Pricing math — why this works for us

Per partnership over 12 months (typical Tier 2):

| Line                                   | Volume         | Per-unit | Total          |
|----------------------------------------|----------------|----------|----------------|
| Free Snapshots delivered               | 80             | $0       | $0             |
| Deep Dive @ $49 (20% conversion)       | 16             | $49      | $784           |
| Founder Call @ $261 (8% conversion)    | 6              | $261     | $1,566         |
| Retainer signed (5% conversion)        | 4              | $4k/mo × 12 = $48k | $192,000 |
| **Total gross**                        |                |          | **~$194,350**  |
| Partner revenue share @ 15%            |                |          | -$29,153       |
| Snapshot delivery cost @ $20/snapshot  | 80             |          | -$1,600        |
| **Net to Acumen**                      |                |          | **~$163,597**  |

If retainer conversion is only 2% (more conservative) instead of 5%:
- Retainer revenue: 1.6 retainers × $4k × 12 = $76,800
- Net to Acumen: ~$65,000

Even in the conservative case, ONE Tier 2 partnership is a 6-figure
12-month revenue line. **This is the real reason partnerships are the
top channel.**
