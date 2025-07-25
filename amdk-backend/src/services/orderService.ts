// src/services/orderService.ts
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';


export const getAllOrders = async () => {
  const sql = `
    SELECT 
      o.id, o.order_number, o.status, o.total_amount, o.delivery_date,
      s.name as store_name 
    FROM orders o
    JOIN stores s ON o.store_id = s.id
    ORDER BY o.created_at DESC
  `;
  const [orders] = await pool.query(sql);
  return orders;
};

export const createNewOrder = async (orderData: any, userId: string) => {
  const { store_id, delivery_date, notes, items } = orderData;

  // 1. Siapkan ID dan Nomor Order Baru
  const newOrderId = uuidv4();
  const orderNumber = `ORD-${Date.now()}`;
  let totalAmount = 0;

  // NOTE: Di aplikasi production, semua proses ini harus dibungkus dalam 'database transaction'
  // untuk memastikan semua query berhasil atau semua dibatalkan jika ada yg gagal.

  // 2. Kalkulasi total harga & siapkan item-item
  const orderItemsData = [];
  for (const item of items) {
    // Ambil harga produk dari database
    const productSql = 'SELECT price FROM products WHERE id = ?';
    const [products]: any[] = await pool.query(productSql, [item.product_id]);

    if (products.length === 0) {
      throw new Error(`Product with id ${item.product_id} not found.`);
    }
    const productPrice = products[0].price;
    const subtotal = productPrice * item.quantity;
    totalAmount += subtotal;

    orderItemsData.push({
      id: uuidv4(),
      order_id: newOrderId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: productPrice,
      subtotal: subtotal,
    });
  }

  // 3. Simpan data utama ke tabel 'orders'
  const orderSql = `
    INSERT INTO orders (id, store_id, order_number, total_amount, delivery_date, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.query(orderSql, [newOrderId, store_id, orderNumber, totalAmount, delivery_date, notes, userId]);

  // 4. Simpan setiap item ke tabel 'order_items'
  const orderItemsSql = `
    INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
    VALUES ?
  `;
  const values = orderItemsData.map(item => [item.id, item.order_id, item.product_id, item.quantity, item.unit_price, item.subtotal]);
  await pool.query(orderItemsSql, [values]);

  return { orderId: newOrderId, orderNumber, totalAmount };
};

// Query ini menggabungkan tabel orders dan stores untuk mendapatkan nama toko
