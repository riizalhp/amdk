// src/controllers/orderController.ts
import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware'; // Pastikan import ini ada
import { createNewOrder, getAllOrders, getOrderById } from '../services/orderService';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId; // Baris ini sekarang tidak akan error
    if (!userId) {
      return res.status(403).json({ message: 'User ID not found in token' });
    }

    const newOrder = await createNewOrder(req.body, userId);
    res.status(201).json({
      message: 'Order created successfully',
      data: newOrder,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const allOrders = await getAllOrders();
    res.status(200).json(allOrders);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};
