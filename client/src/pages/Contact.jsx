import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sendContact } from '../publicApi.js';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const location = useLocation();

  // Prefill when coming from Book a Call CTA or Free Intro Call
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topic = params.get('topic');
    if (topic === 'book-call-30') {
      setMessage((prev) => prev && prev.length > 0 ? prev : 'I would like to book a 30-minute discovery call ($50).\n\nPreferred times (with timezone):\n- ...\n\nBrief context about my needs:\n- ...');
    } else if (topic === 'intro-call') {
      setMessage((prev) => prev && prev.length > 0 ? prev : 'I would like to schedule a free 10–15 minute intro call.\n\nPreferred times (with timezone):\n- ...\n\nBrief context about my needs:\n- ...');
    }
  }, [location.search]);

  async function submit(e) {
    e.preventDefault();
    setStatus('Sending...');
    try {
      await sendContact({ name, phone, email, message });
      setStatus('Thanks! We will contact you shortly.');
      setName(''); setPhone(''); setEmail(''); setMessage('');
    } catch (e) {
      setStatus(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h3>Contact</h3>
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="stack">
          {/* Paid call notice when applicable */}
          {(() => {
            const t = new URLSearchParams(location.search).get('topic');
            if (t === 'book-call-30') {
              return (
                <div className="row" style={{ gap: 8, alignItems: 'center', background: 'rgba(255,200,0,0.08)', border: '1px solid rgba(255,200,0,0.35)', padding: 8, borderRadius: 6 }}>
                  <div className="section-subtitle">Book a Call (30 min)</div>
                  <div className="muted">This discovery/consultation call is paid: <strong>$50</strong> for <strong>30 minutes</strong>. Fee is credited toward projects over <strong>$500</strong>.</div>
                </div>
              );
            }
            if (t === 'intro-call') {
              return (
                <div className="row" style={{ gap: 8, alignItems: 'center', background: 'rgba(120,200,255,0.08)', border: '1px solid rgba(120,200,255,0.35)', padding: 8, borderRadius: 6 }}>
                  <div className="section-subtitle">Free Intro Call (10–15 min)</div>
                  <div className="muted">A short introduction call to discuss fit and logistics. For deeper scoping, choose the paid 30‑minute call (credited toward projects over $500).</div>
                </div>
              );
            }
            return null;
          })()}
          <div className="row" style={{ gap: 12 }}>
            <div className="section-title">Direct</div>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="muted">Email:</div>
            <a href="mailto:aliraad90@gmail.com">aliraad90@gmail.com</a>
          </div>
          <div className="row" style={{ gap: 12, alignItems: 'center' }}>
            <div className="muted">WhatsApp:</div>
            <a className="btn" href="https://wa.me/9647835949338" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.52 3.48A11.77 11.77 0 0 0 12.03 0C5.45 0 .12 5.33.12 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.29-1.64a12 12 0 0 0 5.74 1.46h.01c6.58 0 11.91-5.33 11.91-11.9a11.77 11.77 0 0 0-3.43-8.44ZM12.04 21.1h-.01a9.2 9.2 0 0 1-4.7-1.29l-.34-.2-3.73.97 1-3.64-.22-.37a9.14 9.14 0 0 1-1.38-4.82c0-5.06 4.12-9.18 9.2-9.18 2.46 0 4.77.96 6.52 2.7a9.16 9.16 0 0 1 2.69 6.5c0 5.05-4.13 9.18-9.2 9.18Zm5.07-6.87c-.28-.14-1.64-.81-1.89-.9-.25-.1-.43-.14-.62.14-.18.27-.72.89-.89 1.07-.16.18-.33.2-.61.07-.28-.14-1.17-.43-2.23-1.36-.82-.73-1.37-1.62-1.53-1.9-.16-.27-.02-.42.12-.56.12-.12.28-.33.42-.5.14-.17.18-.29.28-.48.1-.2.05-.36-.02-.5-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47l-.53-.01c-.2 0-.5.07-.76.36-.26.28-.98.96-.98 2.33 0 1.37 1 .67 1.14.95.14.27.3.54.52.82.16.2.34.43.46.57.14.17.02.38-.09.52-.12.14-.26.32-.39.51-.12.2-.26.41-.11.68.14.27.64 1.58 1.5 2.23 1.05.78 1.88 1.03 2.4 1.15.25.05.47.05.65.03.2-.03.64-.26.73-.52.09-.27.09-.5.06-.55-.03-.05-.11-.08-.24-.14Z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="muted">LinkedIn:</div>
            <a href="https://www.linkedin.com/in/ali-raad-hussein/" target="_blank" rel="noreferrer">/in/ali-raad-hussein</a>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <div className="muted">Phone:</div>
            <a href="tel:+9647835949338">+964 783 594 9338</a>
          </div>
        </div>
      </div>
      <p>Prefer a quick message? Use the form below and I’ll get back to you.</p>
      <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
        <input placeholder="Your Name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input placeholder="Your Phone (optional)" value={phone} onChange={(e)=>setPhone(e.target.value)} />
        <input placeholder="Your Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <textarea placeholder="Message" rows={6} value={message} onChange={(e)=>setMessage(e.target.value)} required />
        <button type="submit">Send</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}
