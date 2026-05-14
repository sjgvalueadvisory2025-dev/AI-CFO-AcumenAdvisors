# Outreach Playbook — Closing 10 Paying Clients in 30 Days

> Paid = either Deep Dive ($99) or Founder Call ($349). The strategic intent
> is to convert ~30–40% of those 10 into ongoing fractional-CFO retainers
> later, but that's out of scope for this 30-day push.

---

## 0. The Funnel Math (so the targets are real)

Assumed conservative conversion rates for cold outreach to first-time founders:

| Stage                                  | Rate (cold)  | Rate (warm/intro) |
|----------------------------------------|--------------|-------------------|
| Cold touch → opened/seen               | 60%          | 95%               |
| Seen → replied or engaged              | 8%           | 35%               |
| Engaged → free Snapshot submitted      | 35%          | 60%               |
| Snapshot → paid (Deep Dive or Founder Call) | 18%      | 30%               |

**To produce 10 paid customers, plan for ~160 Snapshots, ~460 engaged
conversations, ~5,800 prospect touches.** That requires a **multi-channel**
push, not just cold email.

Channel mix targeting 10 paid in 30 days:

| Channel                                    | Touches | Expected paid |
|--------------------------------------------|---------|---------------|
| 1. Cold email to named prospects (Apollo + manual) | 1,200 | 3–4           |
| 2. LinkedIn DM to named founders           | 600     | 2–3           |
| 3. X/Twitter reply-guy + DM                | 300     | 1–2           |
| 4. Accelerator alumni-channel partnerships | 6 deals | 2–3           |
| 5. Founder-community posts (Indie Hackers, r/startups, Slack groups) | 12 posts | 1–2 |
| 6. Inbound from organic LinkedIn + X founder content | 20 posts | 1–2 |
| 7. Bookkeeper / accountant referral asks   | 25 firms| 1–2           |
| **Total**                                  |         | **11–18 paid** |

We over-build to 11–18 to give margin for under-performance on any one channel.

---

## 1. Channel-by-channel plays

### 1A. Cold email — the workhorse

**Stack:**
- List source: Apollo.io (or Lusha, Hunter, Findymail) + manual enrichment for
  YC W26/S25 founders (YC publishes founder emails publicly on their company
  pages)
- Sender: a **founder's** personal address (Sandeep, Jeet — whoever is the
  most credible operator). Do **not** send from `global.acumenadvisors@gmail.com`
  for cold outreach — too generic.
- Volume cap: 50/day/sender (Gmail deliverability ceiling), use 2 senders → 100/day
- Domain: warm a secondary `acumenadvisors.co` or `.io` domain for 2 weeks
  before scaling cold sending, to protect the primary
- Tool: Instantly.ai or Smartlead for sequencing + warmup

**Sequence: 4 emails over 11 days**

**Email 1 — Day 0 — Specific hook**
```
Subject: {firstName}, congrats on the {round} — quick Q on your model

Hey {firstName},

Saw {company} closed your {pre-seed | seed | $XM} {timeframe — last week,
this month}. Congrats — that's a real milestone.

Quick question: have you locked your 18-month financial model yet, or is it
still a "fill in when an investor asks" situation?

We run a free 24-hour CFO-reviewed Snapshot for founders in your exact spot —
real runway number, top 3 cash leaks, and the three things to fix first. No
deck, no call, no card.

Worth a look? Here's where you start:
https://acumenadvisors-ai-cfo.vercel.app/snapshot.html

— {senderFirstName}
{senderTitle}, Acumen Advisors
```

**Email 2 — Day 3 — Reframe (no reply)**
```
Subject: re: {firstName}, congrats on the {round}

Hey {firstName},

Following up. I realised the last note didn't say *why* the Snapshot is free.

It's the wedge for our paid Deep Dive ($99) — most founders who try the free
version come back for the paid one within a week. We'd rather earn that than
sell it.

If a 24-hour CFO-reviewed read on your numbers would be useful before your
next board update / investor convo / hiring decision, the link's below.

https://acumenadvisors-ai-cfo.vercel.app/snapshot.html

— {senderFirstName}
```

**Email 3 — Day 7 — Pattern interrupt + specific objection demolish**
```
Subject: 3 things every {YC | Antler | seed} founder gets wrong about runway

Hey {firstName},

Three things first-time founders almost always miscalculate (this is from
~60 Snapshots last quarter):

1. You're counting committed payroll as "future spend" — it's already
   committed cash. Real runway is 1–3 months shorter than your spreadsheet.

2. You're conflating gross margin with contribution margin. The customers
   you call "biggest" are sometimes your worst.

3. Your AWS / OpenAI bill scaled with usage 2 months ago — but you still
   model it linearly. It's not linear.

If any of that twitches, the free Snapshot will tell you exactly which
one applies to {company}.

https://acumenadvisors-ai-cfo.vercel.app/snapshot.html

— {senderFirstName}
```

**Email 4 — Day 11 — Break-up**
```
Subject: closing the loop

Hey {firstName},

Last note from me. If finance clarity isn't the priority right now, totally
fair — file this for when you start prepping for the next round.

If it ever flips, the Snapshot is free, the Deep Dive is $99, and the
turnaround is 24 hours.

Best with {company}.

— {senderFirstName}
```

**Personalisation lines** (must include at least one):
- "Saw your launch on YC's site — the X angle is sharp"
- "Read the Inc42 piece — congrats on the {round}"
- "{co-founder}'s thread on X about Y caught my eye"
- "You're hiring a {role} — that adds {X}/mo to burn, which is the kind of thing the Snapshot will model out for you"

### 1B. LinkedIn DM

LinkedIn outperforms email for founders < $5M raised. Most founders read
DMs same-day.

**Connection request note (300 chars max):**
```
Hi {firstName} — saw {company} closed the {round}. We run a free 24-hr
CFO-reviewed financial Snapshot for founders in your exact spot. Happy
to send the link if useful — no pitch.
```

**Once connected — DM 1:**
```
{firstName}, thanks for connecting.

Quick context: I'm one of the founders of Acumen Advisors. We built an
AI-CFO product specifically for first-time founders pre-Series A — every
report is reviewed and signed off by a senior CFO before it reaches you.

The free Snapshot gives you a real runway number, your top 3 cash leaks,
and the three things to fix first. 24 hours, no card.

Here's the link if it's useful: {url}

If not, no follow-up.
```

**DM 2 (Day 5, no reply):**
Send a 30-second Loom: "Hi {firstName}, recorded this in 30 seconds — here's
what the Deep Dive output looks like for a founder at your stage." Loom link.

### 1C. X/Twitter — reply-guy + DM

**Daily routine (30 min/day):**
1. Open advanced search: `("just raised" OR "we raised" OR "closed our pre-seed" OR "closed our seed") (from:[founder] OR to:[VC])` filtered to last 24 hours
2. Reply publicly to ~10 founders with a useful one-liner + soft offer
3. DM 3–5 of the most-likely-to-convert with the Snapshot link

**Reply template:**
> Congrats {firstName}! One question first-time founders almost always
> get wrong post-{round}: real runway is usually 1–3 months shorter than
> the spreadsheet says, because committed payroll isn't counted as
> already-committed cash. Free 24h Snapshot if useful: {url}

**DM template:**
> Hey {firstName} — congrats on the {round}. We run a free CFO-reviewed
> Snapshot for founders in your exact spot. 24-hour turnaround, no card,
> no call. Link → {url}. If not useful, ignore — won't follow up.

### 1D. Accelerator alumni-channel partnerships

This is the highest-leverage play. Get 3–5 partnership wins in week 1.

**Target list (priority order):**
1. **Antler India / Singapore** — propose: Acumen runs free Snapshots for every Antler portco; Antler gets to brag about a CFO benefit; Acumen gets 200+ warm intros
2. **Sequoia Surge** — propose: free Deep Dive for all Surge founders
3. **Accel Atoms India** — same
4. **Blume Ventures** — same
5. **Stellaris** — same
6. **3one4 Capital** — same
7. **Together Fund (SaaS-only)** — same
8. **500 Global** — same
9. **Techstars program directors (per program)** — direct DM
10. **On Deck Founder Fellowship** — DM cohort lead

**Outreach template — Partnership pitch:**
```
Subject: free CFO-reviewed Snapshot for every {Antler / Surge / Accel} portco

Hi {firstName},

I run Acumen Advisors. We've built an AI-CFO product specifically for
pre-Series A founders — every output reviewed and signed off by a senior
CFO, 24-hour turnaround.

Proposal: I'll run our $99 Deep Dive (real runway, unit economics,
investor-ready financial story) FREE for every {Antler India 25-26
cohort} founder for 60 days. No catch — your founders get a useful
artifact, and we get the chance to earn a few of them as paid customers
later.

What you'd need: a single email to your cohort with our link, or a
mention in your founder Slack.

Worth a 15-min call to sketch this?

— {senderFirstName}
{senderTitle}, Acumen Advisors
{calendly}
```

### 1E. Founder communities

Post a useful, NOT-salesy artifact in each:

| Community                       | Post format                                           |
|---------------------------------|-------------------------------------------------------|
| Indie Hackers                   | "The 3 numbers every bootstrapped founder gets wrong" |
| r/startups                      | Same, longer-form post                                |
| r/SaaS                          | Worked example: "Reviewed 12 SaaS P&Ls last month — here's what they all missed" |
| Hacker News (Show HN)           | Show HN: free AI-CFO Snapshot for first-time founders |
| Founder Slacks (RemoteFirst, MicroConf Connect, Trends.vc, On Deck, RevGenius) | Useful artifact + soft Snapshot link |
| LinkedIn (founder's personal)   | 3-post mini-series: 1) Why founders mis-calc runway 2) Sample Snapshot output 3) Why we built this |
| X / Twitter (founder's personal)| Same as LinkedIn, broken into threads                  |

**Rule:** Lead with the artifact (a screenshot of a Snapshot output, a
worked example, an anti-pattern list). Drop the link **once**, at the end.

### 1F. Bookkeeper / accountant referral channel

Bookkeepers serving startups get asked CFO-level questions weekly and have
nothing to offer. Acumen is their answer.

**Target firms:**
- Pilot.com competitors aimed at startups
- India: Volopay, EZSME, RazorpayX-recommended bookkeepers, ClearTax for SMEs
- Solo "fractional bookkeeper" LinkedIn profiles with 20+ startup clients

**Pitch (LinkedIn or email):**
```
Hi {firstName} — I run Acumen Advisors. We built an AI-CFO that answers
the kinds of questions your clients ask you that go beyond bookkeeping
("how long does my cash last", "should I raise now", "is this customer
profitable").

Proposal: when those questions come up, refer them to our free Snapshot
and we'll send back the report with you cc'd. You stay the trusted
advisor; your clients get answers; nobody pays for anything until they
choose to.

Open to a 15-min call?
```

### 1G. Organic content (founder's personal brand)

The two founders post **3× per week** on LinkedIn and X for 30 days:

**Content calendar:**

| Week | Theme                                          | Format                                |
|------|------------------------------------------------|---------------------------------------|
| 1    | "The 3 numbers every founder gets wrong"        | LinkedIn carousel + X thread          |
| 1    | "What an investor actually wants from a model"  | LinkedIn post + X thread              |
| 2    | "Anonymized Snapshot output — what we found"    | LinkedIn carousel of a real output    |
| 2    | "Why $99 not $5,000 for a financial review"     | LinkedIn post + X thread              |
| 3    | "Founder ran out of cash — here's the timeline" | LinkedIn long post                     |
| 3    | "What changes when you have 10 vs 30 people"    | LinkedIn carousel                     |
| 4    | "30 days, 100 Snapshots, here's what we learned"| Case-study LinkedIn post + Twitter thread |

Every post ends: "If you want a free CFO-reviewed Snapshot of *your*
numbers in 24 hours, link in bio / comments."

---

## 2. Qualifying questions (in the Snapshot form)

When a Snapshot is submitted, the founder uploads files. The current form
already collects enough. **But to make the close easier later**, in the
emailed report add a single follow-up question at the end:

> "On a scale of 1–5, how soon do you expect to raise / hire / re-price?
> (1 = next year, 5 = this month). Reply to this email."

A 4 or 5 → put them on the founder's personal calendar for a 15-min
"clarifying call" → that call is the Founder Call sales pitch.

A 1 or 2 → drop them in a monthly nurture sequence.

---

## 3. Pricing & offer tactics

Three time-boxed offers to deploy across the 30 days:

1. **"Snapshot week" (Week 1):** "I'm running 25 free Snapshots this week
   for {Antler / YC W26 / Surge} founders specifically." Creates artificial
   scarcity → boosts response rate.
2. **"Deep Dive for $49 (50% off)"** for the first 50 paying customers
   who came through a partnership channel. Use this to seal the partnership
   asks.
3. **"Founder Call bundle"** — Deep Dive + Founder Call at $349 total
   (saves $99). Pitch this to founders who reply with "I'm raising soon."

---

## 4. Tools needed (and rough monthly costs)

| Tool                  | Use                                | Cost     |
|-----------------------|------------------------------------|----------|
| Apollo.io basic       | Lead enrichment + sequencing       | $49/mo   |
| Smartlead or Instantly| Cold email infra + warmup          | $39/mo   |
| LinkedIn Sales Navigator | Founder filtering                | $99/mo   |
| Calendly              | Booking 15-min "clarifying calls"  | $10/mo   |
| Notion or Airtable    | Pipeline tracking                  | $0–$20/mo|
| Loom                  | Personalised video DMs             | $0       |
| Second domain         | acumenadvisors.co or similar       | $12/yr   |
| **Total**             |                                    | **~$220/mo** |

ROI math: $220/mo cost. 10 paid × $99 average = $990 in month-1 cash. Net
month-1 = +$770. **But** the real return is the ~2 retainers won in months
2–4 from this cohort, at $3–6k/mo each = **+$6–12k MRR by month 4.**

---

## 5. The closing motion (Snapshot → Paid)

This is where most cold-funnel revenue is lost. The Snapshot output email
must include:

1. **The real value** (runway, top 3 leaks, 3 fixes — already in your spec)
2. **One specific tease for Deep Dive:** "We spotted a possible margin
   issue on customer cohort X — the Deep Dive ($99) breaks this down
   customer-by-customer."
3. **A direct CTA:** big button to `/deep-dive.html`
4. **A direct calendar link** for the founder Call ($349) for the "ready
   to act now" buyers
5. **A "reply with 1–5" prompt** (see section 2)

If a founder doesn't convert in 7 days, send a follow-up: "Hey — anything
about the Snapshot that wasn't clear, or that you want us to dig into?"
This conversation is where the Deep Dive sells itself.
