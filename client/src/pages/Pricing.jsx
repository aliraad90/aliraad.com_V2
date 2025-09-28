import React from 'react';

export default function Pricing() {
  const tiers = [
    {
      name: 'Remote Support',
      rate: 40,
      currency: 'USD',
      details: ['Troubleshooting & fixes', 'Small changes, advice', 'Chat/Call/Remote session'],
      note: 'Min. 1 hour, then billed in 15‑minute increments',
    },
    {
      name: 'Consulting & Design',
      rate: 60,
      currency: 'USD',
      details: ['Network/system design', 'Security policies & reviews', 'Migration planning & guidance'],
      note: 'Scoping call included before engagement',
    },
    {
      name: 'On‑site / Project Lead',
      rate: 80,
      currency: 'USD',
      details: ['Hands‑on implementation', 'Team leadership (PMP)', 'Documentation & handover'],
      note: 'Travel/time expenses may apply for on‑site work',
    },
  ];

  return (
    <div className="stack" style={{ padding: '24px 0' }}>
      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Hourly Rates</div>
        <div className="muted">Global standard: billed by the hour, simple and transparent.</div>
        <div className="grid grid-3" style={{ marginTop: 12 }}>
          {tiers.map((t) => (
            <div key={t.name} className="card" style={{ padding: 16, display: 'grid', gap: 8 }}>
              <div className="h3" style={{ fontWeight: 700 }}>{t.name}</div>
              <div className="row" style={{ alignItems: 'baseline', gap: 6 }}>
                <div className="h2" style={{ fontWeight: 800 }}>${t.rate}</div>
                <div className="muted">/ {t.currency} / hour</div>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
                {t.details.map((d) => (<li key={d}>{d}</li>))}
              </ul>
              <div className="muted" style={{ fontSize: 12 }}>{t.note}</div>
              <div className="row" style={{ gap: 10 }}>
                <a href="/contact" className="btn btn-primary">Book a Call</a>
                <a href="mailto:aliraad90@gmail.com" className="btn">Email Me</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card" style={{ padding: 20 }}>
        <div className="section-title">Billing & Terms</div>
        <ul style={{ marginTop: 8, paddingLeft: 18, color: 'var(--color-text-muted)' }}>
          <li>Accepted payment methods: ZainCash, SuperQi. Bank transfer available on request.</li>
          <li>Accepted currencies: IQD. Invoices provided.</li>
          <li>Weekly timesheets for longer engagements. Project quotes available after scoping.</li>
        </ul>
      </section>
    </div>
  );
}
