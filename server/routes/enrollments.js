import express from 'express';
import {
  enrollCourse,
  getMyEnrolledCourses,
  getEnrollmentDetails,
  completeLessonProgress,
  getCourseEnrollments,
} from '../controllers/enrollmentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.post('/enroll', protect, enrollCourse);
router.get('/my-courses', protect, getMyEnrolledCourses);
router.get('/:enrollmentId', protect, getEnrollmentDetails);
router.post('/progress/complete-lesson', protect, completeLessonProgress);
router.get('/course/:courseId/enrollments', protect, authorize('instructor', 'admin'), getCourseEnrollments);

export default router;

