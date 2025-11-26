const InfluencerProfile = require('../models/InfluencerProfile');
const Campaign = require('../models/Campaign');
const Payment = require('../models/Payment');

exports.getInfluencerAnalytics = async (req, res) => {
  try {
    const influencerProfile = await InfluencerProfile.findOne({ userId: req.user._id });
    if (!influencerProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Mock analytics data - replace with actual data from social media APIs
    const followerGrowth = [
      { date: '2024-01', followers: 10000 },
      { date: '2024-02', followers: 12000 },
      { date: '2024-03', followers: 15000 },
      { date: '2024-04', followers: 18000 },
      { date: '2024-05', followers: 20000 }
    ];

    const engagementTrend = [
      { month: 'Jan', rate: 2.5 },
      { month: 'Feb', rate: 2.8 },
      { month: 'Mar', rate: 3.1 },
      { month: 'Apr', rate: 3.2 },
      { month: 'May', rate: 3.5 }
    ];

    res.json({
      followerGrowth,
      engagementTrend,
      currentStats: {
        followers: influencerProfile.followerCount?.instagram || 0,
        engagementRate: influencerProfile.engagementRate || 0,
        averageReach: influencerProfile.averageReach || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBrandAnalytics = async (req, res) => {
  try {
    const BrandProfile = require('../models/BrandProfile');
    const brandProfile = await BrandProfile.findOne({ userId: req.user._id });
    if (!brandProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const campaigns = await Campaign.find({ brandId: brandProfile._id });
    const payments = await Payment.find({ brandId: brandProfile._id, status: 'completed' });

    const campaignPerformance = campaigns.map(c => ({
      title: c.title,
      budget: c.budget,
      applicants: c.applicants.length,
      status: c.status
    }));

    const budgetAllocation = campaigns.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + c.budget;
      return acc;
    }, {});

    res.json({
      campaignPerformance,
      budgetAllocation,
      totalSpent: payments.reduce((sum, p) => sum + p.amount, 0)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







