import express from 'express';
import {
  getAllActivities,
  getStudentActivities,
  getRecentActivities,
  getActivityStats,
} from '../controllers/activityController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes are admin only
router.get('/', authenticate, isAdmin, getAllActivities);
router.get('/recent', authenticate, isAdmin, getRecentActivities);
router.get('/stats', authenticate, isAdmin, getActivityStats);
router.get('/student/:id', authenticate, isAdmin, getStudentActivities);

export default router;
