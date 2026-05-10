/* ============================================================
   POST /api/submit
   Receives a multipart/form-data submission from one of the
   three AI-CFO request pages (snapshot, deep-dive, founder-call),
   verifies the email OTP via stateless HMAC token, and emails
   the submission + uploaded files to TO_EMAIL via Resend.
   ============================================================ */

const crypto = require('crypto');
const fs = require('fs');
const formidable = require('formidable');
const nodemailer = require('nodemailer');

// Disable Vercel/Next default body parsing so formidable can read the raw stream.
module.exports.config = {
  api: { bodyParser: false },
};

// Hard caps on the upload to stay within Vercel & Resend limits.
const MAX_FILES = 10;
const MAX_FILE_SIZE = 8 * 1024 * 1024;       // 8 MB per file
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;     // 25 MB combined

const SERVICE_LABELS = {
  'snapshot': 'AI-CFO Snapshot',
  'deep-dive': 'AI-CFO Deep Dive',
  'founder-call': 'AI-CFO Founder Call',
};

function isValidEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function timingSafeEqualHex(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function first(v) {
  // formidable v3 returns arrays for fields; collapse to single string.
  if (Array.isArray(v)) return v[0] ?? '';
  return v ?? '';
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFiles: MAX_FILES,
      maxFileSize: MAX_FILE_SIZE,
      maxTotalFileSize: MAX_TOTAL_SIZE,
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { GMAIL_USER, GMAIL_PASS, TO_EMAIL, OTP_SECRET } = process.env;
if (!GMAIL_USER || !GMAIL_PASS || !TO_EMAIL || !OTP_SECRET) {
    return res.status(500).json({
      ok: false,
      error: 'Server misconfigured. Missing RESEND_API_KEY, FROM_EMAIL, TO_EMAIL, or OTP_SECRET.',
    });
  }

  // ───── 1. Parse multipart body ─────
  let parsed;
  try {
    parsed = await parseForm(req);
  } catch (err) {
    console.error('formidable parse error:', err);
    const msg = (err && err.code === 1009)
      ? 'Files exceed the 25 MB combined upload limit.'
      : 'Could not read your submission. Please try again.';
    return res.status(400).json({ ok: false, error: msg });
  }
  const { fields, files } = parsed;

  // ───── 2. Pull and validate fields ─────
  const service     = first(fields.service).toString();
  const company     = first(fields.company).toString().trim();
  const founder     = first(fields.founder).toString().trim();
  const website     = first(fields.website).toString().trim();
  const description = first(fields.description).toString().trim();
  const email       = first(fields.email).toString().trim().toLowerCase();
  const otp         = first(fields.otp).toString().trim();
  const otpToken    = first(fields.otpToken).toString().trim();
  const otpExpires  = parseInt(first(fields.otpExpires), 10);
  const consent     = first(fields.consent).toString();

  if (!SERVICE_LABELS[service]) {
    return res.status(400).json({ ok: false, error: 'Unknown service tier.' });
  }
  if (!company || !founder || !website || !description) {
    return res.status(400).json({ ok: false, error: 'Please complete all required fields.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Invalid email address.' });
  }
  if (consent !== 'true' && consent !== 'on') {
    return res.status(400).json({ ok: false, error: 'You must confirm the consent checkbox.' });
  }

  // ───── 3. Verify OTP token (stateless HMAC) ─────
  if (!/^\d{6}$/.test(otp) || !otpToken || !otpExpires) {
    return res.status(400).json({ ok: false, error: 'Email verification missing or invalid.' });
  }
  if (Date.now() > otpExpires) {
    return res.status(400).json({ ok: false, error: 'Your verification code expired. Please request a new one.' });
  }
  const expectedToken = sign(`${email}|${otp}|${otpExpires}`, OTP_SECRET);
  if (!timingSafeEqualHex(expectedToken, otpToken)) {
    return res.status(400).json({ ok: false, error: 'The verification code is incorrect.' });
  }

  // ───── 4. Collect file attachments ─────
  const rawFiles = [];
  const filesField = files.files;
  if (filesField) {
    if (Array.isArray(filesField)) rawFiles.push(...filesField);
    else rawFiles.push(filesField);
  }

  const attachments = [];
  let totalBytes = 0;
  for (const f of rawFiles) {
    if (!f || !f.filepath) continue;
    try {
      const buf = fs.readFileSync(f.filepath);
      totalBytes += buf.length;
      if (totalBytes > MAX_TOTAL_SIZE) {
        return res.status(400).json({ ok: false, error: 'Files exceed the 25 MB combined upload limit.' });
      }
      attachments.push({
        filename: f.originalFilename || 'upload.bin',
        content: buf,
      });
    } catch (err) {
      console.error('read upload error:', err);
    }
  }

  // ───── 5. Build the email ─────
  const tierLabel = SERVICE_LABELS[service];
  const subject = `[${tierLabel}] New request — ${company}`;

  const fileSummary = attachments.length
    ? attachments.map((a) => `• ${a.filename} (${(a.content.length / 1024).toFixed(1)} KB)`).join('\n')
    : '(no files attached)';

  const text = [
    `=== ${tierLabel} — new client submission ===`,
    ``,
    `Service tier:   ${tierLabel}`,
    `Company:        ${company}`,
    `Founder / CEO:  ${founder}`,
    `Website:        ${website}`,
    `Email:          ${email}`,
    ``,
    `Business description:`,
    description,
    ``,
    `Attached files (${attachments.length}):`,
    fileSummary,
    ``,
    `Submitted at:   ${new Date().toISOString()}`,
    `———`,
    `Acumen Advisors · AI-CFO intake`,
  ].join('\n');

  const html = `
    <div style="font-family:'Inter',-apple-system,Segoe UI,Roboto,sans-serif; color:#1a1a1a; max-width:640px; margin:0 auto; padding:24px;">
      <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#7a7568;">Acumen Advisors · AI-CFO Intake</div>
      <h1 style="font-size:22px; margin:6px 0 16px; font-weight:600;">${escapeHtml(tierLabel)} — new request</h1>

      <table style="width:100%; border-collapse:collapse; font-size:14px; margin-bottom:18px;">
        <tr><td style="padding:8px 0; color:#7a7568; width:160px;">Service tier</td><td style="padding:8px 0;"><strong>${escapeHtml(tierLabel)}</strong></td></tr>
        <tr><td style="padding:8px 0; color:#7a7568;">Company</td><td style="padding:8px 0;">${escapeHtml(company)}</td></tr>
        <tr><td style="padding:8px 0; color:#7a7568;">Founder / CEO</td><td style="padding:8px 0;">${escapeHtml(founder)}</td></tr>
        <tr><td style="padding:8px 0; color:#7a7568;">Website</td><td style="padding:8px 0;"><a href="${escapeHtml(website)}" style="color:#1a1a1a;">${escapeHtml(website)}</a></td></tr>
        <tr><td style="padding:8px 0; color:#7a7568;">Email (verified)</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#1a1a1a;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:8px 0; color:#7a7568; vertical-align:top;">Description</td><td style="padding:8px 0; white-space:pre-wrap; line-height:1.55;">${escapeHtml(description)}</td></tr>
      </table>

      <div style="background:#f7f4ed; border:1px solid #e6e0cf; padding:14px 18px; border-radius:6px; font-size:13px; line-height:1.6;">
        <strong>Attached files (${attachments.length}):</strong><br>
        ${attachments.length
          ? attachments.map((a) => `${escapeHtml(a.filename)} <span style="color:#7a7568;">(${(a.content.length / 1024).toFixed(1)} KB)</span>`).join('<br>')
          : '<span style="color:#7a7568;">(no files attached)</span>'}
      </div>

      <p style="color:#7a7568; font-size:12px; margin-top:18px;">
        Submitted ${escapeHtml(new Date().toISOString())} · Acumen Advisors AI-CFO intake
      </p>
    </div>
  `;

  // ───── 6. Send via Nodemailer ─────
  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
});

try {
  await transporter.sendMail({
    from: `Acumen Advisors <${process.env.GMAIL_USER}>`,
    to: process.env.TO_EMAIL,
    replyTo: email,
    subject,
    text,
    html,
    attachments: attachments.map((a) => ({
      filename: a.filename,
      content: a.content,
    })),
    headers: {
      'X-AI-CFO-Service': service,
      'X-AI-CFO-Company': company,
    },
  });
} catch (err) {
  console.error('submit error:', err);
  return res.status(502).json({ ok: false, error: 'Failed to deliver your submission. Please try again.' });
}

  return res.status(200).json({
    ok: true,
    service,
    serviceLabel: tierLabel,
    company,
    email,
    fileCount: attachments.length,
  });
};
