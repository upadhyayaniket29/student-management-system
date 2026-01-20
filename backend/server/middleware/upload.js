import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/profiles'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, req.user._id + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Configure storage for gallery images
const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads/gallery'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Create multer upload instances
export const uploadProfilePicture = multer({
    storage: profileStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: fileFilter,
});

export const uploadGalleryImage = multer({
    storage: galleryStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for gallery
    },
    fileFilter: fileFilter,
});
