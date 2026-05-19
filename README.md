# Acumen Advisors — AI-CFO

Static landing site (`index.html` + supporting pages) plus two Vercel serverless
endpoints that:

1. Email a 6-digit verification code to the founder via **Gmail SMTP**
   (`/api/send-otp`), using Nodemailer.
2. Email the full submission **with all uploaded files attached** to your
   inbox via Gmail SMTP (`/api/submit`). The service tier is included in
   the email subject (`[AI-CFO Deep Dive]` or `[AI-CFO Founder Call]`) so
   you always know which one the founder selected. The founder's verified
   email is set as `reply-to`, so hitting "Reply" goes straight to them.

---

## Folder structure
```
.
├── index.html              # landing page (links to the form pages)
├── discovery-call.html     # free discovery-call booking page
├── plans.html              # full plan comparison page
├── deep-dive.html          # AI-CFO Deep Dive (Tier I)  — data-service="deep-dive"
├── founder-call.html       # AI-CFO Founder Call (II)   — data-service="founder-call"
├── styles.css
├── forms.js                # client-side OTP + submission logic
├── api/
│   ├── send-otp.js         # POST /api/send-otp  → emails 6-digit code, returns HMAC token
│   └── submit.js           # POST /api/submit    → verifies OTP, emails form + files
├── package.json
├── vercel.json
├── .env.example            # template for required env vars (do NOT commit .env)
└── .gitignore
```

The OTP flow is **stateless** — no database. The server signs a token over
`(email | otp | expiry)` with `OTP_SECRET` and returns it to the client; the
client sends the token + the user's typed code back at submit time, and the
server re-derives the HMAC to verify. Codes expire in 10 minutes.

---

## Environment variables

Set these in **Vercel → Project → Settings → Environment Variables** (and in
a local `.env.local` if you want to run `vercel dev`).

| Name          | Required | Example                                  |
|---------------|----------|------------------------------------------|
| `GMAIL_USER`  | yes      | `global.acumenadvisors@gmail.com`        |
| `GMAIL_PASS`  | yes      | `xxxx xxxx xxxx xxxx` (Gmail **App Password**, not your real password) |
| `TO_EMAIL`    | yes      | `global.acumenadvisors@gmail.com`        |
| `OTP_SECRET`  | yes      | a random 64-char hex string (see below)  |

Generate a strong `OTP_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Getting a Gmail App Password

Gmail no longer allows logging in with your real password from third-party
apps. You need to generate an **App Password**:

1. Make sure **2-Step Verification** is enabled on the Google account:
   <https://myaccount.google.com/security>
2. Visit <https://myaccount.google.com/apppasswords>.
3. Create an App Password (any name, e.g. "Acumen AI-CFO Vercel").
4. Google will show you a 16-character password like `abcd efgh ijkl mnop`.
   Copy it (spaces are fine — you can keep or remove them).
5. Paste that as `GMAIL_PASS` in Vercel.

> The `from` address on outgoing email is set to `Acumen Advisors <GMAIL_USER>`.
> So `GMAIL_USER` is both the SMTP login **and** the visible sender address.
> If you want to send from a custom domain, set up that domain in Gmail first
> (Gmail → Settings → Accounts → "Send mail as") and use the Gmail account
> that owns the alias.

---

## Deployment to Vercel via GitHub

1. **Push to GitHub.**
```bash
   git init
   git add .
   git commit -m "Initial AI-CFO site + Gmail API"
   git branch -M main
   git remote add origin git@github.com:<you>/<repo>.git
   git push -u origin main
```

2. **Generate a Gmail App Password** (see section above) and copy it.

3. **Import the repo on Vercel**: <https://vercel.com/new>
   - Framework preset: **Other** (Vercel will auto-detect static + `/api`).
   - Root directory: leave as repo root.
   - Build command: leave empty.
   - Output directory: leave empty.

4. **Add the environment variables** under
   *Settings → Environment Variables* (mark them for Production, Preview,
   and Development if you'll use `vercel dev`):
   - `GMAIL_USER`
   - `GMAIL_PASS`
   - `TO_EMAIL`
   - `OTP_SECRET`

5. **Deploy.** First push creates the first Production deployment;
   every subsequent `git push` to `main` redeploys automatically.

---

## Local development

```bash
npm install
npx vercel dev
```

Copy `.env.example` to `.env.local` and fill in real values. Then visit
`http://localhost:3000`.

---

## Email format you'll receive

**Subject:** `[AI-CFO Deep Dive] New request — Northwind Logistics, Inc.`
(prefix is one of `[AI-CFO Deep Dive]`, `[AI-CFO Founder Call]`)

**Body** includes the founder, company, website, verified email, business
description, a list of attached files with sizes, and the submission timestamp.
Hitting "Reply" replies to the **founder's verified email address** (set via
`replyTo`), so you don't accidentally reply to yourself.

**Attachments:** every file the founder uploaded is attached to the email.

---

## Limits

- **10 files max** per submission (enforced both client- and server-side).
- **8 MB per file**, **25 MB combined** (server-side).
- **OTP expires in 10 minutes.** A new "Send code" generates a fresh token.
- Vercel Hobby serverless functions have a request body cap of **~4.5 MB**.
  If you expect bigger uploads, upgrade to Vercel Pro (the function code already
  handles up to 25 MB) or switch to a direct-to-storage upload pattern
  (Vercel Blob / S3 presigned URL).
- Gmail SMTP has a **daily sending limit of ~500 emails/day** for free
  accounts and **~2,000/day** for Google Workspace accounts. If you outgrow
  this, switch the transport in `api/send-otp.js` and `api/submit.js` to a
  dedicated email provider (Resend, Postmark, SendGrid).

---

## Where the services link from the landing page

`index.html` is a single-page experience with a 4-tab interactive section
(**Understand Your Finances**, **Plans & Pricing**, **What We Do**,
**Why You Can Trust This**) and CTAs that link out to the booking page and
the two service intake forms:

| CTA / Card             | href                  |
|------------------------|-----------------------|
| Book a Free Call       | `discovery-call.html` |
| AI-CFO Deep Dive       | `deep-dive.html`      |
| AI-CFO Founder Call    | `founder-call.html`   |

Each form page declares `data-service="..."` on its `<form>`, so `forms.js`
sends the right tier to the API automatically. The discovery-call page is a
booking page with no form submission.

---

## Troubleshooting

**Email never arrives / server returns "Server misconfigured".**
Check that all four env vars (`GMAIL_USER`, `GMAIL_PASS`, `TO_EMAIL`,
`OTP_SECRET`) are set in Vercel for the **Production** environment, then
redeploy. Vercel does not pick up new env vars on existing deployments —
you must trigger a new build.

**"Invalid login: 535-5.7.8 Username and Password not accepted".**
You're using your real Gmail password. You need an **App Password** (see
the Gmail App Password section above). 2-Step Verification must be enabled
on the Google account first.

**OTP says "incorrect" even when you typed the right code.**
The HMAC depends on `OTP_SECRET`. If you rotate `OTP_SECRET` between the
"send code" and "submit" steps, verification will fail. Make sure
`OTP_SECRET` is identical across Production, Preview, and Development.

**Founders aren't receiving the OTP email.**
The "from" address is `GMAIL_USER`. Personal Gmail addresses sometimes land
in Promotions or Spam. For better deliverability, use a Google Workspace
account with a custom domain (e.g. `noreply@acumenadvisors.com`) and set up
SPF + DKIM in Google Admin.lly.
