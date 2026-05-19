const crypto = require('crypto');
const nodemailer = require('nodemailer');

const OTP_TTL_MS = 10 * 60 * 1000;

function isValidEmail(v) {
  return typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

function sign(payload, secret) {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { GMAIL_USER, GMAIL_PASS, OTP_SECRET } = process.env;
  if (!GMAIL_USER || !GMAIL_PASS || !OTP_SECRET) {
    return res.status(500).json({ ok: false, error: 'Server misconfigured.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const email = (body.email || '').trim().toLowerCase();
  const service = (body.service || 'unknown').toString();

  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: 'Please provide a valid email address.' });
  }

  const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  const expires = Date.now() + OTP_TTL_MS;
  const token = sign(`${email}|${otp}|${expires}`, OTP_SECRET);

  const tierLabel = ({
    'deep-dive': 'Acumen CFO Deep Dive',
    'founder-call': 'Acumen CFO Founder Call',
  })[service] || 'Acumen CFO';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });

  const html = `
    <div style="font-family:'Inter',-apple-system,sans-serif;color:#1a1a1a;max-width:520px;margin:0 auto;padding:24px;">
      <div style="font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#7a7568;">Acumen Advisors</div>
      <h1 style="font-size:22px;margin:8px 0 4px;font-weight:600;">Verify your email</h1>
      <p style="color:#555;font-size:14px;line-height:1.55;margin:0 0 18px;">
        Use the code below to confirm your email and submit your <strong>${escapeHtml(tierLabel)}</strong> request.
      </p>
      <div style="background:#f7f4ed;border:1px solid #e6e0cf;padding:18px 20px;text-align:center;border-radius:6px;margin:18px 0;">
        <div style="font-family:'Courier New',monospace;font-size:30px;letter-spacing:10px;font-weight:700;">
          ${escapeHtml(otp)}
        </div>
        <div style="font-size:11px;color:#7a7568;margin-top:8px;letter-spacing:0.12em;text-transform:uppercase;">
          Expires in 10 minutes
        </div>
      </div>
      <p style="color:#7a7568;font-size:12px;">If you didn't request this, you can ignore this message.</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `Acumen Advisors <${GMAIL_USER}>`,
      to: email,
      subject: `Your verification code: ${otp}`,
      html,
      text: `Your Acumen Advisors verification code is: ${otp}\n\nExpires in 10 minutes.\n\n— Acumen Advisors`,
    });
  } catch (err) {
    console.error('send-otp error:', err);
    return res.status(502).json({ ok: false, error: 'Failed to send verification email.' });
  }

  return res.status(200).json({
    ok: true,
    token,
    expires,
    ttlSeconds: Math.floor(OTP_TTL_MS / 1000),
  });
};
