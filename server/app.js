import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import facultyRoutes from './routes/facultyRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import suggestionRoutes from './routes/suggestionRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/faculties', facultyRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/activities', activityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', status: 'OK' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

