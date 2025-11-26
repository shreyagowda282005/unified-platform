const InfluencerProfile = require('../models/InfluencerProfile');
const Campaign = require('../models/Campaign');
const Application = require('../models/Application');
const Payment = require('../models/Payment');

exports.getProfile = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ userId: req.user._id })
      .populate('userId', 'email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const applications = await Application.find({ influencerId: profile._id });
    const payments = await Payment.find({ influencerId: profile._id });

    const totalEarnings = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      profile,
      stats: {
        followerCount: profile.followerCount?.instagram || 0,
        engagementRate: profile.engagementRate || 0,
        averageReach: profile.averageReach || 0,
        campaignsApplied: applications.length,
        totalEarnings,
        pendingPayments
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadPortfolio = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const files = req.files || [req.file].filter(Boolean);
    const portfolioItems = files.map(file => ({
      type: file.mimetype.startsWith('image/') ? 'image' : 'video',
      url: `/uploads/${file.filename}`,
      thumbnail: file.mimetype.startsWith('image/') ? `/uploads/${file.filename}` : null
    }));

    profile.portfolio.push(...portfolioItems);
    await profile.save();

    res.json({ message: 'Portfolio updated', portfolio: profile.portfolio });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ userId: req.user._id });
    const applications = await Application.find({ influencerId: profile._id })
      .populate('campaignId')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEarnings = async (req, res) => {
  try {
    const profile = await InfluencerProfile.findOne({ userId: req.user._id });
    const payments = await Payment.find({ influencerId: profile._id })
      .populate('campaignId', 'title')
      .sort({ createdAt: -1 });

    const totalEarnings = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayments = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    res.json({
      totalEarnings,
      pendingPayments,
      transactions: payments
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







