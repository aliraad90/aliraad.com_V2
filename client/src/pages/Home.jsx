import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadContent } from '../utils/content.js';

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [homeData, setHomeData] = useState(null);
  const photoCandidates = ['/photo.jpg.png', '/photo.jpg', '/photo.jpeg', '/photo.png', '/photo.JPG', '/photo.PNG'];
  const [photoIdx, setPhotoIdx] = useState(0);
  const cacheBust = '?v=1';
  const photoSrc = photoCandidates[photoIdx] || null;
  const onPhotoError = () => {
    setPhotoIdx((i) => (i + 1 < photoCandidates.length ? i + 1 : photoCandidates.length));
  };
  const toggleFaq = (i) => setOpenFaq((prev) => (prev === i ? null : i));
  useEffect(() => {
    (async () => {
      try {
        const data = await loadContent('home.json');
        setHomeData(data);
      } catch (e) {
        setHomeData(null);
      }
    })();
  }, []);
  return (
    <div className="stack" style={{ padding: '24px 0' }}>
      {/* HERO */}
      <section className="card" style={{ padding: 24, overflow: 'hidden' }}>
        <div className="row" style={{ alignItems: 'center', gap: 24 }}>
          <div className="stack" style={{ flex: 1, gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, Inter, sans-serif', fontWeight: 700, letterSpacing: '.3px' }}>ALI RAAD HUSSEIN</div>
              <div className="muted" style={{ fontSize: 12 }}>Network Engineering · Cybersecurity · Digitalization</div>
            </div>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px, 3vw, 40px)' }}>{homeData?.heroTitle || 'Freelancer IT & Networking Services'}</h1>
            <div className="section-subtitle" style={{ margin: 0 }}>{homeData?.heroSubtitle || 'IT Freelancer | Senior Network & System Engineer | PMP'}</div>
            <p className="muted" style={{ margin: 0, maxWidth: 760 }}>
              {homeData?.heroSummary || '12+ years across Siemens Energy and leading enterprises. I design resilient networks, administer systems, secure infrastructure, and lead projects end‑to‑end. Certified PMP, CCNP/CCNA, MCSA/MCSE, MTCNA/MTCRE.'}
            </p>
            <div className="row" style={{ gap: 12, marginTop: 8 }}>
              <a
                href="https://wa.me/9647835949338?text=Hi%20Ali%2C%20I%27d%20like%20to%20discuss%20IT%20services."
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                aria-label="Chat on WhatsApp"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.77 11.77 0 0 0 12.03 0C5.45 0 .12 5.33.12 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.29-1.64a12 12 0 0 0 5.74 1.46h.01c6.58 0 11.91-5.33 11.91-11.9a11.77 11.77 0 0 0-3.43-8.44ZM12.04 21.1h-.01a9.2 9.2 0 0 1-4.7-1.29l-.34-.2-3.73.97 1-3.64-.22-.37a9.14 9.14 0 0 1-1.38-4.82c0-5.06 4.12-9.18 9.2-9.18 2.46 0 4.77.96 6.52 2.7a9.16 9.16 0 0 1 2.69 6.5c0 5.05-4.13 9.18-9.2 9.18Zm5.07-6.87c-.28-.14-1.64-.81-1.89-.9-.25-.1-.43-.14-.62.14-.18.27-.72.89-.89 1.07-.16.18-.33.2-.61.07-.28-.14-1.17-.43-2.23-1.36-.82-.73-1.37-1.62-1.53-1.9-.16-.27-.02-.42.12-.56.12-.12.28-.33.42-.5.14-.17.18-.29.28-.48.1-.2.05-.36-.02-.5-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47l-.53-.01c-.2 0-.5.07-.76.36-.26.28-.98.96-.98 2.33 0 1.37 1 .67 1.14.95.14.27.3.54.52.82.16.2.34.43.46.57.14.17.02.38-.09.52-.12.14-.26.32-.39.51-.12.2-.26.41-.11.68.14.27.64 1.58 1.5 2.23 1.05.78 1.88 1.03 2.4 1.15.25.05.47.05.65.03.2-.03.64-.26.73-.52.09-.27.09-.5.06-.55-.03-.05-.11-.08-.24-.14Z"/>
                </svg>
                WhatsApp
              </a>
              <Link to="/contact" className="btn">Hire Me</Link>
              <Link to="/services" className="btn">View Services</Link>
              <Link to="/portfolio" className="btn">Portfolio</Link>
            </div>
          </div>
          <div style={{ flex: 1, borderLeft: '1px solid var(--color-border)', minHeight: 220, display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, rgba(123,161,58,0.22), rgba(11,31,58,0.22))' }}>
            {photoSrc ? (
              <img src={`${photoSrc}${cacheBust}`} onError={onPhotoError} alt="Ali Raad Hussein" style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />
            ) : (
              <div style={{ width: 180, height: 180, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontFamily: 'Sora, Inter, sans-serif', fontWeight: 700, fontSize: 36, letterSpacing: '.5px' }}>AR</div>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* VALUE PILLARS */}
      <section className="grid grid-3" style={{ marginTop: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="section-title">Resilient Networking</div>
          <p className="muted">High-availability topologies, automation, and policy-based access for teams.</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="section-title">Security by Design</div>
          <p className="muted">Hardening, monitoring, least privilege, and auditable workflows.</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div className="section-title">Business Alignment</div>
          <p className="muted">PMP-led execution that connects technical outcomes to business value.</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="card" style={{ padding: 20, marginTop: 16 }}>
        <div className="grid grid-3">
          <div className="stack">
            <div className="section-title">Company Management</div>
            <div className="feature-list">
              <div className="item"><span>•</span><span>Onboard orgs, assign plans</span></div>
              <div className="item"><span>•</span><span>Enable/disable access</span></div>
              <div className="item"><span>•</span><span>Expiry & lifecycle controls</span></div>
            </div>
          </div>
          <div className="stack">
            <div className="section-title">One‑Click Config</div>
            <div className="feature-list">
              <div className="item"><span>•</span><span>Auto-generate MikroTik/Cisco configs (VPN, firewall, QoS)</span></div>
              <div className="item"><span>•</span><span>One-click VPN profiles for Windows, iOS/macOS, Android</span></div>
              <div className="item"><span>•</span><span>Secure defaults: MFA, least privilege, logging/monitoring</span></div>
            </div>
          </div>
          <div className="stack">
            <div className="section-title">Real‑Time Status</div>
            <div className="feature-list">
              <div className="item"><span>•</span><span>Active clients dashboard</span></div>
              <div className="item"><span>•</span><span>Policy enforcement</span></div>
              <div className="item"><span>•</span><span>Health checks & alerts</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section className="metrics" style={{ marginTop: 16 }}>
        {(homeData?.metrics || [
          { value: '38%', label: 'Downtime Reduction' },
          { value: '200+ Users', label: 'Migrated to Azure AD' },
          { value: '5–30', label: 'Team Members Led' }
        ]).map((m, i) => (
          <div key={i} className="metric">
            <div className="h2" style={{ fontWeight: 700, fontSize: 24 }}>{m.value}</div>
            <div className="section-subtitle">{m.label}</div>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="card" style={{ padding: 16, marginTop: 16 }}>
        <div className="section-title">FAQ</div>
        <div className="faq" style={{ marginTop: 8 }}>
          {(homeData?.faq || []).map((item, i) => (
            <div key={i} className={`faq-item ${openFaq===i?'open':''}`}>
              <div className="faq-q" onClick={()=>toggleFaq(i)}>
                <span>{item.q}</span>
                <span className="muted">{openFaq===i?'-':'+'}</span>
              </div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card" style={{ padding: 24, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="stack" style={{ gap: 6 }}>
          <div className="section-title">Ready to start your project?</div>
          <div className="muted">Book a call or send your requirements - I’ll propose a clear plan and timeline.</div>
          <div className="muted" style={{ fontSize: 13 }}>Discovery/consultation call is paid: <strong>$50</strong> for <strong>30 minutes</strong>.</div>
          <div className="muted" style={{ fontSize: 12 }}>Paid call fee is credited toward projects over <strong>$500</strong>.</div>
        </div>
        <div className="row" style={{ gap: 10, flexWrap: 'wrap' }}>
          <Link to="/contact?topic=intro-call" className="btn">Free Intro Call (10–15 min)</Link>
          <Link to="/contact?topic=book-call-30" className="btn btn-primary">Book a Call ($50 / 30 min)</Link>
          <Link to="/contact" className="btn">Contact</Link>
          <Link to="/pricing" className="btn">View Rates</Link>
        </div>
      </section>
    </div>
  );
}
