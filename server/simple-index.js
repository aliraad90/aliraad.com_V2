const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// CORS configuration - let AWS Function URL handle CORS
// app.use(cors()); // Disable application-level CORS

app.use(express.json());

// Simple email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ccr1036user@gmail.com',
    pass: 'yded ccde zkry rzxg'
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Simple API is working' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Simple contact endpoint
app.post('/api/companies/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    console.log('Contact form received:', { name, email, subject, message });
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Send email
    const mailOptions = {
      from: 'ccr1036user@gmail.com',
      to: 'ccr1036user@gmail.com',
      subject: `New Contact: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.json({ 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Export for Lambda
const serverless = require('serverless-http');
const handler = serverless(app);

module.exports = { handler };
