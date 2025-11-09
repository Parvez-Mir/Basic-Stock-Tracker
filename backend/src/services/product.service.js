import pool from '../config/database.js';
import { AppError } from '../utils/error-handler.js';

export const productService = {
  async getAll() {
    const sql = `
      SELECT p.*, 
        COALESCE(SUM(CASE 
          WHEN st.type = 'INBOUND' THEN st.quantity 
          WHEN st.type = 'OUTBOUND' THEN -st.quantity 
          ELSE 0 
        END), 0) AS current_stock
      FROM products p
      LEFT JOIN stock_transactions st ON st.product_id = p.id
      GROUP BY p.id
      ORDER BY p.id DESC
    `;
    const [rows] = await pool.query(sql);
    return rows;
  },

  async getById(id) {
    const sql = `
      SELECT p.*, 
        COALESCE(SUM(CASE 
          WHEN st.type = 'INBOUND' THEN st.quantity 
          WHEN st.type = 'OUTBOUND' THEN -st.quantity 
          ELSE 0 
        END), 0) AS current_stock
      FROM products p
      LEFT JOIN stock_transactions st ON st.product_id = p.id
      WHERE p.id = ?
      GROUP BY p.id
    `;
    const [rows] = await pool.query(sql, [id]);
    if (!rows[0]) {
      throw new AppError('Product not found', 404);
    }
    return rows[0];
  },

  async create({ sku, name, unitPrice }) {
    try {
      // Check if SKU already exists
      const checkSql = 'SELECT id FROM products WHERE sku = ?';
      const [existing] = await pool.query(checkSql, [sku]);
      
      if (existing.length > 0) {
        throw new AppError('This SKU is already taken. Please use a different SKU.', 409);
      }

      const sql = 'INSERT INTO products (sku, name, unit_price) VALUES (?, ?, ?)';
      const [result] = await pool.query(sql, [sku, name, unitPrice]);
      return this.getById(result.insertId);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      // Handle MySQL duplicate key error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('This SKU is already taken. Please use a different SKU.', 409);
      }
      throw new AppError('Unable to create product. Please try again later.', 500);
    }
  },

  async update(id, { sku, name, unitPrice }) {
    try {
      // Check if product exists
      const checkProduct = 'SELECT id FROM products WHERE id = ?';
      const [productExists] = await pool.query(checkProduct, [id]);
      
      if (productExists.length === 0) {
        throw new AppError('Product not found', 404);
      }

      // Check if SKU is taken by another product
      const checkSku = 'SELECT id FROM products WHERE sku = ? AND id != ?';
      const [skuExists] = await pool.query(checkSku, [sku, id]);
      
      if (skuExists.length > 0) {
        throw new AppError('This SKU is already taken. Please use a different SKU.', 409);
      }

      const sql = 'UPDATE products SET sku = ?, name = ?, unit_price = ? WHERE id = ?';
      await pool.query(sql, [sku, name, unitPrice, id]);
      return this.getById(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      // Handle MySQL duplicate key error
      if (error.code === 'ER_DUP_ENTRY') {
        throw new AppError('This SKU is already taken. Please use a different SKU.', 409);
      }
      throw new AppError('Unable to update product. Please try again later.', 500);
    }
  },

  async delete(id) {
    try {
      // Check if product exists
      const checkProduct = 'SELECT id FROM products WHERE id = ?';
      const [productExists] = await pool.query(checkProduct, [id]);
      
      if (productExists.length === 0) {
        throw new AppError('This product no longer exists.', 404);
      }

      // Check if product has transactions
      const checkTransactions = 'SELECT id FROM stock_transactions WHERE product_id = ? LIMIT 1';
      const [hasTransactions] = await pool.query(checkTransactions, [id]);
      
      if (hasTransactions.length > 0) {
        throw new AppError('This product cannot be deleted because it has existing transactions.', 409);
      }

      const sql = 'DELETE FROM products WHERE id = ?';
      const [result] = await pool.query(sql, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      // Handle MySQL foreign key constraint error
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        throw new AppError('This product cannot be deleted because it has existing transactions.', 409);
      }
      throw new AppError('Unable to delete product. Please try again later.', 500);
    }
  }
};