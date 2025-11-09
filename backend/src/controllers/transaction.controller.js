import { transactionService } from '../services/transaction.service.js';

export const createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.create(req.body);
    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAll();
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};