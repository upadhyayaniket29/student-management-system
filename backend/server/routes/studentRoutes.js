import express from 'express';
import {
  getAllStudents,
  getStudentById,
  updateStudentStatus,
  getStudentProfile,
  updateStudentProfile,
  uploadProfilePicture,
  getStudentActivity,
} from '../controllers/studentController.js';
import { authenticate, isAdmin, isStudent } from '../middleware/auth.js';
import { uploadProfilePicture as uploadMiddleware } from '../middleware/upload.js';
import { body } from 'express-validator';

const router = express.Router();

// Admin routes
router.get('/', authenticate, isAdmin, getAllStudents);
router.get('/:id', authenticate, isAdmin, getStudentById);
router.patch('/:id/status', authenticate, isAdmin, updateStudentStatus);
router.get('/:id/activity', authenticate, isAdmin, getStudentActivity);

// Student routes
router.get('/profile/me', authenticate, isStudent, getStudentProfile);
router.put(
  '/profile/me',
  authenticate,
  isStudent,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
  ],
  updateStudentProfile
);
router.post(
  '/profile/picture',
  authenticate,
  isStudent,
  uploadMiddleware.single('profilePicture'),
  uploadProfilePicture
);

export default router;
