const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { requireAuth, requireRole } = require('../middleware/auth.js');
const { User } = require('../models/user.js');
const { Contact } = require('../models/company.js');

const router = express.Router();

// Initialize Gmail SMTP transporter
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'ccr1036user@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || process.env.GMAIL_PASSWORD
  }
});

// Function to send email notification to admin
async function sendEmailNotification(contactData) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || 'ccr1036user@gmail.com',
      to: process.env.NOTIFICATION_EMAIL || 'ccr1036user@gmail.com',
      subject: `New Contact Form: ${contactData.subject}`,
      html: `
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
      `,
      text: `
New Contact Form Submission

Name: ${contactData.name}
Email: ${contactData.email}
Subject: ${contactData.subject}

Message:
${contactData.message}

Submitted at: ${new Date().toLocaleString()}
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

// Function to send auto-reply to customer
async function sendAutoReply(contactData) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || 'ccr1036user@gmail.com',
      to: contactData.email,
      subject: `Thank you for your message - We'll be in touch soon!`,
      html: `
        <html>
          <head>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
              .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; color: #666; }
              .highlight { background: #f0f8ff; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
              .contact-info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
              .social-links { margin: 20px 0; }
              .social-links a { display: inline-block; margin: 0 10px; padding: 8px 16px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Thank You for Contacting Us!</h1>
              <p>We've received your message and will get back to you soon.</p>
            </div>
            
            <div class="content">
              <p>Dear ${contactData.name},</p>
              
              <p>Thank you for reaching out to me! I've received your message regarding <strong>"${contactData.subject}"</strong> and I appreciate you taking the time to contact me.</p>
              
              <div class="highlight">
                <p><strong>Your Message Summary:</strong></p>
                <p><em>"${contactData.message.substring(0, 100)}${contactData.message.length > 100 ? '...' : ''}"</em></p>
              </div>
              
              <p>I typically respond to all inquiries within <strong>24 hours</strong> during business days. If your matter is urgent, please don't hesitate to reach out to me directly.</p>
              
              <div class="contact-info">
                <h3>Quick Contact Options:</h3>
                <p><strong>📧 Email:</strong> ccr1036user@gmail.com</p>
                <p><strong>📱 WhatsApp:</strong> +964 783 594 9338</p>
                <p><strong>💼 LinkedIn:</strong> /in/ali-raad-hussein</p>
              </div>
              
              <p>In the meantime, feel free to explore my <a href="https://amplify-deploy.da4pdofhs4ph2.amplifyapp.com/portfolio" style="color: #667eea;">portfolio</a> or learn more about my <a href="https://amplify-deploy.da4pdofhs4ph2.amplifyapp.com/services" style="color: #667eea;">services</a>.</p>
              
              <p>Best regards,<br>
              <strong>Ali Raad Hussein</strong><br>
              <em>Senior Network & System Engineer | IT Freelancer</em></p>
            </div>
            
            <div class="footer">
              <p>This is an automated response. Please do not reply to this email.</p>
              <div class="social-links">
                <a href="https://www.linkedin.com/in/ali-raad-hussein/" target="_blank">LinkedIn</a>
                <a href="https://wa.me/9647835949338" target="_blank">WhatsApp</a>
              </div>
              <p>© 2024 Ali Raad Hussein. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
      text: `
Thank You for Contacting Us!

Dear ${contactData.name},

Thank you for reaching out to me! I've received your message regarding "${contactData.subject}" and I appreciate you taking the time to contact me.

Your Message Summary:
"${contactData.message}"

I typically respond to all inquiries within 24 hours during business days. If your matter is urgent, please don't hesitate to reach out to me directly.

Quick Contact Options:
📧 Email: ccr1036user@gmail.com
📱 WhatsApp: +964 783 594 9338
💼 LinkedIn: /in/ali-raad-hussein

In the meantime, feel free to explore my portfolio or learn more about my services at:
https://amplify-deploy.da4pdofhs4ph2.amplifyapp.com

Best regards,
Ali Raad Hussein
Senior Network & System Engineer | IT Freelancer

---
This is an automated response. Please do not reply to this email.
© 2024 Ali Raad Hussein. All rights reserved.
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Auto-reply sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send auto-reply:', error);
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

    // Send email notification to admin
    try {
      await sendEmailNotification(contactData);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails, just log it
    }

    // Send auto-reply to customer
    try {
      await sendAutoReply(contactData);
      console.log('Auto-reply sent successfully');
    } catch (autoReplyError) {
      console.error('Auto-reply failed:', autoReplyError);
      // Don't fail the request if auto-reply fails, just log it
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