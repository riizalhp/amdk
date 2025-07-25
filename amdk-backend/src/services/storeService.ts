// src/services/storeService.ts
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';

export const createNewStore = async (storeData: any) => {
  const { name, phone, email, address } = storeData;
  const newStoreId = uuidv4();

  const sql = `
    INSERT INTO stores (id, name, phone, email, address)
    VALUES (?, ?, ?, ?, ?)
  `;
  await pool.query(sql, [newStoreId, name, phone, email, address]);


  return { id: newStoreId, ...storeData };
};

export const getAllStores = async () => {
  const sql = 'SELECT id, name, phone, email, address, created_at FROM stores ORDER BY created_at DESC';
  const [stores] = await pool.query(sql);
  return stores;
};

export const updateStoreById = async (storeId: string, storeData: any) => {
  const { name, phone, email, address } = storeData;
  const sql = `
    UPDATE stores 
    SET name = ?, phone = ?, email = ?, address = ? 
    WHERE id = ?
  `;
  await pool.query(sql, [name, phone, email, address, storeId]);
  
  return { id: storeId, ...storeData };
};

export const deleteStoreById = async (storeId: string) => {
  const sql = 'DELETE FROM stores WHERE id = ?';
  const [result]: any = await pool.query(sql, [storeId]);
  
  return result.affectedRows;
};