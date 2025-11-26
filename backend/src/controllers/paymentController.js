const Payment = require('../models/Payment');
const Campaign = require('../models/Campaign');
const BrandProfile = require('../models/BrandProfile');
const InfluencerProfile = require('../models/InfluencerProfile');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createPayment = async (req, res) => {
  try {
    const { campaignId, influencerId, amount } = req.body;

    const brandProfile = await BrandProfile.findOne({ userId: req.user._id });
    if (!brandProfile) {
      return res.status(404).json({ message: 'Brand profile not found' });
    }

    const payment = new Payment({
      campaignId,
      brandId: brandProfile._id,
      influencerId,
      amount,
      status: 'pending'
    });
    await payment.save();

    // Create Stripe payment intent
    if (process.env.STRIPE_SECRET_KEY) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          paymentId: payment._id.toString(),
          campaignId,
          influencerId
        }
      });

      payment.transactionId = paymentIntent.id;
      await payment.save();

      res.json({
        payment,
        clientSecret: paymentIntent.client_secret
      });
    } else {
      res.json({ payment });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const query = {};
    
    if (req.user.userType === 'brand') {
      const brandProfile = await BrandProfile.findOne({ userId: req.user._id });
      if (brandProfile) query.brandId = brandProfile._id;
    } else if (req.user.userType === 'influencer') {
      const influencerProfile = await InfluencerProfile.findOne({ userId: req.user._id });
      if (influencerProfile) query.influencerId = influencerProfile._id;
    }

    const payments = await Payment.find(query)
      .populate('campaignId', 'title')
      .populate('brandId', 'companyName')
      .populate('influencerId', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.status = status;
    if (status === 'completed') {
      payment.paidAt = new Date();
    }
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







