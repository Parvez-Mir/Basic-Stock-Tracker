import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import productRoutes from './routes/product.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(',')
}));

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});