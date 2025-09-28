const express = require('express');
const mongoose = require('mongoose');
const AWS = require('aws-sdk');
const { requireAuth, requireRole } = require('../middleware/auth.js');
const { User } = require('../models/user.js');
const { Contact } = require('../models/company.js');

const router = express.Router();

// Initialize AWS SES
const ses = new AWS.SES({ region: 'us-east-1' });

// Function to send email notification
async function sendEmailNotification(contactData) {
  try {
    const params = {
      Destination: {
        ToAddresses: [process.env.NOTIFICATION_EMAIL || 'aliraad90@gmail.com']
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <html>
                <body>
                  <h2>New Contact Form Submission</h2>
                  <p><strong>Name:</strong> ${contactData.name}</p>
                  <p><strong>Email:</strong> ${contactData.email}</p>
                  <p><strong>Subject:</strong> ${contactData.subject}</p>
                  <p><strong>Message:</strong></p>
                  <p>${contactData.message.replace(/\n/g, '<br>')}</p>
                  <hr>
                  <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
                </body>
              </html>
            `
          },
          Text: {
            Charset: 'UTF-8',
            Data: `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}

Message:
${contactData.message}

Submitted at: ${new Date().toLocaleString()}
            `
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `New Contact Form: ${contactData.subject}`
        }
      },
      Source: process.env.FROM_EMAIL || 'aliraad90@gmail.com'
    };

    const result = await ses.sendEmail(params).promise();
    console.log('Email sent successfully:', result.MessageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Admin: list all users
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ message: 'Database not available', users: [] });
    }
    
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    res.json(users.map((u) => ({
      id: String(u._id),
      email: u.email,
      role: u.role,
      created_at: u.createdAt,
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: contact form submission
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Name, email, subject, and message are required' });
  }

  try {
    const contactData = { name, email, subject, message };
    
    // Log contact form submission
    console.log('Contact form submission:', { 
      ...contactData, 
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress 
    });

    // Save to database if available
    if (mongoose.connection.readyState === 1) {
      await Contact.create({
        ...contactData,
        ip: req.ip || req.connection.remoteAddress
      });
    }

    // Send email notification
    try {
      await sendEmailNotification(contactData);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails, just log it
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.' 
    });
  } catch (e) {
    console.error('Contact form error:', e);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Admin: create new user (for admin purposes)
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash(password, 10);
    
    const user = await User.create({ 
      email, 
      passwordHash: hash, 
      role: role || 'user' 
    });

    res.status(201).json({
      id: String(user._id),
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
    });
  } catch (e) {
    if (e.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
});

// Admin: update user
router.patch('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { email, role, enabled } = req.body;
  
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const update = {};
    if (email !== undefined) update.email = email;
    if (role !== undefined) update.role = role;
    if (enabled !== undefined) update.enabled = enabled;
    
    const user = await User.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      id: String(user._id),
      email: user.email,
      role: user.role,
      created_at: user.createdAt,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;