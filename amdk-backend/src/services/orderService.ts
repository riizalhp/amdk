// src/services/orderService.ts
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

interface Product extends RowDataPacket {
  id: string;
  name: string;
  price: number;
}


interface ProductItem {
  product_id: string;
  quantity: number;
}

interface OrderData {
  store_id: string; // Keep as per existing createNewOrder
  delivery_date: string;
  notes?: string;
  items: ProductItem[];
  customer_id?: string; // Optional, to align with spec's orders table
  delivery_time_slot?: string; // Optional, to align with spec's orders table
}

interface OrderItemResult {
  product_id: string;
  product_name: string;
  size_ml: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

interface OrderResult {
  id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled';
  total_amount: number;
  delivery_date: string;
  delivery_time_slot?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  // Fields from joins
  store_name?: string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  created_by_user_id?: string;
  created_by_user_name?: string;
  assigned_driver_id?: string;
  assigned_driver_name?: string;
  items?: OrderItemResult[];
}

export const getOrderById = async (orderId: string) => {
  const orderSql = `
    SELECT
      o.id, o.order_number, o.status, o.total_amount, o.delivery_date, o.delivery_time_slot, o.notes,
      o.created_at, o.updated_at,
      s.name as store_name,
      c.id as customer_id, c.name as customer_name, c.phone as customer_phone, c.address as customer_address,
      u_created.id as created_by_user_id, u_created.full_name as created_by_user_name,
      u_assigned.id as assigned_driver_id, u_assigned.full_name as assigned_driver_name
    FROM orders o
    LEFT JOIN stores s ON o.store_id = s.id
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN users u_created ON o.created_by = u_created.id
    LEFT JOIN users u_assigned ON o.assigned_driver = u_assigned.id
    WHERE o.id = ?
  `;

  const [orders] = await pool.query(orderSql, [orderId]);
  const order = (orders as OrderResult[])[0];

  if (!order) {
    return null;
  }

  const itemsSql = `
    SELECT
      oi.product_id,
      p.name as product_name,
      p.size_ml,
      oi.quantity,
      oi.unit_price,
      oi.subtotal
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;
  const [items] = await pool.query(itemsSql, [orderId]);
  order.items = items as OrderItemResult[];

  return order;
};

export const getAllOrders = async () => {
  const sql = `
    SELECT
      o.id, o.order_number, o.status, o.total_amount, o.delivery_date, o.delivery_time_slot, o.notes,
      o.created_at, o.updated_at,
      s.name as store_name,
      c.id as customer_id, c.name as customer_name, c.phone as customer_phone, c.address as customer_address,
      u_created.id as created_by_user_id, u_created.full_name as created_by_user_name,
      u_assigned.id as assigned_driver_id, u_assigned.full_name as assigned_driver_name
    FROM orders o
    LEFT JOIN stores s ON o.store_id = s.id
    LEFT JOIN customers c ON o.customer_id = c.id
    LEFT JOIN users u_created ON o.created_by = u_created.id
    LEFT JOIN users u_assigned ON o.assigned_driver = u_assigned.id
    ORDER BY o.created_at DESC
  `;
  const [orders] = await pool.query(sql);
  return orders as OrderResult[];
};

export const createNewOrder = async (orderData: OrderData, userId: string) => {
  const { store_id, delivery_date, notes, items, customer_id, delivery_time_slot } = orderData;

  const newOrderId = uuidv4();
  const orderNumber = `ORD-${Date.now()}`;
  let totalAmount = 0;

  const connection = await pool.getConnection(); // Get a connection for transaction
  try {
    await connection.beginTransaction(); // Start transaction

    const orderItemsData = [];
    for (const item of items) {
      // Ambil harga produk dari database
      const productSql = 'SELECT id, name, price FROM products WHERE id = ?';
      const [products] = await connection.query<Product[]>(productSql, [item.product_id]); // Use connection for query

      if (products.length === 0) {
        throw new Error(`Product with id ${item.product_id} not found.`);
      }
      const product = products[0];
      const productPrice = product.price;
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

    // Simpan data utama ke tabel 'orders'
    // Menggabungkan store_id (dari kode lama) dan customer_id + delivery_time_slot (dari spesifikasi)
    const orderSql = `
      INSERT INTO orders (id, store_id, order_number, total_amount, delivery_date, delivery_time_slot, notes, created_by, customer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(orderSql, [
      newOrderId,
      store_id,
      orderNumber,
      totalAmount,
      delivery_date,
      delivery_time_slot || null,
      notes,
      userId,
      customer_id || null,
    ]);

    // Simpan setiap item ke tabel 'order_items'
    const orderItemsSql = `
      INSERT INTO order_items (id, order_id, product_id, quantity, unit_price, subtotal)
      VALUES ?
    `;
    const values = orderItemsData.map((item) => [
      item.id,
      item.order_id,
      item.product_id,
      item.quantity,
      item.unit_price,
      item.subtotal,
    ]);
    await connection.query(orderItemsSql, [values]); // Use connection for query

    await connection.commit(); // Commit transaction
    return { orderId: newOrderId, orderNumber, totalAmount, ...orderData };
  } catch (error) {
    await connection.rollback(); // Rollback on error
    throw error;
  } finally {
    connection.release(); // Release the connection
  }
};
