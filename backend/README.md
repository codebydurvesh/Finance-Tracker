# Finance Tracker Backend

Express.js REST API for the Finance Tracker application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB connection string:

   - **Local MongoDB**: `mongodb://localhost:27017/finance-tracker`
   - **MongoDB Atlas**: Get your connection string from MongoDB Atlas

4. Start the development server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Environment Variables

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (development/production)

## MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended for beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGO_URI` in `.env`

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/finance-tracker` in `.env`

## API Endpoints (Coming Soon)

- `GET /` - API health check
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/users/me` - Get user profile
- `PUT /api/users/budget` - Update monthly budget

## Tech Stack

- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- CORS enabled
