// src/services/authService.ts

import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
}

interface UserData {
  full_name: string;
  email: string;
  password?: string;
  role?: string;
}

interface AuthCredentials {
  email: string;
  password?: string;
}

export const registerNewUser = async (userData: UserData) => {
  const { full_name, email, password, role = 'user' } = userData;

  if (!password) {
    throw new Error('Password is required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUserId = uuidv4();

  const sql = 'INSERT INTO users (id, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)';
  await pool.query(sql, [newUserId, full_name, email, hashedPassword, role]);

  return { id: newUserId, full_name, email, role };
};

export const loginUser = async (credentials: AuthCredentials) => {
  const { email, password } = credentials;

  // 1. Cari user berdasarkan email
  const sql = 'SELECT * FROM users WHERE email = ?';
  const [users] = await pool.query<User[]>(sql, [email]);

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
    role: user.role,
  };

  const secret = process.env.JWT_SECRET || 'fallback-secret';
  const token = jwt.sign(payload, secret, { expiresIn: '1d' });

  return { token };
};
