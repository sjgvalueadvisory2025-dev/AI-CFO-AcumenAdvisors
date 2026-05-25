const Razorpay = require('razorpay');

const SERVICE_PRICES = {
  'deep-dive':    34900,  // $349.00 in cents
  'founder-call': 59900,  // $599.00 in cents
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ ok: false, error: 'Payment not configured.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const service = (body.service || '').toString();
  if (!SERVICE_PRICES[service]) {
    return res.status(400).json({ ok: false, error: 'Unknown service tier.' });
  }

  const razorpay = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });

  try {
    const order = await razorpay.orders.create({
      amount: SERVICE_PRICES[service],
      currency: 'USD',
      receipt: `acumen_${service}_${Date.now()}`,
    });

    return res.status(200).json({
      ok: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('razorpay order error:', err);
    return res.status(502).json({ ok: false, error: 'Could not initiate payment. Please try again.' });
  }
};
