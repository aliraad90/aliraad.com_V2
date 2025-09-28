import React, { useState } from 'react';
import { sendContact } from '../publicApi.js';

export default function Contact() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

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
      
      {/* Direct Contact Info */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="stack">
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

      {/* Contact Form */}
      <p style={{ marginBottom: 16, fontSize: 16 }}>Prefer a quick message? Use the form below and I'll get back to you.</p>
      
      <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginBottom: 16 }}>
        <input 
          placeholder="Your Name" 
          value={name} 
          onChange={(e)=>setName(e.target.value)} 
          required 
          style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <input 
          placeholder="Your Phone (optional)" 
          value={phone} 
          onChange={(e)=>setPhone(e.target.value)} 
          style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <input 
          placeholder="Your Email" 
          type="email" 
          value={email} 
          onChange={(e)=>setEmail(e.target.value)} 
          required 
          style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4 }}
        />
        <textarea 
          placeholder="Message" 
          rows={6} 
          value={message} 
          onChange={(e)=>setMessage(e.target.value)} 
          required 
          style={{ padding: 12, border: '1px solid #ccc', borderRadius: 4, resize: 'vertical' }}
        />
        <button 
          type="submit" 
          style={{ 
            padding: 12, 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4, 
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </form>
      
      {status && (
        <p style={{ 
          padding: 12, 
          backgroundColor: status.includes('Thanks') ? '#d4edda' : '#f8d7da', 
          color: status.includes('Thanks') ? '#155724' : '#721c24',
          border: `1px solid ${status.includes('Thanks') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: 4,
          margin: 0
        }}>
          {status}
        </p>
      )}
    </div>
  );
}