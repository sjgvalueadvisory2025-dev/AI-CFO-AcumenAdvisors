# Acumen Advisors — AI-CFO

Static landing site (`index.html` + 3 form pages) plus two Vercel serverless
endpoints that:

1. Email a 6-digit verification code to the founder via **Resend** (`/api/send-otp`).
2. Email the full submission **with all uploaded files attached** to your
   inbox via Resend (`/api/submit`). The service tier is included in both
   the email subject (`[AI-CFO Snapshot]`, `[AI-CFO Deep Dive]`, or
   `[AI-CFO Founder Call]`) and a custom `X-AI-CFO-Service` header so you
   always know which of the three the founder selected.

---

## Folder structure

```
.
├── index.html              # landing page (links to the 3 form pages)
├── snapshot.html           # AI-CFO Snapshot (Tier I)   — data-service="snapshot"
├── deep-dive.html          # AI-CFO Deep Dive (Tier II) — data-service="deep-dive"
├── founder-call.html       # AI-CFO Founder Call (III)  — data-service="founder-call"
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

| Name             | Required | Example                                            |
|------------------|----------|----------------------------------------------------|
| `RESEND_API_KEY` | yes      | `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`              |
| `TO_EMAIL`       | yes      | `global.acumenadvisors@gmail.com`                  |
| `FROM_EMAIL`     | yes      | `Acumen Advisors <onboarding@resend.dev>`          |
| `OTP_SECRET`     | yes      | a random 64-char hex string (see below)            |

Generate a strong `OTP_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> `onboarding@resend.dev` works immediately with any Resend API key.
> Once you verify a domain in Resend (recommended for production deliverability),
> change `FROM_EMAIL` to e.g. `Acumen Advisors <ai-cfo@yourdomain.com>`.

---

## Deployment to Vercel via GitHub

1. **Push to GitHub.**
   ```bash
   git init
   git add .
   git commit -m "Initial AI-CFO site + Resend API"
   git branch -M main
   git remote add origin git@github.com:<you>/<repo>.git
   git push -u origin main
   ```

2. **Create the Resend API key** at <https://resend.com/api-keys>. Copy it.

3. **Import the repo on Vercel**: <https://vercel.com/new>
   - Framework preset: **Other** (Vercel will auto-detect static + `/api`).
   - Root directory: leave as repo root.
   - Build command: leave empty.
   - Output directory: leave empty.

4. **Add the environment variables** under
   *Settings → Environment Variables* (mark them for Production, Preview, and
   Development if you'll use `vercel dev`):
   - `RESEND_API_KEY`
   - `TO_EMAIL=global.acumenadvisors@gmail.com`
   - `FROM_EMAIL=Acumen Advisors <onboarding@resend.dev>`
   - `OTP_SECRET=<the random hex you generated>`

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

**Subject:** `[AI-CFO Snapshot] New request — Northwind Logistics, Inc.`
(prefix is one of `[AI-CFO Snapshot]`, `[AI-CFO Deep Dive]`, `[AI-CFO Founder Call]`)

**Body** includes the founder, company, website, verified email, business
description, a list of attached files with sizes, and the timestamp.
Replying to the email replies to the **founder's verified email address**
(set via `reply_to`).

**Headers** include `X-AI-CFO-Service: snapshot|deep-dive|founder-call` so you
can build a Gmail filter per tier if you want.

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

---

## Where the three services link from the landing page

`index.html` already links each service card to the matching form page:

| Card                  | href                |
|-----------------------|---------------------|
| AI-CFO Snapshot       | `snapshot.html`     |
| AI-CFO Deep Dive      | `deep-dive.html`    |
| AI-CFO Founder Call   | `founder-call.html` |

Each form page declares `data-service="..."` on its `<form>`, so `forms.js`
sends the right tier to the API automatically.
