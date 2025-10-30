# Fix Google OAuth Errors

## Error: "The given origin is not allowed for the given client ID"

This error occurs because `http://localhost:3000` is not authorized in your Google Cloud Console.

### Solution - Add Authorized Origins:

1. **Go to Google Cloud Console:**

   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Select Your Project:**

   - Click on the project dropdown at the top
   - Select your "Finance Tracker" project (or whatever you named it)

3. **Configure OAuth Client:**

   - Click on your OAuth 2.0 Client ID (it should show your Client ID: `930383749959-15stula535fh0rjdobfh2nocpof48n8r`)
   - Scroll down to **"Authorized JavaScript origins"** section
   - Click **"+ ADD URI"**
   - Add the following URIs:
     ```
     http://localhost:3000
     http://localhost:5000
     ```

4. **Configure Authorized Redirect URIs:**

   - Scroll down to **"Authorized redirect URIs"** section
   - Click **"+ ADD URI"**
   - Add the following URIs:
     ```
     http://localhost:3000
     http://localhost:5000/api/auth/google
     ```

5. **Save Changes:**

   - Click the **"SAVE"** button at the bottom
   - Wait a few minutes for changes to propagate (usually instant, but can take up to 5 minutes)

6. **Refresh Your Browser:**
   - Clear browser cache (Ctrl + Shift + Delete)
   - Refresh the login page (Ctrl + F5)
   - Try Google Sign-In again

---

## Error: "Failed to load resource: 403"

This is related to the same origin issue. Once you add the authorized origins above, this error will also be resolved.

---

## For Production Deployment:

When you deploy your app, you'll need to add your production URLs:

### In Google Cloud Console:

- **Authorized JavaScript origins:**

  ```
  https://yourdomain.com
  https://www.yourdomain.com
  ```

- **Authorized redirect URIs:**
  ```
  https://yourdomain.com
  https://api.yourdomain.com/api/auth/google
  ```

### Update .env files:

- **Frontend .env:**

  ```
  REACT_APP_API_URL=https://api.yourdomain.com/api
  REACT_APP_GOOGLE_CLIENT_ID=930383749959-15stula535fh0rjdobfh2nocpof48n8r.apps.googleusercontent.com
  ```

- **Backend .env:**
  ```
  GOOGLE_CLIENT_ID=930383749959-15stula535fh0rjdobfh2nocpof48n8r.apps.googleusercontent.com
  ```

---

## Current Configuration Status:

✅ Google Client ID configured in both frontend and backend  
✅ Google OAuth route created (`/api/auth/google`)  
✅ Google Auth controller implemented  
✅ User model supports Google authentication  
⚠️ **Need to add authorized origins in Google Cloud Console** (see steps above)

---

## Testing After Configuration:

1. Make sure both servers are running:

   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`

2. Open browser console (F12)

3. Go to login page

4. Click "Sign in with Google"

5. If configured correctly:
   - Google login popup should appear
   - No console errors
   - After login, redirect to dashboard

---

## Need Help?

If errors persist after following these steps:

1. Check the browser console for specific error messages
2. Verify the Client ID matches in both `.env` files
3. Wait 5-10 minutes after saving changes in Google Cloud Console
4. Try in an incognito/private browser window
5. Clear all browser cache and cookies for localhost
