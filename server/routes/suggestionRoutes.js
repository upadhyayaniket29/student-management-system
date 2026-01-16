import express from 'express';
import {
  getAllSuggestions,
  getStudentSuggestions,
  createSuggestion,
  updateSuggestionStatus,
  deleteSuggestion,
} from '../controllers/suggestionController.js';
import { authenticate, isAdmin, isStudent } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const suggestionValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('category')
    .optional()
    .isIn(['academic', 'facilities', 'services', 'other'])
    .withMessage('Invalid category'),
];

// Admin routes
router.get('/', authenticate, isAdmin, getAllSuggestions);
router.patch('/:id/status', authenticate, isAdmin, updateSuggestionStatus);

// Student routes
router.get('/student/me', authenticate, isStudent, getStudentSuggestions);
router.post('/', authenticate, isStudent, suggestionValidation, createSuggestion);
router.delete('/:id', authenticate, deleteSuggestion);

export default router;
