import { Response } from 'express'; // <-- PERBAIKAN DI SINI
import { AuthRequest } from '../middleware/authMiddleware';
import * as fleetService from '../services/fleetService';

export const createFleet = async (req: AuthRequest, res: Response) => {
  try {
    const fleet = await fleetService.createFleet(req.body);
    res.status(201).json(fleet);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const getAllFleets = async (req: AuthRequest, res: Response) => {
  try {
    const fleets = await fleetService.getAllFleets();
    res.status(200).json(fleets);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const updateFleet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await fleetService.updateFleet(id, req.body);
    if (success) {
      res.status(200).json({ message: 'Fleet updated successfully' });
    } else {
      res.status(404).json({ message: 'Fleet not found or no changes made' });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const deleteFleet = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = await fleetService.deleteFleet(id);
    if (success) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Fleet not found' });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};
