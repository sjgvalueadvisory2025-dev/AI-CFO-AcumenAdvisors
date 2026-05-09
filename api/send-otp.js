/* ============================================================
   POST /api/send-otp
   Generates a 6-digit OTP, emails it to the user via Resend,
   and returns a stateless HMAC-signed token the client sends
   back with the form submission. No database needed.
   ============================================================ */

const crypto = require('crypto');
const { Resend } = require('resend');

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

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

  const { RESEND_API_KEY, FROM_EMAIL, OTP_SECRET } = process.env;
  if (!RESEND_API_KEY || !FROM_EMAIL || !OTP_SECRET) {
    return res.status(500).json({
      ok: false,
      error: 'Server misconfigured. Missing RESEND_API_KEY, FROM_EMAIL, or OTP_SECRET.',
    });
  }

  // Parse JSON body (Vercel usually parses it; handle both cases).
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

  // 6-digit OTP
  const otp = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
  const expires = Date.now() + OTP_TTL_MS;

  // Stateless token: signature over (email | otp | expires).
  // The client never sees the token's plaintext components beyond `expires`.
  const token = sign(`${email}|${otp}|${expires}`, OTP_SECRET);

  const resend = new Resend(RESEND_API_KEY);

  const tierLabel = ({
    'snapshot': 'AI-CFO Snapshot',
    'deep-dive': 'AI-CFO Deep Dive',
    'founder-call': 'AI-CFO Founder Call',
  })[service] || 'AI-CFO';

  const subject = `Your verification code: ${otp}`;
  const text = [
    `Your Acumen Advisors verification code is: ${otp}`,
    ``,
    `It expires in 10 minutes. Enter it on the ${tierLabel} request page to submit your details.`,
    ``,
    `If you did not request this, you can safely ignore this email.`,
    ``,
    `— Acumen Advisors`,
  ].join('\n');

  const html = `
    <div style="font-family: 'Inter', -apple-system, Segoe UI, Roboto, sans-serif; color:#1a1a1a; max-width:520px; margin:0 auto; padding:24px;">
      <div style="font-size:11px; letter-spacing:0.18em; text-transform:uppercase; color:#7a7568;">Acumen Advisors</div>
      <h1 style="font-size:22px; margin:8px 0 4px; font-weight:600;">Verify your email</h1>
      <p style="color:#555; font-size:14px; line-height:1.55; margin:0 0 18px;">
        Use the code below to confirm your email and submit your <strong>${escapeHtml(tierLabel)}</strong> request.
      </p>
      <div style="background:#f7f4ed; border:1px solid #e6e0cf; padding:18px 20px; text-align:center; border-radius:6px; margin:18px 0;">
        <div style="font-family: 'Courier New', monospace; font-size:30px; letter-spacing:10px; font-weight:700; color:#1a1a1a;">
          ${escapeHtml(otp)}
        </div>
        <div style="font-size:11px; color:#7a7568; margin-top:8px; letter-spacing:0.12em; text-transform:uppercase;">
          Expires in 10 minutes
        </div>
      </div>
      <p style="color:#7a7568; font-size:12px; line-height:1.5;">
        If you didn't request this, you can ignore this message.
      </p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error('Resend send-otp error:', error);
      return res.status(502).json({ ok: false, error: 'Failed to send verification email.' });
    }
  } catch (err) {
    console.error('send-otp exception:', err);
    return res.status(502).json({ ok: false, error: 'Failed to send verification email.' });
  }

  // Return token + expires; client holds these and sends back at submit time.
  return res.status(200).json({
    ok: true,
    token,
    expires,
    ttlSeconds: Math.floor(OTP_TTL_MS / 1000),
  });
};
