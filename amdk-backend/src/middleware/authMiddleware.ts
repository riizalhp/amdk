// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  role: string;
}
// Menambahkan properti 'user' ke interface Request Express
export interface AuthRequest extends Request {
  user?: TokenPayload; 
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }
    // 3. TypeScript sekarang tahu 'user' cocok dengan TokenPayload
    req.user = user as TokenPayload; 
    next();
  });
};