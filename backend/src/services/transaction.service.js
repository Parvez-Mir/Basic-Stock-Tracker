import pool from '../config/database.js';
import { AppError } from '../utils/error-handler.js';

export const transactionService = {
  async create({ productId, type, quantity, notes }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      
      // Check if product exists and calculate current stock
      const [products] = await conn.query(`
        SELECT 
          p.id,
          p.name,
          (
            SELECT COALESCE(SUM(
              CASE 
                WHEN type = 'INBOUND' THEN quantity 
                WHEN type = 'OUTBOUND' THEN -quantity 
              END
            ), 0)
            FROM stock_transactions 
            WHERE product_id = p.id
          ) as current_stock
        FROM products p 
        WHERE p.id = ?
      `, [productId]);

      if (products.length === 0) {
        throw new AppError('Product not found', 404);
      }

      const product = products[0];
      
      // Check stock for outbound transactions
      if (type === 'OUTBOUND' && product.current_stock < quantity) {
        throw new AppError(
          `Insufficient stock. Only ${product.current_stock} units available for ${product.name}`,
          400
        );
      }

      // Create transaction
      const [result] = await conn.query(
        'INSERT INTO stock_transactions (product_id, type, quantity, notes) VALUES (?, ?, ?, ?)',
        [productId, type, quantity, notes]
      );

      await conn.commit();

      // Get created transaction with product details
      const [transactions] = await conn.query(`
        SELECT 
          st.id,
          st.product_id,
          st.type,
          st.quantity,
          st.notes,
          st.created_at,
          p.name as product_name,
          p.sku,
          (
            SELECT COALESCE(SUM(
              CASE 
                WHEN type = 'INBOUND' THEN quantity 
                WHEN type = 'OUTBOUND' THEN -quantity 
              END
            ), 0)
            FROM stock_transactions 
            WHERE product_id = st.product_id
          ) as current_stock
        FROM stock_transactions st
        JOIN products p ON p.id = st.product_id
        WHERE st.id = ?
      `, [result.insertId]);

      return transactions[0];

    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },

  async getAll() {
    try {
      const [rows] = await pool.query(`
        SELECT 
          st.id,
          st.product_id,
          st.type,
          st.quantity,
          st.notes,
          st.created_at,
          p.name as product_name,
          p.sku,
          (
            SELECT COALESCE(SUM(
              CASE 
                WHEN type = 'INBOUND' THEN quantity 
                WHEN type = 'OUTBOUND' THEN -quantity 
              END
            ), 0)
            FROM stock_transactions 
            WHERE product_id = st.product_id
          ) as current_stock
        FROM stock_transactions st
        JOIN products p ON p.id = st.product_id
        ORDER BY st.created_at DESC
      `);
      
      return rows;
    } catch (error) {
      throw new AppError('Failed to fetch transactions: ' + error.message, 500);
    }
  }
};