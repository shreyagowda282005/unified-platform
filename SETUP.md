# 🛠️ Setup Guide

Complete setup instructions for the Influencer Marketing Platform.

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **MongoDB** account ([MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - free tier available)
- **Git** installed
- A code editor (VS Code recommended)

## 🚀 Quick Setup

### 1. Navigate to Project Directory

```bash
cd unified-platform
```

### 2. Install All Dependencies

```bash
npm run install:all
```

This will install dependencies for both backend and frontend.

### 3. Set Up Backend

#### Create Backend Environment File

Create a file named `.env` in the `backend` directory:

```bash
cd backend
touch .env  # On Windows: type nul > .env
```

#### Add Backend Environment Variables

Open `backend/.env` and add:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/influencer-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
OPENAI_API_KEY=sk-your-openai-key
```

**Important Notes:**
- Replace `MONGODB_URI` with your MongoDB connection string (see MongoDB Setup below)
- Generate a strong `JWT_SECRET` (at least 32 characters)
- Get `STRIPE_SECRET_KEY` from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
- `OPENAI_API_KEY` is optional (for AI features)

### 4. Set Up Frontend

#### Create Frontend Environment File

```bash
cd ../frontend
touch .env  # On Windows: type nul > .env
```

#### Add Frontend Environment Variables

Open `frontend/.env` and add:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 5. MongoDB Setup

#### Option A: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose free tier (M0)
   - Select region closest to you
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Click "Add Current IP Address"
   - For testing: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Clusters" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `influencer-platform` (or your preferred name)
   - Add to `backend/.env` as `MONGODB_URI`

#### Option B: Local MongoDB

1. **Install MongoDB**
   - Download from [mongodb.com/download](https://www.mongodb.com/try/download/community)
   - Follow installation instructions
   - Start MongoDB service

2. **Use Default Connection**
   - Default connection string: `mongodb://localhost:27017/influencer-platform`
   - Add to `backend/.env` as `MONGODB_URI`

### 6. Run the Application

#### Option A: Run Both Servers (Recommended)

From the root directory:

```bash
npm run dev
```

This starts both backend and frontend simultaneously.

#### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## ✅ Verification

### Test Backend

1. **Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"ok","message":"Server is running"}`

2. **Check MongoDB Connection:**
   - Look for "✅ MongoDB connected" in backend console
   - If you see errors, check your `MONGODB_URI`

### Test Frontend

1. Open http://localhost:5173
2. You should see the landing page
3. Click "Get Started" or "Signup"
4. Try creating an account

## 🔧 Troubleshooting

### Backend Won't Start

**Port Already in Use:**
```bash
# Find process using port 5000
# Windows:
netstat -ano | findstr :5000
# Kill process (replace PID):
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill
```

**MongoDB Connection Error:**
- Verify `MONGODB_URI` is correct
- Check IP is whitelisted (for Atlas)
- Verify database user credentials
- Check MongoDB service is running (for local)

### Frontend Won't Start

**Port Already in Use:**
- Vite will automatically try next port (5174, 5175, etc.)
- Or change port in `vite.config.ts`

**API Calls Failing:**
- Verify backend is running
- Check `VITE_API_URL` in frontend `.env`
- Check browser console for CORS errors
- Verify `FRONTEND_URL` in backend `.env` matches frontend URL

### Common Issues

**Module Not Found:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables Not Working:**
- Restart the server after changing `.env`
- Frontend: Rebuild after changing env vars
- Check variable names are correct
- Frontend vars must start with `VITE_`

**CORS Errors:**
- Verify `FRONTEND_URL` in backend `.env` matches your frontend URL exactly
- Include protocol (http://) and port
- Restart backend after changing

## 📝 Next Steps

1. **Create Test Accounts:**
   - Sign up as an Influencer
   - Sign up as a Brand (use different email)
   - Test the authentication flow

2. **Explore Features:**
   - Create a campaign (as Brand)
   - Browse campaigns (as Influencer)
   - Test messaging
   - Upload portfolio items

3. **Configure Stripe (Optional):**
   - Get test API keys from Stripe Dashboard
   - Add to backend `.env`
   - Test payment flows

4. **Configure OpenAI (Optional):**
   - Get API key from OpenAI
   - Add to backend `.env`
   - Test AI assistant features

## 🎉 You're All Set!

Your platform is now running locally. Check out the [README.md](./README.md) for more information about features and API endpoints.

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

