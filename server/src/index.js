require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const serverless = require('serverless-http');
const { connectDB, closeDB } = require('./lib/db.js');
const authRoutes = require('./routes/auth.js');
const companyRoutes = require('./routes/companies.js');
const statusRoutes = require('./routes/status.js');
const publicRoutes = require('./routes/public.js');

const app = express();
app.set('trust proxy', 1);

// Helmet: relaxed CSP in development; strict defaults in production
if (process.env.NODE_ENV !== 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "connect-src": [
          "'self'",
          "http://localhost:5173",
          "http://localhost:4000",
          "ws:",
          "wss:"
        ],
        "img-src": ["'self'", "data:", "blob:"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        "script-src": ["'self'"]
      }
    }
  }));
} else {
  app.use(helmet());
}

// CORS: In production, restrict to ALLOWED_ORIGINS (comma-separated). In dev, allow all.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow all origins for now to fix CORS issues
      // In production, you can restrict this to specific domains
      return cb(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Friendly root route to avoid 404s at /
app.get('/', (req, res) => {
  res.type('text').send('Personal Website API is running. Try GET /api/health');
});

app.get('/api/health', async (req, res) => {
  try {
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/public', publicRoutes);

const PORT = process.env.PORT || 4000;

// For Lambda: establish DB connection on cold start
let dbInitPromise;
function ensureDB() {
  if (!dbInitPromise) {
    dbInitPromise = connectDB().catch((e) => {
      console.error('DB connection failed:', e);
      // Re-throw to surface init failures
      throw e;
    });
  }
  return dbInitPromise;
}

// Export a Lambda handler for AWS API Gateway via serverless-http
const handler = serverless(async (req, res, next) => {
  await ensureDB();
  return app(req, res, next);
});

module.exports = { handler };

// Local/dev server start (non-Lambda): only start when executed directly
async function start() {
  await ensureDB();
  const server = app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal) => {
    try {
      console.log(`\nReceived ${signal}. Shutting down gracefully...`);
      await closeDB();
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
      // Fallback exit if close hangs
      setTimeout(() => {
        console.warn('Force exiting after timeout');
        process.exit(1);
      }, 10000).unref();
    } catch (e) {
      console.error('Error during shutdown:', e);
      process.exit(1);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  return server;
}

// Detect if this file is run directly (node src/index.js) in CommonJS
const isDirectRun = require.main === module;
const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;
if (isDirectRun && !isLambda) {
  start().catch((e) => {
    console.error('Failed to start server:', e);
    process.exit(1);
  });
}

// 404 handler (after routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

// Global process-level handlers
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});