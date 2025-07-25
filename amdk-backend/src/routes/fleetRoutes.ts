import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  createFleet,
  getAllFleets,
  deleteFleet,
  updateFleet,
} from '../controllers/fleetController';

const router = Router();

router.post('/', authenticateToken, createFleet);
router.get('/', authenticateToken, getAllFleets);
router.put('/:id', authenticateToken, updateFleet);
router.delete('/:id', authenticateToken, deleteFleet);

export default router;
