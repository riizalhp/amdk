// src/controllers/productController.ts
import { AuthRequest } from '../middleware/authMiddleware';
import {
  createNewProduct,
  getAllProducts,
  updateProductById,
  deleteProductById,
} from '../services/productService';

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const newProduct = await createNewProduct(req.body);
    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const allProducts = await getAllProducts();
    res.status(200).json(allProducts);
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await updateProductById(id, req.body);
    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteProductById(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: unknown) {
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};
