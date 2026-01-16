import express from 'express';
import {
  getAllEnrollments,
  getStudentEnrollments,
  createEnrollment,
  deleteEnrollment,
} from '../controllers/enrollmentController.js';
import { authenticate, isAdmin, isStudent } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Admin routes
router.get('/', authenticate, isAdmin, getAllEnrollments);

// Student routes
router.get('/student/me', authenticate, isStudent, getStudentEnrollments);
router.post(
  '/',
  authenticate,
  isStudent,
  [body('courseId').notEmpty().withMessage('Course ID is required')],
  createEnrollment
);
router.delete('/:id', authenticate, deleteEnrollment);

export default router;
