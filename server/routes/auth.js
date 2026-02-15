import express from 'express';
import {
  studentSignup,
  partnerSignup,
  login,
  getProfile,
  updateProfile,
  logout,
  verifyEmail,
  changePassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/student-signup', studentSignup);
router.post('/partner-signup', partnerSignup);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);
router.post('/verify-email', protect, verifyEmail);
router.post('/change-password', protect, changePassword);

export default router;

