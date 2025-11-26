# ⚡ Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Fast Setup

### 1. Install Dependencies

```bash
cd unified-platform
npm run install:all
```

### 2. Set Up Environment Files

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/influencer-platform
JWT_SECRET=change-this-to-a-random-32-character-string
STRIPE_SECRET_KEY=sk_test_your_key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start MongoDB

**Option A: MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create free cluster
- Get connection string
- Add to `backend/.env` as `MONGODB_URI`

**Option B: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use: `mongodb://localhost:27017/influencer-platform`

### 4. Run the App

```bash
npm run dev
```

This starts both backend (port 5000) and frontend (port 5173).

### 5. Open in Browser

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

## ✅ Test It Works

1. Open http://localhost:5173
2. Click "Get Started" or "Signup"
3. Create an account (choose Influencer or Brand)
4. You should be redirected to your dashboard!

## 🎯 Next Steps

- See [SETUP.md](./SETUP.md) for detailed setup
- See [README.md](./README.md) for features and API docs
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

## 🐛 Issues?

- **Backend won't start?** Check MongoDB connection
- **Frontend won't load?** Check backend is running
- **API errors?** Check environment variables

For detailed troubleshooting, see [SETUP.md](./SETUP.md).

