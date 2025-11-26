const mongoose = require('mongoose');

const influencerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: String,
  bio: String,
  category: {
    type: [String],
    enum: ['Beauty', 'Travel', 'Fitness', 'Food', 'Fashion', 'Tech', 'Lifestyle', 'Gaming', 'Education', 'Other']
  },
  location: String,
  socialLinks: {
    instagram: String,
    youtube: String,
    tiktok: String,
    twitter: String
  },
  rates: {
    perReel: Number,
    perStory: Number,
    perPost: Number
  },
  tags: [String],
  instagramConnected: {
    type: Boolean,
    default: false
  },
  youtubeConnected: {
    type: Boolean,
    default: false
  },
  followerCount: {
    instagram: Number,
    youtube: Number
  },
  engagementRate: Number,
  averageReach: Number,
  portfolio: [{
    type: {
      type: String,
      enum: ['image', 'video']
    },
    url: String,
    thumbnail: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

influencerProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InfluencerProfile', influencerProfileSchema);



