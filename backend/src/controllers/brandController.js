const BrandProfile = require('../models/BrandProfile');
const Campaign = require('../models/Campaign');
const InfluencerProfile = require('../models/InfluencerProfile');
const Payment = require('../models/Payment');

exports.getProfile = async (req, res) => {
  try {
    const profile = await BrandProfile.findOne({ userId: req.user._id })
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
    const profile = await BrandProfile.findOneAndUpdate(
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
    const profile = await BrandProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const campaigns = await Campaign.find({ brandId: profile._id });
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const payments = await Payment.find({ brandId: profile._id });

    const totalSpent = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalApplicants = campaigns.reduce((sum, c) => sum + c.applicants.length, 0);

    res.json({
      profile,
      stats: {
        totalCampaigns: campaigns.length,
        activeCampaigns: activeCampaigns.length,
        totalSpent,
        influencerInvites: totalApplicants
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.browseInfluencers = async (req, res) => {
  try {
    const { niche, location, minFollowers, minEngagement } = req.query;
    const query = {};

    if (niche) query.category = { $in: [niche] };
    if (location) query.location = new RegExp(location, 'i');
    if (minFollowers) {
      query.$or = [
        { 'followerCount.instagram': { $gte: parseInt(minFollowers) } },
        { 'followerCount.youtube': { $gte: parseInt(minFollowers) } }
      ];
    }
    if (minEngagement) {
      query.engagementRate = { $gte: parseFloat(minEngagement) };
    }

    const influencers = await InfluencerProfile.find(query)
      .populate('userId', 'email')
      .limit(50);
    res.json(influencers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







