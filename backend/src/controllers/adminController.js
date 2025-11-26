const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Payment = require('../models/Payment');
const InfluencerProfile = require('../models/InfluencerProfile');
const BrandProfile = require('../models/BrandProfile');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInfluencers = await InfluencerProfile.countDocuments();
    const totalBrands = await BrandProfile.countDocuments();
    const activeCampaigns = await Campaign.countDocuments({ status: 'active' });
    const totalPayments = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalInfluencers,
        totalBrands,
        activeCampaigns,
        totalRevenue: totalPayments[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search, userType } = req.query;
    const query = {};

    if (userType) query.userType = userType;
    if (search) {
      query.$or = [
        { email: new RegExp(search, 'i') }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('brandId', 'companyName')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('brandId', 'companyName')
      .populate('influencerId', 'name')
      .populate('campaignId', 'title')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







