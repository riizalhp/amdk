// src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';


const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/profile', authenticateToken, getUserProfile);

export default router;