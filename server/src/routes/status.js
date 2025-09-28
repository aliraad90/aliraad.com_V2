import express from 'express';
import { listActivePPP } from '../lib/mikrotik.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/clients', requireAuth, async (req, res) => {
  try {
    const items = await listActivePPP();
    res.json(items.map((i) => ({
      name: i.name,
      ip: i.address,
      uptime: i.uptime,
      lastSeen: i.lastSeen,
      status: 'online',
    })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
