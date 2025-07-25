// src/controllers/orderController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Pastikan import ini ada
import { createNewOrder, getAllOrders } from '../services/orderService';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId; // Baris ini sekarang tidak akan error
    if (!userId) {
      return res.status(403).json({ message: 'User ID not found in token' });
    }

    const newOrder = await createNewOrder(req.body, userId);
    res.status(201).json({
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const allOrders = await getAllOrders();
    res.status(200).json(allOrders);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};