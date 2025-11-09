# 📦 Basic-stock-tracker

A full-stack inventory management system for tracking products and stock transactions in real-time.

## 🚀 Features

- Real-time dashboard with inventory analytics
- Product management (CRUD operations)
- Stock transaction tracking (Inbound/Outbound)
- Low stock alerts
- Responsive UI with charts and visualizations

## 🛠️ Tech Stack

**Frontend:** Next.js 15, React, Tailwind CSS, Recharts  
**Backend:** Node.js, Express, MySQL, Zod validation  
**Deployment:** Vercel (Frontend), Render (Backend), Aiven (MySQL)

## 📋 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd stock-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5001
NODE_ENV=local
ALLOWED_ORIGINS=http://localhost:3000

# Database Configuration
DB_HOST=<your-mysql-host>
DB_PORT=<your-mysql-port>
DB_USER=<your-mysql-username>
DB_PASSWORD=<your-mysql-password>
DB_NAME=stock_tracker
```

Initialize the database:

```bash
npm run db:init
```

Start the backend server:

```bash
npm run dev
```

Backend will run on `http://localhost:5001`

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to: `http://localhost:3000`

## 🗄️ Database Schema

**products**
- `id` (PK), `sku` (unique), `name`, `unit_price`, `created_at`, `updated_at`

**stock_transactions**
- `id` (PK), `product_id` (FK), `type` (ENUM: INBOUND/OUTBOUND), `quantity`, `notes`, `created_at`

**Relationship:** One product → Many transactions (1:N)

Current stock = SUM(INBOUND) - SUM(OUTBOUND)

## 📡 API Endpoints

**Products**
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Transactions**
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create transaction

## 🔐 Authentication

Dummy authentication (static email display only)