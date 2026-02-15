import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  likePost,
  addComment,
  deleteComment,
  updatePost,
  deletePost,
  getUserPosts,
} from '../controllers/communityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/post/:id', getPostById);
router.get('/user/:userId', getUserPosts);

// Protected routes
router.post('/', protect, createPost);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comments', protect, addComment);
router.delete('/:postId/comments/:commentId', protect, deleteComment);

export default router;

