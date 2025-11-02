# 🚀 Finance Tracker Deployment Guide

Complete guide to deploy your Finance Tracker application to production.

## 📋 Pre-Deployment Checklist

### Backend

- [ ] All environment variables documented
- [ ] `.env` file in `.gitignore`
- [ ] Strong JWT secret generated
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB IP whitelist configured
- [ ] Gmail app password generated
- [ ] Google OAuth credentials set up
- [ ] Email service tested (`node testEmail.js`)
- [ ] API endpoints tested locally
- [ ] CORS configured for production domain

### Frontend

- [ ] API URL environment variable set
- [ ] Google OAuth client ID configured
- [ ] Build tested locally (`npm run build`)
- [ ] All routes working
- [ ] Responsive design verified

### Security

- [ ] No secrets in git history
- [ ] Strong passwords used
- [ ] HTTPS will be enabled
- [ ] Google OAuth redirect URIs updated

---

## 🔧 Backend Deployment

### Option 1: Render (Recommended - Free Tier)

#### Why Render?

- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ GitHub integration
- ✅ Auto-deploys on push
- ✅ Environment variables management
- ✅ Perfect for Node.js + MongoDB

#### Steps:

1. **Prepare Repository**

   ```bash
   # Ensure .gitignore includes
   node_modules/
   .env
   *.log

   # Commit and push to GitHub
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**

   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create Web Service**

   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository
   - Select your Finance Tracker repo

4. **Configure Service**

   - **Name:** `finance-tracker-backend`
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`

5. **Add Environment Variables**

   In Render dashboard, add these variables:

   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
   PORT=5000
   NODE_ENV=production
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_FROM=Finance Tracker <your-email@gmail.com>
   OTP_EXPIRY_MINUTES=10
   OTP_MAX_ATTEMPTS=3
   ```

6. **Deploy**

   - Click **"Create Web Service"**
   - Render will build and deploy automatically
   - Your API will be live at: `https://finance-tracker-backend.onrender.com`

7. **Verify Deployment**
   ```bash
   curl https://finance-tracker-backend.onrender.com/
   ```

#### Important Notes:

- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes 30-50 seconds
- Upgrade to paid tier ($7/month) for always-on service

---

### Option 2: Railway

1. **Go to Railway**

   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Deploy**

   - Click **"New Project"** → **"Deploy from GitHub repo"**
   - Select your repository
   - Railway auto-detects Node.js

3. **Configure**

   - Set root directory: `backend`
   - Add all environment variables
   - Deploy!

4. **Get URL**
   - Railway provides: `https://your-app.railway.app`

**Pricing:** $5 free credit, then pay-as-you-go

---

### Option 3: Heroku

1. **Install Heroku CLI**

   ```bash
   # Windows (with Chocolatey)
   choco install heroku-cli

   # Or download from heroku.com
   ```

2. **Login and Create App**

   ```bash
   cd backend
   heroku login
   heroku create finance-tracker-backend
   ```

3. **Add Environment Variables**

   ```bash
   heroku config:set MONGO_URI="your_mongodb_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   heroku config:set NODE_ENV="production"
   # ... add all other env vars
   ```

4. **Deploy**

   ```bash
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

**Note:** Heroku no longer has a free tier (starts at $7/month)

---

### Option 4: DigitalOcean App Platform

1. Go to [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. **Create App** → **GitHub**
3. Select repository and `backend` folder
4. Configure:
   - **Type:** Web Service
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`
5. Add environment variables
6. Deploy!

**Pricing:** Free $200 credit for new users, then $5/month

---

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended - Free Tier)

#### Why Vercel?

- ✅ Optimized for React
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero config deployment
- ✅ GitHub integration
- ✅ Free tier generous

#### Steps:

1. **Install Vercel CLI** (Optional)

   ```bash
   npm install -g vercel
   ```

2. **Deploy via GitHub (Recommended)**

   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click **"Add New Project"**
   - Import your repository
   - Configure:
     - **Framework Preset:** Create React App
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `build`

3. **Add Environment Variables**

   ```env
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

4. **Deploy**

   - Click **"Deploy"**
   - Your app will be live at: `https://finance-tracker.vercel.app`

5. **Custom Domain** (Optional)
   - Add your custom domain in Vercel settings
   - Update DNS records as instructed

#### Auto-Deployment

- Every push to `main` branch auto-deploys
- Preview deployments for pull requests

---

### Option 2: Netlify

1. **Go to Netlify**

   - Visit [netlify.com](https://netlify.com)
   - Sign up with GitHub

2. **Deploy**

   - Click **"Add new site"** → **"Import from Git"**
   - Select repository
   - Configure:
     - **Base directory:** `frontend`
     - **Build command:** `npm run build`
     - **Publish directory:** `frontend/build`

3. **Environment Variables**

   - Go to Site settings → Environment variables
   - Add `REACT_APP_API_URL` and `REACT_APP_GOOGLE_CLIENT_ID`

4. **Deploy**
   - Site will be live at: `https://your-app.netlify.app`

---

### Option 3: GitHub Pages

1. **Install gh-pages**

   ```bash
   cd frontend
   npm install --save-dev gh-pages
   ```

2. **Update package.json**

   ```json
   {
     "homepage": "https://yourusername.github.io/finance-tracker",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

**Note:** GitHub Pages is static hosting only, no environment variables support at build time.

---

## 🔄 Post-Deployment Setup

### 1. Update Google OAuth Redirect URIs

Add your production URLs to Google Cloud Console:

```
https://your-frontend.vercel.app
https://your-frontend.vercel.app/login
https://your-frontend.vercel.app/register
```

### 2. Update CORS in Backend

In `backend/server.js`:

```javascript
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://your-frontend.vercel.app"
      : "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
```

Redeploy backend after this change.

### 3. Update MongoDB IP Whitelist

In MongoDB Atlas:

- Go to Network Access
- Add IP: `0.0.0.0/0` (allow all)
- Or add specific IPs of Render/Railway servers

### 4. Test Production API

```bash
# Test health endpoint
curl https://your-backend.onrender.com/

# Test registration flow
curl -X POST https://your-backend.onrender.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### 5. Test Frontend

1. Visit your deployed frontend URL
2. Test registration with OTP
3. Test Google Sign-In
4. Create transactions
5. Test all features

---

## 🔒 Security Recommendations

### 1. Generate Strong JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Use this output for `JWT_SECRET`.

### 2. Use Environment-Specific Configs

```javascript
// backend/server.js
const isProduction = process.env.NODE_ENV === "production";

// Different configs for production
if (isProduction) {
  // Strict CORS
  // Enable rate limiting
  // Disable detailed error messages
}
```

### 3. Enable Rate Limiting (Optional)

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api/", limiter);
```

### 4. Use HTTPS Only

Both Render and Vercel provide automatic HTTPS.

### 5. Keep Dependencies Updated

```bash
npm audit fix
npm outdated
```

---

## 🐛 Troubleshooting

### Backend Not Starting

1. **Check Render logs:**

   - Go to Render dashboard → Your service → Logs
   - Look for error messages

2. **Common issues:**
   - Missing environment variables
   - MongoDB connection string incorrect
   - Port not set to 5000

### Frontend Not Loading

1. **Check build logs:**

   - Vercel dashboard → Deployment → Build logs

2. **Common issues:**
   - `REACT_APP_API_URL` not set
   - API URL has trailing slash (remove it)
   - CORS not configured on backend

### Email Not Sending

1. **Check email credentials:**

   - Gmail app password is 16 characters
   - No spaces in app password
   - 2FA enabled on Gmail

2. **Test locally:**
   ```bash
   node testEmail.js
   ```

### Google OAuth Not Working

1. **Check redirect URIs:**

   - Must match exactly (including http/https)
   - Include production URL
   - No trailing slashes

2. **Check client ID:**
   - Same ID in backend `.env` and frontend `.env`

### CORS Errors

1. **Update backend CORS:**

   ```javascript
   const corsOptions = {
     origin: "https://your-frontend-url.vercel.app",
     credentials: true,
   };
   ```

2. **Redeploy backend**

### MongoDB Connection Failed

1. **Check connection string:**

   - URL-encode password special characters
   - `@` → `%40`
   - `#` → `%23`

2. **Check IP whitelist:**
   - Add `0.0.0.0/0` or specific IPs

---

## 📊 Monitoring & Logs

### Render Logs

```
Dashboard → Your Service → Logs
```

### Vercel Logs

```
Dashboard → Your Project → Deployments → View Function Logs
```

### MongoDB Atlas Monitoring

```
Clusters → Metrics → Monitor database performance
```

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Learning)

| Service               | Cost         | Limitations                        |
| --------------------- | ------------ | ---------------------------------- |
| **Render** (Backend)  | Free         | Spins down after 15 min inactivity |
| **Vercel** (Frontend) | Free         | 100GB bandwidth/month              |
| **MongoDB Atlas**     | Free         | 512MB storage                      |
| **Gmail** (Emails)    | Free         | Unlimited                          |
| **Total**             | **$0/month** | Good for demo/portfolio            |

### Production Tier

| Service                   | Cost            | Benefits                      |
| ------------------------- | --------------- | ----------------------------- |
| **Render** (Backend)      | $7/month        | Always on, better performance |
| **Vercel Pro** (Frontend) | $20/month       | More bandwidth, analytics     |
| **MongoDB Atlas**         | $0-$9/month     | More storage, backups         |
| **Total**                 | **$7-36/month** | Production-ready              |

---

## 🎯 Deployment Best Practices

1. **Use Git Tags for Releases**

   ```bash
   git tag -a v1.0.0 -m "Release version 1.0.0"
   git push origin v1.0.0
   ```

2. **Separate Environments**

   - Development: Local
   - Staging: Test deployment
   - Production: Live site

3. **Database Backups**

   - Enable MongoDB Atlas backups
   - Export critical data regularly

4. **Monitor Uptime**

   - Use UptimeRobot (free)
   - Set up email alerts

5. **SSL Certificates**
   - Automatic with Render/Vercel
   - Verify HTTPS is working

---

## 📞 Support

If you encounter issues during deployment:

- 📧 Email: durvesh.gaikwad08@gmail.com
- 📱 Phone: +91 9136608240
- 📝 Create an issue in the repository

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Frontend loads on production URL
- [ ] Backend API responds
- [ ] Registration with OTP works
- [ ] Google Sign-In works
- [ ] Login works
- [ ] Transactions can be created
- [ ] Dashboard shows data
- [ ] Email change works
- [ ] Password change works
- [ ] Account deletion works
- [ ] All features working on mobile
- [ ] HTTPS enabled
- [ ] No console errors

---

**🚀 Congratulations! Your Finance Tracker is now live!**

**© 2025-26 Finance Tracker Deployment Guide**
