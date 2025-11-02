# 💰 Finance Tracker - MERN Stack Application

A secure, feature-rich full-stack web application for personal finance management with advanced authentication, email verification, and comprehensive transaction tracking.

## ✨ Features

### 🔐 Authentication & Security

- **Email OTP Verification** - Secure 3-step registration with email verification
- **JWT Authentication** - Token-based secure sessions
- **Google OAuth** - One-click Google Sign-In integration
- **Password Security** - bcrypt hashing for password protection
- **Account Management** - Change email with OTP verification, delete account with confirmation

### 💰 Financial Management

- **Income & Expense Tracking** - Categorized transaction management
- **Monthly Budget Setting** - Set and track monthly spending limits
- **Visual Analytics** - Interactive pie charts for spending patterns
- **Budget Alerts** - Real-time warnings when expenses exceed budget
- **Transaction Management** - Create, edit, and delete transactions
- **Category Filtering** - Organize by custom categories

### 📧 Email Integration

- **OTP Email Verification** - Registration, email change, and account deletion
- **Professional Email Templates** - Branded HTML emails with gradient design
- **Rate Limiting** - 60-second cooldown between OTP requests
- **10-Minute Expiry** - Secure OTP timeout
- **3 Attempt Limit** - Security against brute force

### 🎨 User Experience

- **Responsive Design** - Mobile-first, works on all devices
- **Month Selection** - View transactions by specific months
- **Real-time Updates** - Instant balance and summary calculations
- **Toast Notifications** - User-friendly feedback messages
- **Professional Footer** - Copyright and contact information
- **404 Page** - Custom not found page

### ⚙️ Settings & Profile

- **Profile Management** - Update name and personal information
- **Email Change** - OTP-verified email updates
- **Password Change** - Secure password updates
- **Danger Zone** - Account deletion with OTP confirmation
- **Google Account Support** - Special handling for OAuth users

## 🛠 Tech Stack

**Frontend:**

- React 18.3.1 - UI framework
- React Router 7.1.1 - Client-side routing
- Chart.js / Recharts - Data visualization
- Axios - HTTP client
- React Toastify - Notifications
- Google OAuth - Authentication
- CSS3 - Custom styling with gradients

**Backend:**

- Node.js - Runtime environment
- Express 5.1.0 - Web framework
- MongoDB 8.19.2 - Database
- Mongoose - ODM for MongoDB
- JWT - Token-based authentication
- bcrypt 6.0.0 - Password hashing
- Nodemailer 7.0.10 - Email service
- Google Auth Library - OAuth integration

**Security & Validation:**

- OTP System - Email verification
- Rate Limiting - API protection
- CORS - Cross-origin configuration
- Environment Variables - Secret management

## 📁 Project Structure

```
finance-tracker/
├── backend/                 # Express API server
│   ├── config/             # Configuration files
│   │   ├── db.js          # MongoDB connection
│   │   └── emailConfig.js # Email service setup
│   ├── controllers/        # Route controllers
│   │   ├── authController.js        # Authentication logic
│   │   ├── userController.js        # User management
│   │   ├── transactionController.js # Transaction CRUD
│   │   └── googleAuthController.js  # Google OAuth
│   ├── models/            # Mongoose schemas
│   │   ├── User.js       # User model
│   │   ├── Transaction.js # Transaction model
│   │   └── OTP.js        # OTP verification model
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── transactionRoutes.js
│   ├── middleware/       # Custom middleware
│   │   └── authMiddleware.js  # JWT verification
│   ├── services/         # Business logic
│   │   └── emailService.js    # Email templates & OTP
│   ├── .env             # Environment variables
│   ├── server.js        # Entry point
│   └── package.json
│
└── frontend/            # React application
    ├── public/
    │   └── index.html
    └── src/
        ├── components/      # Reusable components
        │   └── Footer/     # Footer component
        ├── pages/          # Page components
        │   ├── Dashboard/  # Main dashboard
        │   ├── Login/      # Login page
        │   ├── Register/   # 3-step registration
        │   ├── Settings/   # User settings
        │   └── NotFound/   # 404 page
        ├── context/        # State management
        │   └── AuthContext.jsx
        ├── services/       # API integration
        │   ├── api.js
        │   ├── authService.js
        │   ├── userService.js
        │   └── transactionService.js
        ├── utils/          # Utility functions
        │   └── helpers.js
        ├── App.js
        └── index.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email service
- Google Cloud Console account (for OAuth)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/codebydurvesh/Finance-Tracker.git
   cd finance-tracker
   ```

2. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Backend Environment Variables**

   Create `.env` file in `backend/` folder:

   ```env
   # MongoDB Connection
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

   # Email Configuration (Gmail)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password
   EMAIL_FROM=Finance Tracker <your-email@gmail.com>

   # OTP Configuration
   OTP_EXPIRY_MINUTES=10
   OTP_MAX_ATTEMPTS=3
   ```

5. **Configure Frontend Environment Variables**

   Create `.env` file in `frontend/` folder:

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

6. **Set up Gmail App Password** (for email OTP)

   - Enable 2-Factor Authentication on your Gmail account
   - Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Generate an app password for "Mail"
   - Use this 16-character password in `EMAIL_PASSWORD`

7. **Set up Google OAuth** (for Google Sign-In)

   - See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed instructions

8. **Start the development servers:**

   **Backend (Terminal 1):**

   ```bash
   cd backend
   npm run dev
   ```

   Server runs on: `http://localhost:5000`

   **Frontend (Terminal 2):**

   ```bash
   cd frontend
   npm start
   ```

   App runs on: `http://localhost:3000`

9. **Test Email Configuration** (Optional but recommended)
   ```bash
   cd backend
   node testEmail.js
   ```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP code
- `POST /api/auth/register` - Register new user (requires verified email)
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user

### User Management (Protected)

- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update profile
- `PUT /api/users/budget` - Update monthly budget
- `PUT /api/users/password` - Change password
- `POST /api/users/change-email/send-otp` - Send OTP for email change
- `POST /api/users/change-email/verify-otp` - Verify and update email
- `POST /api/users/delete-account/send-otp` - Send OTP for account deletion
- `POST /api/users/delete-account/verify-otp` - Verify and delete account

### Transactions (Protected)

- `GET /api/transactions` - Get all user transactions
- `GET /api/transactions/summary` - Get financial summary
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

> For detailed API testing examples, see [backend/API_TESTING.md](./backend/API_TESTING.md)

## 🔐 Security Features

- **JWT Authentication** - Secure token-based auth with 30-day expiration
- **Password Hashing** - bcrypt with salt rounds
- **OTP Verification** - 6-digit codes with 10-minute TTL
- **Rate Limiting** - 60-second cooldown between OTP requests
- **Attempt Limiting** - Maximum 3 verification attempts per OTP
- **Email Validation** - Regex-based validation
- **Password Requirements** - Minimum 6 characters
- **CORS Configuration** - Controlled cross-origin access
- **Environment Variables** - Secrets never exposed in code
- **MongoDB TTL Index** - Auto-expire OTP records

## 🎨 UI/UX Features

- **Purple Gradient Theme** - Modern gradient design (#667eea to #764ba2)
- **Responsive Layout** - Mobile-first approach
- **Toast Notifications** - Real-time user feedback
- **Loading States** - Visual feedback during operations
- **Form Validation** - Client-side and server-side validation
- **Password Visibility Toggle** - Eye icon for password fields
- **Auto-focus** - Smart focus management in forms
- **OTP Auto-advance** - Automatic cursor movement in OTP input
- **Countdown Timers** - Visual time remaining for OTPs
- **Glass-morphism Effects** - Modern UI with backdrop blur
- **Hover Animations** - Interactive button states
- **Error Handling** - User-friendly error messages

## 📱 Pages & Components

### Pages

1. **Login** - Email/password + Google Sign-In
2. **Register** - 3-step process (Email → OTP → Details)
3. **Dashboard** - Transaction list, summary cards, charts, month selector
4. **Settings** - Profile, email change, password change, danger zone
5. **404 Not Found** - Custom error page

### Key Components

- **OTPInput** - 6-digit code entry with paste support
- **TransactionForm** - Add/edit transactions
- **TransactionList** - Display and manage transactions
- **SummaryCards** - Income, expense, balance overview
- **BudgetSection** - Set and display monthly budget
- **Footer** - Copyright and contact information
- **Modals** - Email change, account deletion confirmations

## 🚀 Deployment

### Backend (Recommended: Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository, set root to `backend/`
4. Add all environment variables
5. Deploy!

### Frontend (Recommended: Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Set root directory to `frontend/`
4. Add environment variables
5. Deploy!

> For detailed deployment instructions, see deployment guide in repository

## 📧 Email Templates

The application includes professionally designed HTML email templates:

- **OTP Verification** - Purple gradient header, code box, security warnings
- **Account Deletion** - Red-themed warning template
- **Responsive Design** - Mobile-friendly email layouts
- **Branding** - Consistent with app theme

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Test email configuration
node testEmail.js
```

## 🤝 Contributing

This project is open for contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 👨‍💻 Author

**Durvesh Gaikwad**

- 📧 Email: durvesh.gaikwad08@gmail.com
- 📱 Phone: +91 9136608240

## 🙏 Acknowledgments

- Built as a learning project to demonstrate MERN stack capabilities
- Special thanks to the open-source community
- Icons and design inspiration from modern finance apps

## 📸 Screenshots

![Login page png](image.png)
![Registeration page png](image-1.png)
![Dashboard page png 1](image-2.png)
![Dashboard page png 2](image-3.png)
![Setting page png](image-4.png)

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Export transactions to CSV/PDF
- [ ] Recurring transactions
- [ ] Multiple currency support
- [ ] Budget categories and subcategories
- [ ] Bill reminders and notifications
- [ ] Financial goals tracking
- [ ] AI-powered spending insights
- [ ] Dark mode
- [ ] Multi-language support

## 📞 Support

For support, email durvesh.gaikwad08@gmail.com or create an issue in the repository.

---

**© 2025-26 Finance Tracker. All rights reserved.**

Made by CodeByDurvesh
