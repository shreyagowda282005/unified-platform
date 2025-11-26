const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandProfile',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  deliverables: [String],
  budget: {
    type: Number,
    required: true
  },
  niche: {
    type: [String],
    enum: ['Beauty', 'Travel', 'Fitness', 'Food', 'Fashion', 'Tech', 'Lifestyle', 'Gaming', 'Education', 'Other']
  },
  location: String,
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'completed'],
    default: 'active'
  },
  requirements: String,
  timeline: String,
  applicants: [{
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InfluencerProfile'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    message: String
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

campaignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Campaign', campaignSchema);



