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
    <div>
      <h3>Contact</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Direct</h4>
        <p>Email: <a href="mailto:aliraad90@gmail.com">aliraad90@gmail.com</a></p>
        <p>WhatsApp: <a href="https://wa.me/9647835949338" target="_blank" rel="noreferrer">Chat on WhatsApp</a></p>
        <p>LinkedIn: <a href="https://www.linkedin.com/in/ali-raad-hussein/" target="_blank" rel="noreferrer">/in/ali-raad-hussein</a></p>
        <p>Phone: <a href="tel:+9647835949338">+964 783 594 9338</a></p>
      </div>

      <p style={{ marginBottom: '20px', fontSize: '16px' }}>
        Prefer a quick message? Use the form below and I'll get back to you.
      </p>
      
      <form onSubmit={submit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            placeholder="Your Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="text"
            placeholder="Your Phone (optional)" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input 
            type="email"
            placeholder="Your Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '16px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <textarea 
            placeholder="Message" 
            rows={6} 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            required 
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          style={{ 
            width: '100%',
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </form>
      
      {status && (
        <div style={{ 
          marginTop: '20px',
          padding: '15px', 
          backgroundColor: status.includes('Thanks') ? '#d4edda' : '#f8d7da', 
          color: status.includes('Thanks') ? '#155724' : '#721c24',
          border: `1px solid ${status.includes('Thanks') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}