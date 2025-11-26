# 🚀 Influencer Marketing Platform

A complete, production-ready influencer marketing platform connecting brands with influencers. Built with modern technologies and featuring a beautiful, responsive UI.

## ✨ Features

### 👤 For Influencers
- 📊 Comprehensive dashboard with analytics
- 👤 Profile management with portfolio uploads
- 🔍 Browse and apply to campaigns
- 💬 Real-time messaging with brands
- 💰 Earnings tracking and payment history
- 📈 Performance analytics

### 💼 For Brands
- 📊 Campaign management dashboard
- ➕ Create and manage campaigns
- 🔍 Browse influencers with advanced filters
- 💬 Real-time messaging
- 💳 Secure payment processing
- 📊 Campaign analytics and ROI tracking

### 🤖 AI Assistant
- ✨ Campaign description suggestions
- 🎯 Influencer recommendations
- 💡 Profile optimization tips
- 💬 General platform assistance

### 👨‍💼 Admin Panel
- 👥 User management
- 📋 Campaign moderation
- 💰 Payment oversight
- 📊 Platform-wide analytics

## 🏗️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **Zustand** for state management
- **Recharts** for data visualization
- **Framer Motion** for animations
- **Axios** for API calls
- **Tailwind CSS** (via custom CSS)

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Socket.io** for real-time messaging
- **JWT** for authentication
- **Stripe** for payments
- **Multer** for file uploads

## 📁 Project Structure

```
unified-platform/
├── frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── store/         # Zustand state management
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth & upload middleware
│   │   ├── services/      # Business logic services
│   │   ├── config/        # Configuration files
│   │   └── server.js      # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone and navigate to the project**
   ```bash
   cd unified-platform
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up backend environment**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   MONGODB_URI=mongodb://localhost:27017/influencer-platform
   JWT_SECRET=your-super-secret-jwt-key-change-this
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   OPENAI_API_KEY=sk-your-openai-key (optional)
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Set up frontend environment**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

## 🔐 Authentication

- JWT-based authentication with httpOnly cookies
- User types: Influencer, Brand, Admin
- Protected routes with role-based access control
- Google OAuth support

## 💳 Payment Integration

- Stripe integration for secure payments
- Payment history tracking
- Invoice generation
- Status management (pending/processing/completed)

## 📊 Analytics

- Follower growth charts
- Engagement rate trends
- Campaign performance metrics
- Budget allocation visualization
- Real-time data updates

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/google` - Google OAuth login

### Influencers
- `GET /api/influencers/profile` - Get profile
- `PUT /api/influencers/profile` - Update profile
- `GET /api/influencers/dashboard` - Get dashboard stats
- `POST /api/influencers/portfolio` - Upload portfolio
- `GET /api/influencers/applications` - Get applications
- `GET /api/influencers/earnings` - Get earnings

### Brands
- `GET /api/brands/profile` - Get profile
- `PUT /api/brands/profile` - Update profile
- `GET /api/brands/dashboard` - Get dashboard stats
- `GET /api/brands/browse-influencers` - Browse influencers

### Campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns` - Get campaigns
- `GET /api/campaigns/browse` - Browse campaigns
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Applications
- `POST /api/applications` - Apply to campaign
- `GET /api/applications` - Get applications
- `PUT /api/applications/:id/status` - Update status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get conversations
- `GET /api/messages/:userId` - Get messages with user

### Payments
- `POST /api/payments` - Create payment
- `GET /api/payments` - Get payments
- `PUT /api/payments/:id/status` - Update status

### AI Assistant
- `POST /api/ai/chat` - Chat with AI

### Analytics
- `GET /api/analytics/influencer` - Influencer analytics
- `GET /api/analytics/brand` - Brand analytics

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/campaigns` - Get all campaigns
- `DELETE /api/admin/campaigns/:id` - Delete campaign
- `GET /api/admin/payments` - Get all payments

## 🚢 Deployment

### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - `VITE_API_URL` = Your backend API URL
   - `VITE_SOCKET_URL` = Your backend WebSocket URL

### Backend Deployment (Render/Railway)

1. **Connect your GitHub repository**

2. **Create a new Web Service**
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Environment: Node

3. **Set Environment Variables:**
   - `MONGODB_URI` = Your MongoDB connection string
   - `JWT_SECRET` = Your JWT secret
   - `FRONTEND_URL` = Your frontend URL
   - `STRIPE_SECRET_KEY` = Your Stripe secret key
   - `PORT` = 5000 (or let platform assign)

### Database (MongoDB Atlas)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to backend `.env` as `MONGODB_URI`
5. Whitelist your IP address in Network Access

## 🎨 Design System

- **Colors**: Yellow (#FFC938), Orange (#FF9F1C), Dark Orange (#FF6A00)
- **Typography**: Inter, Poppins
- **Spacing**: Consistent 8px grid
- **Border Radius**: 12-20px for cards
- **Shadows**: Soft, subtle shadows for depth

## 📝 Development Notes

- **File Uploads**: Backend serves uploaded files from `/uploads` directory
- **Real-time**: Socket.io handles real-time messaging
- **Authentication**: JWT tokens stored in httpOnly cookies
- **CORS**: Configured for frontend domain
- **Error Handling**: Centralized error middleware

## 🧪 Testing

Run frontend build test:
```bash
cd frontend
npm run build
```

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 🆘 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for connecting brands and influencers**

