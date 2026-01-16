import express from 'express';
import {
  getAllFaculties,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
} from '../controllers/facultyController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const facultyValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('department').trim().notEmpty().withMessage('Department is required'),
];

// Public routes (authenticated users)
router.get('/', authenticate, getAllFaculties);
router.get('/:id', authenticate, getFacultyById);

// Admin routes
router.post('/', authenticate, isAdmin, facultyValidation, createFaculty);
router.put('/:id', authenticate, isAdmin, facultyValidation, updateFaculty);
router.delete('/:id', authenticate, isAdmin, deleteFaculty);

export default router;
