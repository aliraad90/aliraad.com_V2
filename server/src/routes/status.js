const express = require('express');
const { requireAuth } = require('../middleware/auth.js');

const router = express.Router();

// Public: health check
router.get('/clients', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'personal-website-api',
    message: 'API is running successfully'
  });
});

// Admin: system status
router.get('/system', requireAuth, async (req, res) => {
  try {
    // Basic system information
    const systemInfo = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    };
    
    res.json(systemInfo);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: website info
router.get('/info', (req, res) => {
  res.json({
    name: "Personal Website API",
    version: "1.0.0",
    description: "Backend API for personal website",
    endpoints: {
      health: "/api/status/clients",
      info: "/api/status/info",
      contact: "/api/companies/contact",
      auth: "/api/auth/*"
    }
  });
});

module.exports = router;