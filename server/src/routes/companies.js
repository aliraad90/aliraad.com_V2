import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { User } from '../models/user.js';

const router = express.Router();

// Admin: list all users
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
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
    // Log contact form submission (you can save to database later)
    console.log('Contact form submission:', { 
      name, 
      email, 
      subject, 
      message, 
      timestamp: new Date(),
      ip: req.ip || req.connection.remoteAddress 
    });
    
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

export default router;