import express from 'express';
import {
  getAllFees,
  getStudentFees,
  createFee,
  payFee,
  getFeeStats,
} from '../controllers/feeController.js';
import { authenticate, isAdmin, isStudent } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Admin routes
router.get('/', authenticate, isAdmin, getAllFees);
router.get('/stats', authenticate, isAdmin, getFeeStats);
router.post('/', authenticate, isAdmin, createFee);

// Student routes
router.get('/student/me', authenticate, isStudent, getStudentFees);
router.post(
  '/:id/pay',
  authenticate,
  isStudent,
  [
    body('paymentMethod')
      .isIn(['cash', 'card', 'online', 'bank_transfer'])
      .withMessage('Invalid payment method'),
  ],
  payFee
);

export default router;
