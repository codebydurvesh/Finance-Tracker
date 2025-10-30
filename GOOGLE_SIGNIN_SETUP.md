# Quick Setup: Google Sign-In

## ⚠️ IMPORTANT: Follow these steps to enable Google Sign-In

### Step 1: Get Google OAuth Client ID

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
5. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: **Finance Tracker**
   - User support email: (your email)
   - Developer contact: (your email)
   - Click **Save and Continue** (skip scopes, test users)
6. For Application type, select: **Web application**
7. Name: **Finance Tracker Web Client**
8. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:5000
   ```
9. Click **CREATE**
10. **Copy the Client ID** (looks like: `123456-abc.apps.googleusercontent.com`)

### Step 2: Configure Environment Variables

#### Frontend (.env file)

Edit: `frontend/.env`

```env
REACT_APP_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
REACT_APP_API_URL=http://localhost:5000
```

#### Backend (.env file)

Edit: `backend/.env`

```env
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
```

**⚠️ Use the SAME Client ID in both files!**

### Step 3: Restart Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 4: Test

1. Navigate to http://localhost:3000/login
2. You should see "Sign in with Google" button
3. Click it and select your Google account
4. You should be logged in!

## Troubleshooting

### Error: "The server cannot process the request because it is malformed"

- **Cause**: Invalid or missing Client ID
- **Fix**: Make sure you replaced `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID from Step 1

### Button shows "Google Sign-In not configured"

- **Cause**: Client ID not set in `.env` file
- **Fix**: Follow Step 2 above

### Error: "redirect_uri_mismatch"

- **Cause**: Authorized origins not configured
- **Fix**: Add `http://localhost:3000` to Authorized JavaScript origins in Google Cloud Console

### Still not working?

1. Check browser console for errors (F12)
2. Verify `.env` files are saved (restart servers after editing)
3. Make sure both frontend and backend are running
4. Clear browser cache and try again
