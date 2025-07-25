// src/config/database.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // Password default XAMPP
  database: 'amdk_db'
});

export default pool; // <-- Pastikan baris ini ada