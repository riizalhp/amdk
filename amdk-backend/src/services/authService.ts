// src/services/authService.ts

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import jwt from 'jsonwebtoken';

export const registerNewUser = async (userData: any) => {
  // ... (kode registrasi yang sudah ada)
};

// V PASTIKAN KATA 'EXPORT' ADA DI SINI V
export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;

  // 1. Cari user berdasarkan email
  const sql = 'SELECT * FROM users WHERE email = ?';
  const [users]: any[] = await pool.query(sql, [email]);

  if (users.length === 0) {
    throw new Error('Invalid credentials');
  }
  const user = users[0];

  // 2. Bandingkan password
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  // 3. Buat JWT Token
  const payload = {
    userId: user.id,
    role: user.role
  };

  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const token = jwt.sign(payload, secret, { expiresIn: '1d' });

  return { token };
};