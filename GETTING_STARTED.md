# 🎯 Getting Started

Welcome to the Influencer Marketing Platform! This guide will help you get started quickly.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Detailed Setup](#detailed-setup)
3. [First Steps](#first-steps)
4. [Understanding the Platform](#understanding-the-platform)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)

## ⚡ Quick Start

### 1. Install Dependencies

```bash
cd unified-platform
npm run install:all
```

### 2. Create Environment Files

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/influencer-platform
JWT_SECRET=your-random-32-character-secret-key
STRIPE_SECRET_KEY=sk_test_your_key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Set Up MongoDB

**Quick Option**: Use MongoDB Atlas (free tier)
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Add to `backend/.env`

### 4. Run the Application

```bash
npm run dev
```

### 5. Open Your Browser

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api/health

## 📖 Detailed Setup

For comprehensive setup instructions, see:
- [SETUP.md](./SETUP.md) - Complete setup guide
- [QUICK_START.md](./QUICK_START.md) - Fast setup guide

## 🚀 First Steps

### 1. Create Your First Account

1. Open http://localhost:5173
2. Click "Get Started" or "Signup"
3. Choose your role:
   - **Influencer**: For content creators
   - **Brand**: For businesses looking for influencers
4. Complete registration
5. Verify your email (if OTP is enabled)

### 2. Explore Your Dashboard

**As an Influencer:**
- View your stats and metrics
- Update your profile
- Browse available campaigns
- Check your earnings

**As a Brand:**
- View campaign performance
- Create new campaigns
- Browse influencers
- Manage applications

### 3. Create Your First Campaign (Brands)

1. Go to "Create Campaign"
2. Fill in campaign details:
   - Title and description
   - Budget
   - Requirements
   - Timeline
3. Publish the campaign
4. Wait for influencer applications

### 4. Apply to a Campaign (Influencers)

1. Browse available campaigns
2. Click on a campaign to view details
3. Click "Apply"
4. Submit your application with proposed rate
5. Wait for brand response

## 🎓 Understanding the Platform

### User Roles

**Influencer**
- Content creators looking for brand partnerships
- Can browse and apply to campaigns
- Manages portfolio and profile
- Tracks earnings and analytics

**Brand**
- Businesses looking to work with influencers
- Creates and manages campaigns
- Reviews influencer applications
- Processes payments

**Admin**
- Platform administrators
- Manages users and campaigns
- Oversees payments
- Views platform analytics

### Key Features

**Campaigns**
- Brands create campaigns with requirements
- Influencers browse and apply
- Brands review applications
- Selected influencers collaborate

**Messaging**
- Real-time messaging between brands and influencers
- Campaign-specific conversations
- Message history

**Payments**
- Secure payment processing via Stripe
- Payment tracking
- Invoice generation

**Analytics**
- Performance metrics
- Engagement tracking
- ROI analysis
- Growth charts

## 🔧 Common Tasks

### Update Your Profile

**Influencer:**
1. Go to "Profile"
2. Update bio, social links, rates
3. Upload profile and cover images
4. Save changes

**Brand:**
1. Go to "Profile"
2. Update company information
3. Set budget ranges
4. Define target audience
5. Save changes

### Upload Portfolio (Influencers)

1. Go to "Portfolio"
2. Click "Upload"
3. Select images or videos
4. Add descriptions
5. Save

### Create a Campaign (Brands)

1. Go to "Create Campaign"
2. Fill in all required fields
3. Set budget and timeline
4. Define requirements
5. Publish

### Send a Message

1. Go to "Messaging"
2. Select a conversation or start new
3. Type your message
4. Send

### View Analytics

1. Go to "Analytics"
2. Select time period
3. View charts and metrics
4. Export data (if available)

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
Error: MongoDB connection error
```
**Solution:**
- Check `MONGODB_URI` in `backend/.env`
- Verify MongoDB is running
- Check IP whitelist (for Atlas)

**Port Already in Use**
```
Error: Port 5000 is already in use
```
**Solution:**
- Change `PORT` in `backend/.env`
- Or kill the process using port 5000

### Frontend Issues

**API Calls Failing**
```
Network Error or CORS Error
```
**Solution:**
- Verify backend is running
- Check `VITE_API_URL` in `frontend/.env`
- Check `FRONTEND_URL` in `backend/.env` matches frontend URL

**Page Not Loading**
```
Blank page or errors
```
**Solution:**
- Check browser console for errors
- Verify all dependencies installed
- Clear browser cache
- Restart development server

### Authentication Issues

**Can't Login**
- Verify email and password
- Check if account exists
- Try resetting password
- Check backend logs

**Redirected to Login**
- Check if token exists in localStorage
- Verify backend authentication
- Check ProtectedRoute configuration

## 📚 Additional Resources

- [README.md](./README.md) - Full documentation
- [SETUP.md](./SETUP.md) - Detailed setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview

## 🆘 Need Help?

1. Check the documentation files
2. Review error messages in console
3. Check backend logs
4. Verify environment variables
5. Ensure all dependencies are installed

## 🎉 You're Ready!

Your platform is set up and ready to use. Start exploring and building amazing influencer partnerships!

---

**Happy Building! 🚀**

