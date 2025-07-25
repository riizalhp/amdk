// src/index.ts
import express, { Request, Response } from 'express';
import authRoutes from './routes/authRoutes'; 
import storeRoutes from './routes/storeRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes'

const app = express();
const PORT = 3001;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Endpoint dasar
app.get('/', (req: Request, res: Response) => {
  res.send('Backend AMDK KU AIRKU berjalan! 🚀');
});

// Gunakan route otentikasi dengan prefix /api/auth
app.use('/api/auth', authRoutes); // <-- Gunakan route baru

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
