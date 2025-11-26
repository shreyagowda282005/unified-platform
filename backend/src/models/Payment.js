const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BrandProfile',
    required: true
  },
  influencerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'InfluencerProfile',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay', 'bank_transfer']
  },
  transactionId: String,
  invoiceUrl: String,
  paidAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);



