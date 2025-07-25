// src/controllers/storeController.ts
import { Request, Response } from 'express';
import { createNewStore, getAllStores, updateStoreById, deleteStoreById } from '../services/storeService';

export const createStore = async (req: Request, res: Response) => {
  try {
    const newStore = await createNewStore(req.body);
    res.status(201).json({
      message: 'Store created successfully',
      data: newStore
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStores = async (req: Request, res: Response) => {
  try {
    const allStores = await getAllStores();
    res.status(200).json(allStores);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedStore = await updateStoreById(id, req.body);
    res.status(200).json({
      message: 'Store updated successfully',
      data: updatedStore
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteStore = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteStoreById(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};