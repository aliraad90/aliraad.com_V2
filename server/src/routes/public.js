import express from 'express';
import nodemailer from 'nodemailer';
import { Plan } from '../models/plan.js';

let stripe = null;
try {
  if (process.env.STRIPE_SECRET) {
    // Lazy import to avoid requiring stripe if not configured
    const stripeLib = (await import('stripe')).default;
    stripe = new stripeLib(process.env.STRIPE_SECRET);
  }
} catch {}

const router = express.Router();

// List active plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find({ active: true }).sort({ priceMonthly: 1 }).lean();
    res.json(plans.map(p => ({
      id: String(p._id),
      name: p.name,
      description: p.description || '',
      priceMonthly: p.priceMonthly,
      currency: p.currency || 'usd',
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create checkout session (Stripe) or mock URL if not configured
router.post('/checkout', async (req, res) => {
  const { planId, email } = req.body || {};
  if (!planId) return res.status(400).json({ error: 'Missing planId' });
  try {
    const plan = await Plan.findById(planId).lean();
    if (!plan || !plan.active) return res.status(404).json({ error: 'Plan not found' });

    const successUrl = process.env.STRIPE_SUCCESS_URL || 'http://localhost:5173/success';
    const cancelUrl = process.env.STRIPE_CANCEL_URL || 'http://localhost:5173/cancel';

    if (!stripe || !plan.stripePriceId) {
      // Mock flow: immediately return success URL
      return res.json({ url: successUrl + `?plan=${encodeURIComponent(String(plan._id))}` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
      customer_email: email,
      metadata: { planId: String(plan._id) },
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Contact endpoint — send email via SMTP (Nodemailer)
router.post('/contact', async (req, res) => {
  const { name, email, message, phone } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Missing fields' });
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_EMAIL, TO_EMAIL } = process.env;
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.log('CONTACT (no SMTP configured):', { name, email, phone, message });
      return res.json({ ok: true, note: 'SMTP not configured on server' });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: String(SMTP_SECURE || 'false') === 'true',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      logger: true,
      debug: true,
    });

    try {
      await transporter.verify();
      console.log('SMTP verify OK');
    } catch (verr) {
      console.error('SMTP verify failed:', verr?.message || verr);
      return res.status(500).json({ error: `SMTP verify failed: ${verr?.message || verr}` });
    }

    const info = await transporter.sendMail({
      from: FROM_EMAIL || SMTP_USER,
      to: TO_EMAIL || SMTP_USER,
      subject: `New contact from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}${phone ? `\nPhone: ${phone}` : ''}\n\n${message}`,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>${phone ? `<p><b>Phone:</b> ${phone}</p>` : ''}<p>${message.replace(/\n/g, '<br/>')}</p>`,
    });
    console.log('SMTP send result:', {
      messageId: info?.messageId,
      accepted: info?.accepted,
      rejected: info?.rejected,
      response: info?.response,
    });
    res.json({ ok: true, messageId: info.messageId, accepted: info.accepted, rejected: info.rejected });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
