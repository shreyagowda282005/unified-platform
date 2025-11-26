// IMPORTANT: This MUST be the first line!
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const googleAuthRoutes = require('./routes/googleAuth');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/users', userRoutes);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/influencer-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('💡 Make sure your IP is whitelisted in MongoDB Atlas:');
  console.error('   1. Go to MongoDB Atlas → Network Access');
  console.error('   2. Click "Add IP Address" → "Allow Access from Anywhere" (for dev)');
  console.error('   3. Wait 1-2 minutes, then restart the server');
  process.exit(1);
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auth', googleAuthRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/influencers', require('./routes/influencers'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/cleanup', require('./routes/cleanup'));

app.use('/api/social', require('./routes/socialAuth'));
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Socket.io setup for real-time messaging
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user-typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { app, io };