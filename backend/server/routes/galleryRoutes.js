import express from 'express';
import {
  getAllGalleryImages,
  uploadGalleryImage,
  uploadGalleryFile,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';
import { uploadGalleryImage as uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

// Public routes (authenticated users)
router.get('/', authenticate, getAllGalleryImages);

// Admin routes
router.post('/', authenticate, isAdmin, uploadGalleryImage); // URL upload
router.post('/upload', authenticate, isAdmin, uploadMiddleware.single('image'), uploadGalleryFile); // File upload
router.put('/:id', authenticate, isAdmin, updateGalleryImage);
router.delete('/:id', authenticate, isAdmin, deleteGalleryImage);

export default router;
