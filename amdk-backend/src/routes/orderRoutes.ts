// src/routes/orderRoutes.ts
import { Router } from 'express';
import { createOrder, getOrders, getOrder } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getOrders);
router.post('/', authenticateToken, createOrder);
router.get('/:id', authenticateToken, getOrder);

export default router;
