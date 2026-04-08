const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const connectDB = require('./database');

// Route imports
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const fuelRecordRoutes = require('./routes/fuelRecords');

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(cors()); // CORS must come before helmet to set headers correctly
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin requests for your API
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev')); // Request logging

// =========================
// ROUTES
// =========================
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/fuel-records', fuelRecordRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: 'MongoDB Atlas',
  });
});

// =========================
// ERROR HANDLING
// =========================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ═══════════════════════════════════════');
      console.log(`🚀  Fuel Expenses Logger API`);
      console.log(`🚀  Server running on http://localhost:${PORT}`);
      console.log(`🚀  Database: MongoDB Atlas`);
      console.log(`🚀  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 ═══════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
