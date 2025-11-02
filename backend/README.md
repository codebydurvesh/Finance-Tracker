# 💰 Finance Tracker Backend API

Express.js REST API for the Finance Tracker application with advanced authentication, email verification, and comprehensive financial management.

## ✨ Features

- 🔐 JWT-based authentication
- 📧 Email OTP verification system
- 🔑 Google OAuth integration
- 💰 Transaction CRUD operations
- 📊 Financial summary calculations
- ⚙️ User profile management
- 🗑️ Secure account deletion
- 📨 Professional email templates
- 🛡️ Rate limiting and security

## 🛠 Tech Stack

- **Node.js** - Runtime environment
- **Express 5.1.0** - Web framework
- **MongoDB 8.19.2** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt 6.0.0** - Password hashing
- **Nodemailer 7.0.10** - Email service
- **Google Auth Library** - OAuth integration
- **CORS** - Cross-origin resource sharing

## 🚀 Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

3. **Configure `.env` file:**

   ```env
   # MongoDB Connection String
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority

   # JWT Secret Key (generate a secure random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

   # Server Port
   PORT=5000

   # Environment
   NODE_ENV=development

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

   # Email Configuration for OTP (Gmail)
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=Finance Tracker <your-email@gmail.com>

   # OTP Configuration
   OTP_EXPIRY_MINUTES=10
   OTP_MAX_ATTEMPTS=3
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   Server runs on: `http://localhost:5000`

5. **Test email configuration (Optional):**
   ```bash
   node testEmail.js
   ```

## 🔧 Environment Variables

| Variable             | Description                   | Example                             |
| -------------------- | ----------------------------- | ----------------------------------- |
| `MONGO_URI`          | MongoDB connection string     | `mongodb+srv://...`                 |
| `JWT_SECRET`         | Secret key for JWT tokens     | Random 64-char string               |
| `PORT`               | Server port                   | `5000`                              |
| `NODE_ENV`           | Environment mode              | `development` or `production`       |
| `GOOGLE_CLIENT_ID`   | Google OAuth client ID        | `xxx.apps.googleusercontent.com`    |
| `EMAIL_SERVICE`      | Email service provider        | `gmail`                             |
| `EMAIL_USER`         | Gmail address                 | `your-email@gmail.com`              |
| `EMAIL_PASSWORD`     | Gmail app password            | 16-character code                   |
| `EMAIL_FROM`         | Email sender name             | `Finance Tracker <email@gmail.com>` |
| `OTP_EXPIRY_MINUTES` | OTP expiration time           | `10`                                |
| `OTP_MAX_ATTEMPTS`   | Max OTP verification attempts | `3`                                 |

### 🔐 Generating a Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 📧 Setting up Gmail App Password

1. Enable 2-Factor Authentication on your Gmail account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and your device
4. Copy the 16-character password
5. Use it in `EMAIL_PASSWORD` (no spaces)

## 🗄️ MongoDB Setup Options

### Option 1: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster (M0 Free tier)
3. Create a database user with password
4. Add your IP to whitelist (or use `0.0.0.0/0` for all IPs)
5. Get your connection string from "Connect" → "Connect your application"
6. Replace `<password>` with your database password (URL encode special characters)
7. Update `MONGO_URI` in `.env`

**Important:** URL-encode special characters in password

- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`

### Option 2: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/finance-tracker` in `.env`

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint      | Description        | Auth Required |
| ------ | ------------- | ------------------ | ------------- |
| POST   | `/send-otp`   | Send OTP to email  | ❌            |
| POST   | `/verify-otp` | Verify OTP code    | ❌            |
| POST   | `/register`   | Register new user  | ❌            |
| POST   | `/login`      | User login         | ❌            |
| POST   | `/google`     | Google OAuth login | ❌            |
| GET    | `/me`         | Get current user   | ✅            |

### 👤 User Management (`/api/users`)

| Method | Endpoint                     | Description               | Auth Required |
| ------ | ---------------------------- | ------------------------- | ------------- |
| GET    | `/me`                        | Get user profile          | ✅            |
| PUT    | `/me`                        | Update profile            | ✅            |
| PUT    | `/budget`                    | Update monthly budget     | ✅            |
| PUT    | `/password`                  | Change password           | ✅            |
| POST   | `/change-email/send-otp`     | Send OTP for email change | ✅            |
| POST   | `/change-email/verify-otp`   | Verify and update email   | ✅            |
| POST   | `/delete-account/send-otp`   | Send OTP for deletion     | ✅            |
| POST   | `/delete-account/verify-otp` | Verify and delete account | ✅            |

### 💰 Transactions (`/api/transactions`)

| Method | Endpoint   | Description               | Auth Required |
| ------ | ---------- | ------------------------- | ------------- |
| GET    | `/`        | Get all user transactions | ✅            |
| GET    | `/summary` | Get financial summary     | ✅            |
| POST   | `/`        | Create new transaction    | ✅            |
| PUT    | `/:id`     | Update transaction        | ✅            |
| DELETE | `/:id`     | Delete transaction        | ✅            |

> 📝 For detailed request/response examples, see [API_TESTING.md](./API_TESTING.md)

## 📂 Project Structure

```
backend/
├── config/
│   ├── db.js              # MongoDB connection
│   └── emailConfig.js     # Nodemailer configuration
├── controllers/
│   ├── authController.js          # Auth logic (register, login, OTP)
│   ├── userController.js          # User management
│   ├── transactionController.js   # Transaction CRUD
│   └── googleAuthController.js    # Google OAuth
├── models/
│   ├── User.js            # User schema
│   ├── Transaction.js     # Transaction schema
│   └── OTP.js            # OTP verification schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   ├── userRoutes.js      # User endpoints
│   └── transactionRoutes.js  # Transaction endpoints
├── middleware/
│   └── authMiddleware.js  # JWT verification
├── services/
│   └── emailService.js    # Email templates & OTP generation
├── .env                   # Environment variables (DO NOT COMMIT)
├── .env.example          # Example env file
├── server.js             # Express server entry point
├── testEmail.js          # Email configuration tester
└── package.json          # Dependencies
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth (30-day expiration)
- **Password Hashing** - bcrypt with salt rounds
- **OTP Verification** - 6-digit codes with TTL index
- **Rate Limiting** - 60-second cooldown between OTP requests
- **Attempt Limiting** - Max 3 verification attempts per OTP
- **Email Validation** - Regex-based validation
- **CORS Configuration** - Controlled access
- **Environment Variables** - Secrets protection
- **MongoDB TTL Index** - Auto-expire old OTP records
- **Error Handling** - Centralized error middleware

## 📧 Email System

### Features

- Professional HTML email templates
- OTP generation and validation
- Rate limiting (60s cooldown)
- 10-minute OTP expiry
- Branded design matching app theme
- Mobile-responsive emails

### Email Types

1. **Registration OTP** - Purple gradient theme
2. **Account Deletion** - Red warning theme
3. **Email Change** - Verification theme

### Testing Email

```bash
node testEmail.js
```

## 🧪 Available Scripts

```bash
# Start production server
npm start

# Start development server with auto-reload
npm run dev

# Run tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Auto-fix lint issues
npm run lint:fix

# Test email configuration
node testEmail.js
```

## 🚀 Deployment

### Recommended: Render.com

1. Push code to GitHub
2. Create new Web Service on Render
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add all environment variables
5. Deploy!

### Alternative Platforms

- **Railway** - Simple deployment with GitHub
- **Heroku** - Classic PaaS platform
- **DigitalOcean App Platform** - Scalable hosting
- **Vercel** - Serverless functions (requires vercel.json)

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check connection string format
# Ensure IP whitelist includes your IP or 0.0.0.0/0
# Verify database user credentials
# URL-encode password special characters
```

### Email Not Sending

```bash
# Run email test
node testEmail.js

# Check Gmail app password (16 characters, no spaces)
# Verify 2FA is enabled on Gmail
# Check EMAIL_USER and EMAIL_PASSWORD in .env
```

### JWT Token Issues

```bash
# Ensure JWT_SECRET is set in .env
# Verify token is sent in Authorization header
# Check token expiration (default 30 days)
```

## 📝 API Response Format

### Success Response

```json
{
  "message": "Success message",
  "data": {
    /* response data */
  }
}
```

### Error Response

```json
{
  "message": "Error description",
  "stack": "Error stack (development only)"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📞 Support

For issues or questions:

- 📧 Email: durvesh.gaikwad08@gmail.com
- 📱 Phone: +91 9136608240

---

**© 2025-26 Finance Tracker Backend. All rights reserved.**
