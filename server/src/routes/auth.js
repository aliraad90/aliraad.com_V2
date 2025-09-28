import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  try {
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.enabled === false) return res.status(403).json({ error: 'Account disabled' });
    if (user.expiresAt && new Date(user.expiresAt) < new Date()) return res.status(403).json({ error: 'Subscription expired' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: String(user._id), role: user.role, companyId: user.companyId ? String(user.companyId) : null }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, role: user.role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
