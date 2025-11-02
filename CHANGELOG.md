# Changelog

All notable changes to the Finance Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-02

### 🎉 Initial Release

#### Added - Authentication

- Email OTP verification system for registration
- 3-step registration flow (Email → OTP → Account Details)
- JWT-based authentication with 30-day token expiration
- Google OAuth integration for one-click sign-in
- Secure password hashing with bcrypt
- Login with email and password

#### Added - User Management

- User profile management (name updates)
- Email change with OTP verification
- Password change functionality
- Monthly budget setting and tracking
- Account deletion with OTP confirmation
- Danger zone for critical account actions

#### Added - Financial Features

- Transaction creation (income and expense)
- Transaction editing and deletion
- Category-based transaction organization
- Monthly transaction filtering
- Year and month selection
- Financial summary dashboard (income, expense, balance)
- Interactive pie charts for expense visualization
- Budget alerts when expenses exceed limits
- Real-time balance calculations

#### Added - Email System

- Professional HTML email templates
- OTP email verification (6-digit codes)
- 10-minute OTP expiry with TTL index
- 60-second rate limiting between OTP requests
- Maximum 3 verification attempts per OTP
- Account deletion warning emails
- Branded email design with gradient theme
- Mobile-responsive email layouts

#### Added - UI/UX

- Modern purple gradient theme (#667eea to #764ba2)
- Responsive mobile-first design
- Toast notifications for user feedback
- Loading states and animations
- Auto-focus and smart form handling
- OTP input with auto-advance
- Countdown timers for OTPs
- Password visibility toggle
- Glass-morphism effects with backdrop blur
- Professional footer with copyright and contact info
- Custom 404 error page
- Hover animations and transitions

#### Added - Pages & Components

- Dashboard with transaction list and summary
- Login page with Google Sign-In
- Register page with 3-step OTP flow
- Settings page with profile, security, and danger zone
- Email change modal with OTP verification
- Account deletion modal with warnings
- Reusable Footer component
- OTP Input component
- Transaction form and list components
- Summary cards for financial overview
- Budget section with edit capability

#### Added - Security

- JWT token authentication
- bcrypt password hashing (salt rounds)
- OTP verification system
- Rate limiting on OTP requests
- Attempt limiting (max 3 per OTP)
- Email validation with regex
- Password requirements (min 6 characters)
- CORS configuration
- Environment variable management
- MongoDB TTL indexes for auto-expiry
- Protected API routes

#### Added - API Endpoints

- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update profile
- `PUT /api/users/budget` - Update budget
- `PUT /api/users/password` - Change password
- `POST /api/users/change-email/send-otp` - Email change OTP
- `POST /api/users/change-email/verify-otp` - Verify email change
- `POST /api/users/delete-account/send-otp` - Deletion OTP
- `POST /api/users/delete-account/verify-otp` - Delete account
- `GET /api/transactions` - Get transactions
- `GET /api/transactions/summary` - Get summary
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

#### Added - Developer Experience

- Comprehensive README documentation
- API testing guide with examples
- Deployment guide for multiple platforms
- Email configuration test script
- Environment variable templates
- Google OAuth setup guide
- Project structure documentation
- Contributing guidelines
- Error handling and logging

#### Technical Stack

- **Frontend:** React 18.3.1, React Router 7.1.1, Chart.js, Axios, React Toastify
- **Backend:** Node.js, Express 5.1.0, MongoDB 8.19.2, Mongoose
- **Auth:** JWT, bcrypt 6.0.0, Google Auth Library
- **Email:** Nodemailer 7.0.10 with Gmail SMTP
- **Security:** CORS, Rate Limiting, OTP System

---

## [Unreleased]

### Planned Features

- Export transactions to CSV/PDF
- Recurring transactions
- Multiple currency support
- Budget categories and subcategories
- Bill reminders
- Financial goals tracking
- AI-powered insights
- Dark mode
- Multi-language support
- Mobile app (React Native)

---

## Version History

- **v1.0.0** (2025-11-02) - Initial release with full feature set

---

**© 2025-26 Finance Tracker. All rights reserved.**
