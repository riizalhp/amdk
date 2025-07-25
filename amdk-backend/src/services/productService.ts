// src/services/productService.ts
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';

interface ProductData {
  name: string;
  size_ml: number;
  price: number;
  stock_quantity: number;
}

export const createNewProduct = async (productData: ProductData) => {
  const { name, size_ml, price, stock_quantity } = productData;
  const newProductId = uuidv4();

  const sql = `
    INSERT INTO products (id, name, size_ml, price, stock_quantity)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.query(sql, [newProductId, name, size_ml, price, stock_quantity]);

  return { id: newProductId, ...productData };
};

export const getAllProducts = async () => {
  const sql = 'SELECT * FROM products ORDER BY name ASC';
  const [products] = await pool.query(sql);
  return products;
};

export const updateProductById = async (productId: string, productData: Partial<ProductData>) => {
  const { name, size_ml, price, stock_quantity } = productData;
  const sql = `
    UPDATE products 
    SET name = ?, size_ml = ?, price = ?, stock_quantity = ? 
    WHERE id = ?
  `;
  await pool.query(sql, [name, size_ml, price, stock_quantity, productId]);

  return { id: productId, ...productData };
};

export const deleteProductById = async (productId: string) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  const [result] = await pool.query<ResultSetHeader>(sql, [productId]);
  return result.affectedRows;
};
