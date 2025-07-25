// src/controllers/authController.ts
import { Request, Response } from 'express';
// Import yang duplikat sudah saya hapus dan rapikan
import { registerNewUser, loginUser as loginUserService } from '../services/authService';
import { AuthRequest } from '../middleware/authMiddleware';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = await registerNewUser(req.body);
    res.status(201).json({
      message: 'User registered successfully',
      data: newUser
    });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await loginUserService(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

// V Fungsi ini seharusnya berada di luar/di bawah fungsi loginUser V
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  // Data 'user' didapat dari middleware setelah verifikasi token
  res.status(200).json(req.user);
};