import React, { useState } from 'react';
import { sendContact } from '../publicApi.js';

export default function Contact() {
  // Contact form component with auto-reply functionality
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
    <div style={{ padding: '20px 0', minHeight: '400px' }}>
      <h3 className="section-title" style={{ marginBottom: '30px' }}>Contact</h3>
      
      <div className="card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h4 style={{ color: '#fff', marginBottom: '15px' }}>Direct Contact</h4>
        <div className="stack">
          <p>📧 Email: <a href="mailto:aliraad90@gmail.com" style={{ color: 'var(--color-primary)' }}>aliraad90@gmail.com</a></p>
          <p>📱 WhatsApp: <a href="https://wa.me/9647835949338" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>Chat on WhatsApp</a></p>
          <p>💼 LinkedIn: <a href="https://www.linkedin.com/in/ali-raad-hussein/" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>/in/ali-raad-hussein</a></p>
          <p>📞 Phone: <a href="tel:+9647835949338" style={{ color: 'var(--color-primary)' }}>+964 783 594 9338</a></p>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <h4 style={{ color: '#fff', marginBottom: '15px' }}>Quick Message</h4>
        <p className="muted" style={{ marginBottom: '20px' }}>
          Prefer a quick message? Use the form below and I'll get back to you.
        </p>
        
        <form onSubmit={submit} className="stack">
          <div>
            <label className="label">Your Name *</label>
            <input 
              type="text"
              placeholder="Enter your full name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="input"
              style={{ marginTop: '5px' }}
            />
          </div>
          
          <div>
            <label className="label">Your Phone (optional)</label>
            <input 
              type="text"
              placeholder="Enter your phone number" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="input"
              style={{ marginTop: '5px' }}
            />
          </div>
          
          <div>
            <label className="label">Your Email *</label>
            <input 
              type="email"
              placeholder="Enter your email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="input"
              style={{ marginTop: '5px' }}
            />
          </div>
          
          <div>
            <label className="label">Message *</label>
            <textarea 
              placeholder="Tell me about your project or question..." 
              rows={6} 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              required 
              className="input"
              style={{ 
                marginTop: '5px',
                resize: 'vertical',
                minHeight: '120px'
              }}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ 
              width: '100%',
              padding: '12px', 
              fontSize: '16px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Send Message
          </button>
        </form>
        
        {status && (
          <div style={{ 
            marginTop: '20px',
            padding: '15px', 
            backgroundColor: status.includes('Thanks') ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
            color: status.includes('Thanks') ? '#22c55e' : '#ef4444',
            border: `1px solid ${status.includes('Thanks') ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            borderRadius: '8px'
          }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}