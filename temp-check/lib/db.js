const mongoose = require('mongoose');

async function connectDB() {
  // Skip database connection if MONGODB_URI is not properly set
  if (!process.env.MONGODB_URI || !process.env.MONGODB_URI.startsWith('mongodb')) {
    console.log('MongoDB connection skipped - no valid MONGODB_URI provided');
    return;
  }
  
  if (mongoose.connection.readyState === 1) return;
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection failed, continuing without database:', error.message);
  }
}

async function closeDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
  }
}

module.exports = { connectDB, closeDB };
