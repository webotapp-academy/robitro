import express from 'express';
import {
  getAllProducts,
  getProductById,
  getAllCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getAllCategories);
router.get('/:id', getProductById);

// Protected routes (admin/partner)
router.post('/', protect, authorize('admin', 'partner'), createProduct);
router.put('/:id', protect, authorize('admin', 'partner'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'partner'), deleteProduct);

export default router;

