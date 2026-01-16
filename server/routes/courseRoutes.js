import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const courseValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('duration').trim().notEmpty().withMessage('Duration is required'),
];

// Public routes (authenticated users)
router.get('/', authenticate, getAllCourses);
router.get('/:id', authenticate, getCourseById);

// Admin routes
router.post('/', authenticate, isAdmin, courseValidation, createCourse);
router.put('/:id', authenticate, isAdmin, courseValidation, updateCourse);
router.delete('/:id', authenticate, isAdmin, deleteCourse);

export default router;
