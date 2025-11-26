# 🚀 Deployment Guide

Complete guide for deploying the Influencer Marketing Platform.

## 📋 Prerequisites

- MongoDB Atlas account (or local MongoDB)
- Node.js 18+ installed
- Git repository
- Vercel account (for frontend)
- Render/Railway account (for backend)
- Stripe account (for payments)

## 🔧 Backend Deployment

### Option 1: Render (Recommended)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `unified-platform/backend` directory
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node

2. **Set Environment Variables:**
   ```
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/influencer-platform
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   STRIPE_SECRET_KEY=sk_live_your_stripe_key
   OPENAI_API_KEY=sk-your-openai-key (optional)
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the service URL (e.g., `https://your-app.onrender.com`)

### Option 2: Railway

1. **Create a new project on Railway**
   - Connect your GitHub repository
   - Add a new service from GitHub
   - Select the `unified-platform/backend` directory

2. **Configure:**
   - Set start command: `npm start`
   - Add environment variables (same as Render)

3. **Deploy**
   - Railway will auto-deploy on push
   - Get your service URL

## 🎨 Frontend Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd unified-platform/frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   VITE_SOCKET_URL=https://your-backend.onrender.com
   ```

4. **Alternative: Deploy via Vercel Dashboard**
   - Go to vercel.com
   - Import your GitHub repository
   - Set root directory to `unified-platform/frontend`
   - Add environment variables
   - Deploy

## 🗄️ Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Account**
   - Go to mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your backend
   - Create cluster

3. **Configure Database Access**
   - Go to Database Access
   - Create database user
   - Set username and password (save these!)

4. **Configure Network Access**
   - Go to Network Access
   - Add IP Address
   - For development: Add your current IP
   - For production: Add `0.0.0.0/0` (allows all IPs)

5. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database password
   - Add to backend `.env` as `MONGODB_URI`

## 💳 Stripe Setup

1. **Create Stripe Account**
   - Go to stripe.com
   - Sign up for account

2. **Get API Keys**
   - Go to Developers → API Keys
   - Copy "Secret key" (starts with `sk_live_` for production)
   - Copy "Publishable key" (for frontend if needed)

3. **Add to Environment Variables**
   - Add `STRIPE_SECRET_KEY` to backend `.env`

## 🔐 Security Checklist

- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Use production Stripe keys (not test keys)
- [ ] Set NODE_ENV=production
- [ ] Configure CORS properly (FRONTEND_URL)
- [ ] Use MongoDB Atlas with proper IP whitelisting
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set secure cookie flags in production

## 📝 Post-Deployment

1. **Test API Health:**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Test signup/login flow
   - Verify API calls work

3. **Monitor Logs:**
   - Check Render/Railway logs for errors
   - Check Vercel function logs

## 🔄 Updating Deployment

### Backend Updates:
```bash
git add .
git commit -m "Update backend"
git push origin main
# Render/Railway will auto-deploy
```

### Frontend Updates:
```bash
cd unified-platform/frontend
git add .
git commit -m "Update frontend"
git push origin main
# Vercel will auto-deploy
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Check MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas
- Check database user credentials

**CORS Errors:**
- Verify FRONTEND_URL matches your Vercel URL exactly
- Check backend CORS configuration

**Port Issues:**
- Render/Railway assigns PORT automatically
- Don't hardcode port in code

### Frontend Issues

**API Calls Failing:**
- Check VITE_API_URL is correct
- Verify backend is running
- Check browser console for CORS errors

**Environment Variables Not Working:**
- Rebuild after changing env vars: `vercel --prod`
- Check variable names start with `VITE_`

## 📊 Monitoring

- **Backend:** Use Render/Railway dashboard
- **Frontend:** Use Vercel Analytics
- **Database:** Use MongoDB Atlas monitoring
- **Errors:** Set up error tracking (Sentry, etc.)

## 🎉 Success!

Your platform should now be live! Share your URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`

