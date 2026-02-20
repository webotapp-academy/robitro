import express from 'express';
import cors from 'cors';
import { config } from './config/database.js';
import prisma from './config/db.js';
import authRoutes from './routes/auth.js';
import courseRoutes from './routes/courses.js';
import productRoutes from './routes/products.js';
import enrollmentRoutes from './routes/enrollments.js';
import communityRoutes from './routes/community.js';
import adminRoutes from './routes/admin.js';
import orderRoutes from './routes/orders.js';
import cmsRoutes from './routes/cms.js';
import enquiryRoutes from './routes/enquiry.js';
import uploadRoutes from './routes/upload.js';


import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Path Logging Middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// We check two common locations for the dist folder
const possibleDistPaths = [
  path.join(__dirname, 'public'),
  path.join(__dirname, 'dist'),
  path.join(__dirname, '../client/dist'),
  path.join(__dirname, '../dist')
];

let distPath = possibleDistPaths.find(p => {
  try {
    return fs.existsSync(path.join(p, 'index.html'));
  } catch (e) {
    return false;
  }
}) || possibleDistPaths[0];

console.log(`📁 Serving static files from: ${distPath}`);
app.use(express.static(distPath));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Check Prisma/Neon DB connection
prisma.$connect()
  .then(() => {
    console.log('✓ Connected to Neon DB (PostgreSQL)');
  })
  .catch((error) => {
    console.error('✗ Neon DB connection error:', error.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/enquiry', enquiryRoutes);
app.use('/api/upload', uploadRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Catch-all to serve React's index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


