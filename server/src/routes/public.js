const express = require('express');
const mongoose = require('mongoose');
const { Contact } = require('../models/company.js');

const router = express.Router();

// Public: basic info
router.get('/info', (req, res) => {
  res.json({
    name: "Personal Website API",
    version: "1.0.0",
    description: "Backend API for personal website",
    endpoints: {
      health: "/api/status/health",
      contact: "/api/public/contact",
      auth: "/api/auth/*"
    }
  });
});

// Public: contact form submission (alternative endpoint)
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required' });
  }

  try {
    // Check if database is available
    if (mongoose.connection.readyState === 1) {
      // Save contact form submission to database
      const contact = await Contact.create({
        name,
        email,
        subject,
        message,
        ip: req.ip || req.connection.remoteAddress
      });

      res.status(201).json({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.',
        id: contact._id
      });
    } else {
      // Database not available, just log the message
      console.log('Contact form submission (no DB):', { name, email, subject, message });
      res.status(201).json({
        success: true,
        message: 'Thank you for your message! I will get back to you soon.',
        note: 'Message logged (database not available)'
      });
    }
  } catch (e) {
    console.error('Contact form error:', e);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;