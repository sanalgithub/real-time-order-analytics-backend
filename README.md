# Real-Time Order Analytics Backend

A Node.js + TypeScript + Express + MongoDB backend for managing orders, viewing aggregated sales analytics, and receiving real-time order updates via Socket.io.

## Tech Stack

- Node.js, Express, TypeScript
- MongoDB with Mongoose
- Socket.io (real-time updates)
- express-validator (request validation)
- express-rate-limit (rate limiting)

## Prerequisites

- Node.js
- A MongoDB connection string
- MongoDB Atlas (replica sets enabled by default)

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/sanalgithub/real-time-order-analytics-backend.git
cd real-time-order-analytics-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server runs on (e.g. `3000`) |
| `APP_NAME` | Name of the application |
| `DB_NAME` | MongoDB database name |
| `MONGO_URI` | MongoDB connection string (Atlas or local) |



### 4. Run the development server

```bash
npm run dev
```


## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/orders` | Create a new order (rate-limited: 10 req/min per IP) |
| `GET` | `/api/orders` | List orders — supports `status`, `userId`, `page`, `limit` filters |
| `PATCH` | `/api/orders/:id/status` | Update an order's status |
| `GET` | `/api/analytics/sales-summary?range=7d` | Aggregated sales data (daily stats, top products, avg order value, status counts) |

`range` accepts values like `7d`, `30d`, `24h` — defaults to `7d` if omitted.

## Real-Time Updates (Socket.io)

Real-time events are broadcast to clients connected to the `admins` room.

