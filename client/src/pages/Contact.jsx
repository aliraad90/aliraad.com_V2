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
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (e) {
      setStatus(e.message || 'An error occurred. Please try again.');
    }
  }

  return (
    <div className="contact-container">
      <div className="container">
        <h2 className="contact-title">Get In Touch</h2>
        
        <div className="contact-grid">
          {/* Contact Information */}
          <div className="contact-info">
            <h3>Contact Information</h3>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📧</span>
                <div>
                  <h4>Email</h4>
                  <a href="mailto:aliraad90@gmail.com">aliraad90@gmail.com</a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📱</span>
                <div>
                  <h4>WhatsApp</h4>
                  <a href="https://wa.me/9647835949338" target="_blank" rel="noreferrer">+964 783 594 9338</a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">💼</span>
                <div>
                  <h4>LinkedIn</h4>
                  <a href="https://www.linkedin.com/in/ali-raad-hussein/" target="_blank" rel="noreferrer">Connect on LinkedIn</a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div>
                  <h4>Phone</h4>
                  <a href="tel:+9647835949338">+964 783 594 9338</a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="contact-form">
            <h3>Send a Message</h3>
            <p className="form-description">
              Have a question or want to discuss a project? Fill out the form below and I'll get back to you as soon as possible.
            </p>
            
            <form onSubmit={submit} className="contact-form-container">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Your Phone (optional)</label>
                <input
                  id="phone"
                  type="text"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  placeholder="Tell me about your project or question..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="form-textarea"
                />
              </div>
              
              <button type="submit" className="submit-btn">
                Send Message
              </button>
              
              {status && (
                <div className={`status-message ${status.includes('Thanks') ? 'success' : 'error'}`}>
                  {status}
                </div>
              )}
            </form>
          </div>
        </div>
        
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