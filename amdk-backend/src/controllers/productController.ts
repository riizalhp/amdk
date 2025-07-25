// src/controllers/productController.ts
import { Request, Response } from 'express';
import { createNewProduct, getAllProducts, updateProductById, deleteProductById } from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await createNewProduct(req.body);
    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const allProducts = await getAllProducts();
    res.status(200).json(allProducts);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct = await updateProductById(id, req.body);
    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteProductById(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};