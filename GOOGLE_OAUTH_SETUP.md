# Google OAuth Setup Guide

## Steps to Enable Google Sign-In

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen if prompted:
   - User Type: External
   - App name: Finance Tracker
   - User support email: your email
   - Developer contact email: your email
6. For Application type, select **Web application**
7. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:5000`
8. Add Authorized redirect URIs (if needed):
   - `http://localhost:3000`
   - `http://localhost:5000/api/auth/google`
9. Click **Create**
10. Copy the **Client ID**

### 2. Configure Backend

1. Copy `backend/.env.example` to `backend/.env`
2. Add your Google Client ID:
   ```
   GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

### 3. Configure Frontend

1. Copy `frontend/.env.example` to `frontend/.env`
2. Add your Google Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

### 4. Restart Servers

1. Restart the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Restart the frontend server:
   ```bash
   cd frontend
   npm start
   ```

### 5. Test Google Sign-In

1. Navigate to the login page
2. Click "Sign in with Google"
3. Select your Google account
4. You should be redirected to the dashboard

## Features Implemented

- ✅ Google OAuth Sign-In button on login page
- ✅ Real-time email validation with visual feedback
- ✅ Backend Google authentication endpoint
- ✅ User creation/login via Google account
- ✅ Profile picture support from Google
- ✅ Secure token-based authentication

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for sensitive data
- Client IDs should be kept secure but are not as sensitive as client secrets
- For production, update authorized origins and redirect URIs accordingly
