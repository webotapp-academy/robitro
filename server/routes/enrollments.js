import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  enrollCourse,
  getMyEnrolledCourses,
  getEnrollmentDetails,
  completeLessonProgress,
  getCourseEnrollments,
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for enrollment payment proof uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/enrollment-proofs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'enrollment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Protected routes
router.post('/enroll', protect, upload.single('paymentProof'), enrollCourse);
router.get('/my-courses', protect, getMyEnrolledCourses);
router.get('/:enrollmentId', protect, getEnrollmentDetails);
router.post('/progress/complete-lesson', protect, completeLessonProgress);
router.get('/course/:courseId/enrollments', protect, authorize('instructor', 'admin'), getCourseEnrollments);

export default router;
