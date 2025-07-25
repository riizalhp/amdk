// src/routes/storeRoutes.ts
import { Router } from 'express';
import { createStore, getStores, updateStore, deleteStore } from '../controllers/storeController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getStores);
router.post('/', authenticateToken, createStore);
router.put('/:id', authenticateToken, updateStore);
router.delete('/:id', authenticateToken, deleteStore);

export default router;
