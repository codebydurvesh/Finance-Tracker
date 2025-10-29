# Finance Tracker - MERN Stack

A full-stack web application to track monthly income and expenses, set budgets, and visualize spending patterns.

## Features

- 🔐 User authentication (Register/Login)
- 💰 Track income and expenses
- 📊 Visual analytics with pie charts
- 💸 Monthly budget setting
- ⚠️ Budget alerts when expenses exceed income
- ✏️ Edit and delete transactions
- 📱 Responsive design

## Tech Stack

**Frontend:**

- React.js
- React Router
- Chart.js / Recharts
- Axios
- CSS Modules

**Backend:**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt

## Project Structure

```
finance-tracker/
├── backend/          # Express API server
│   ├── models/       # Mongoose models
│   ├── routes/       # API routes
│   ├── middleware/   # Auth & validation
│   ├── config/       # Database & env config
│   └── server.js     # Entry point
│
└── frontend/         # React application
    ├── public/       # Static files
    └── src/
        ├── components/  # React components
        ├── pages/       # Page components
        ├── context/     # State management
        └── services/    # API calls
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

4. Create `.env` file in backend folder:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

5. Start the development servers:

   **Backend:**

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**

   ```bash
   cd frontend
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

Coming soon...

## Contributing

This is a learning project. Feel free to fork and experiment!

## License

ISC
