# Pages Folder Structure

This document describes the refactored page structure for better organization and maintainability.

## Overview

Each page now has its own folder containing:

- `index.jsx` - Main page component
- `PageName.css` - Page-specific styles
- `components/` - Sub-components specific to that page

## New Structure

```
src/pages/
├── Dashboard/
│   ├── index.jsx                 # Main Dashboard component
│   ├── Dashboard.css             # Dashboard styles
│   └── components/
│       ├── DashboardHeader.jsx   # Header with user info and navigation
│       ├── BudgetSection.jsx     # Monthly budget display and editing
│       ├── SummaryCards.jsx      # Income/Expense/Balance cards
│       ├── TransactionForm.jsx   # Add transaction form with validation
│       └── TransactionsPreview.jsx # Recent transactions display
│
├── Settings/
│   ├── index.jsx                 # Main Settings component
│   ├── Settings.css              # Settings styles
│   └── components/
│       ├── SettingsHeader.jsx    # Settings page header
│       ├── ProfileForm.jsx       # Profile update form
│       ├── PasswordForm.jsx      # Password change form
│       └── GoogleInfo.jsx        # Google account info display
│
├── Login/
│   ├── index.jsx                 # Main Login component
│   ├── Login.css                 # Login styles
│   └── components/
│       ├── LoginForm.jsx         # Email/password login form
│       └── GoogleLoginButton.jsx # Google OAuth button
│
├── Register/
│   ├── index.jsx                 # Main Register component
│   ├── Register.css              # Register styles
│   └── components/
│       └── RegisterForm.jsx      # Registration form
│
└── NotFound/
    ├── index.jsx                 # 404 page
    └── NotFound.css              # 404 page styles
```

## Benefits

### 1. **Better Organization**

- Each page has its own dedicated folder
- Related components are grouped together
- Clear separation of concerns

### 2. **Improved Maintainability**

- Easier to find and modify page-specific components
- Reduced file size (main pages are now under 400 lines)
- Self-contained components with clear responsibilities

### 3. **Reusability**

- Components can be easily reused within the same page
- Clear component boundaries make it easier to extract to shared components if needed

### 4. **Scalability**

- Easy to add new components to a page
- Simple to add new pages following the same structure
- Better for team collaboration

## Component Breakdown

### Dashboard Components

**DashboardHeader**

- Props: `userName`, `onLogout`
- Displays user greeting
- Settings and Logout buttons

**BudgetSection**

- Props: `monthlyBudget`, `onUpdateBudget`
- Budget display with edit mode
- Budget update functionality

**SummaryCards**

- Props: `summary`, `monthlyBudget`
- Displays three cards: Income, Expense, Balance
- Color-coded based on financial health

**TransactionForm**

- Props: `onSubmit`, `loading`, `selectedYear`, `selectedMonth`
- Complete transaction entry form
- Category selection with custom category support
- Form validation

**TransactionsPreview**

- Props: `transactions`
- Shows recent 5 transactions
- Only displayed for current month

### Settings Components

**SettingsHeader**

- Back to Dashboard button
- Settings title and description

**ProfileForm**

- Props: `user`, `onSubmit`, `isGoogleUser`
- Name and email editing
- Google account protection

**PasswordForm**

- Props: `onSubmit`
- Password change with validation
- Password visibility toggles

**GoogleInfo**

- Information display for Google authenticated users

### Login Components

**LoginForm**

- Props: `onSubmit`, `loading`
- Email and password inputs
- Real-time email validation
- Password visibility toggle

**GoogleLoginButton**

- Props: `onGoogleLogin`
- Google OAuth integration
- Handles Google Sign-In script loading

### Register Components

**RegisterForm**

- Props: `onSubmit`, `loading`
- Full registration form
- Password confirmation
- Form validation

## Import Pattern

All pages can be imported the same way as before:

```javascript
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
```

The `index.jsx` file in each folder is automatically resolved.

## Future Improvements

1. Consider moving commonly used components to `src/components/common/`
2. Add PropTypes or TypeScript for better type safety
3. Create a `hooks/` folder within each page for custom hooks
4. Add unit tests for each component

## Migration Notes

- All old single-file pages have been removed
- CSS files have been moved to their respective folders
- No changes needed in `App.jsx` - imports work the same way
- All functionality preserved, just better organized
