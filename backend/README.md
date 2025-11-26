# Backend - Influencer Marketing Platform

Node.js Express backend with MongoDB.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm start
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/influencer-platform
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_your_key
OPENAI_API_KEY=sk-your-key (optional)
```

## Project Structure

- `src/controllers/` - Route controllers
- `src/models/` - MongoDB Mongoose models
- `src/routes/` - Express routes
- `src/middleware/` - Auth, upload, error middleware
- `src/config/` - Configuration files
- `src/services/` - Business logic (optional)
- `src/utils/` - Utility functions
- `src/server.js` - Application entry point

## API Documentation

See main README.md for complete API endpoint documentation.

## Database Models

- User
- InfluencerProfile
- BrandProfile
- Campaign
- Application
- Message
- Payment

## Features

- JWT authentication
- File uploads (Multer)
- Real-time messaging (Socket.io)
- Payment processing (Stripe)
- AI assistant integration (OpenAI optional)
- MongoDB database
- Error handling middleware

## File Uploads

Files are stored in the `uploads/` directory. Ensure this directory exists and has proper permissions.







