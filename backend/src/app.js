import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import productRoutes from './routes/product.routes.js';
import transactionRoutes from './routes/transaction.routes.js';

const app = express();

const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, server-to-server, etc.
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`❌ Blocked by CORS: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Optional, only if you use cookies or tokens
  })
);

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port ${env.PORT}`);
  console.log('🌍 Allowed origins:', allowedOrigins);
});
