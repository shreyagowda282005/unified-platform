const Campaign = require('../models/Campaign');
const BrandProfile = require('../models/BrandProfile');
const Application = require('../models/Application');

exports.createCampaign = async (req, res) => {
  try {
    const brandProfile = await BrandProfile.findOne({ userId: req.user._id });
    if (!brandProfile) {
      return res.status(404).json({ message: 'Brand profile not found' });
    }

    const campaign = new Campaign({
      ...req.body,
      brandId: brandProfile._id
    });
    await campaign.save();

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const { status, brandId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (brandId) {
      const brandProfile = await BrandProfile.findOne({ userId: brandId });
      if (brandProfile) query.brandId = brandProfile._id;
    }

    const campaigns = await Campaign.find(query)
      .populate('brandId', 'companyName logo')
      .sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('brandId', 'companyName logo description')
      .populate('applicants.influencerId', 'name profilePicture followerCount engagementRate');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCampaign = async (req, res) => {
  try {
    const brandProfile = await BrandProfile.findOne({ userId: req.user._id });
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      brandId: brandProfile._id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    Object.assign(campaign, req.body);
    await campaign.save();
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCampaign = async (req, res) => {
  try {
    const brandProfile = await BrandProfile.findOne({ userId: req.user._id });
    const campaign = await Campaign.findOneAndDelete({
      _id: req.params.id,
      brandId: brandProfile._id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.browseCampaigns = async (req, res) => {
  try {
    const { budgetMin, budgetMax, niche, location, type } = req.query;
    const query = { status: 'active' };

    if (budgetMin || budgetMax) {
      query.budget = {};
      if (budgetMin) query.budget.$gte = parseInt(budgetMin);
      if (budgetMax) query.budget.$lte = parseInt(budgetMax);
    }
    if (niche) query.niche = { $in: [niche] };
    if (location) query.location = new RegExp(location, 'i');

    const campaigns = await Campaign.find(query)
      .populate('brandId', 'companyName logo')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







