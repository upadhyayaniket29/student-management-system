import express from 'express';
import {
  studentSignup,
  adminSignup,
  login,
  getMe,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Routes
router.post('/student/signup', signupValidation, studentSignup);
router.post('/admin/signup', signupValidation, adminSignup);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);

export default router;
