// src/routes/productRoutes.ts
import { Router } from 'express';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from '../controllers/productController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticateToken, createProduct);
router.put('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
