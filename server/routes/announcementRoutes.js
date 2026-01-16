import express from 'express';
import {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcementController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

const announcementValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
];

// Public routes (authenticated users)
router.get('/', authenticate, getAllAnnouncements);
router.get('/:id', authenticate, getAnnouncementById);

// Admin routes
router.post('/', authenticate, isAdmin, announcementValidation, createAnnouncement);
router.put('/:id', authenticate, isAdmin, announcementValidation, updateAnnouncement);
router.delete('/:id', authenticate, isAdmin, deleteAnnouncement);

export default router;
