import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { ResultSetHeader } from 'mysql2';

interface FleetData {
  name: string;
  type?: string;
  capacity?: number;
  unit?: string;
}

export const createFleet = async (fleetData: FleetData) => {
  const { name, type, capacity, unit } = fleetData;
  const id = uuidv4();
  const sql = 'INSERT INTO fleets (id, name, type, capacity, unit) VALUES (?, ?, ?, ?, ?)';
  await pool.query(sql, [id, name, type || null, capacity || null, unit || null]);
  return { id, name, type, capacity, unit };
};

export const getAllFleets = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM fleets');
    return rows;
  } catch (error) {
    console.error('Error in getAllFleets service:', error);
    throw error;
  }
};

export const deleteFleet = async (id: string) => {
  const sql = 'DELETE FROM fleets WHERE id = ?';
  const [result] = await pool.query<ResultSetHeader>(sql, [id]);
  return result.affectedRows > 0;
};

export const updateFleet = async (id: string, fleetData: Partial<FleetData>) => {
  const fields = [];
  const values = [];

  if (fleetData.name) {
    fields.push('name = ?');
    values.push(fleetData.name);
  }
  if (fleetData.type) {
    fields.push('type = ?');
    values.push(fleetData.type);
  }
  if (fleetData.capacity) {
    fields.push('capacity = ?');
    values.push(fleetData.capacity);
  }
  if (fleetData.unit) {
    fields.push('unit = ?');
    values.push(fleetData.unit);
  }

  if (fields.length === 0) {
    return false; // Nothing to update
  }

  values.push(id);
  const sql = `UPDATE fleets SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.query<ResultSetHeader>(sql, values);
  return result.affectedRows > 0;
};
