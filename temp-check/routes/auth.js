const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user.js');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available - login disabled' });
    }
    
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.enabled === false) return res.status(403).json({ error: 'Account disabled' });
    if (user.expiresAt && new Date(user.expiresAt) < new Date()) return res.status(403).json({ error: 'Subscription expired' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: String(user._id), role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, role: user.role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
