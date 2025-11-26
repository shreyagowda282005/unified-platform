// Save as: backend/src/models/Application.js

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  influencer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  proposedRate: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  deliverables: [{
    type: String
  }],
  timeline: {
    startDate: Date,
    endDate: Date
  },
  portfolio: [{
    platform: String,
    url: String,
    metrics: {
      reach: Number,
      engagement: Number
    }
  }],
  rejectionReason: {
    type: String
  },
  acceptedDate: {
    type: Date
  },
  completedDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for faster queries
applicationSchema.index({ campaign: 1, influencer: 1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ brand: 1 });

module.exports = mongoose.model('Application', applicationSchema);