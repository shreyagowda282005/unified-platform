const Application = require('../models/Application');
const Campaign = require('../models/Campaign');
const InfluencerProfile = require('../models/InfluencerProfile');

exports.applyToCampaign = async (req, res) => {
  try {
    const { campaignId, message } = req.body;

    const influencerProfile = await InfluencerProfile.findOne({ userId: req.user._id });
    if (!influencerProfile) {
      return res.status(404).json({ message: 'Influencer profile not found' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if already applied
    const existing = await Application.findOne({ campaignId, influencerId: influencerProfile._id });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this campaign' });
    }

    const application = new Application({
      campaignId,
      influencerId: influencerProfile._id,
      message
    });
    await application.save();

    // Add to campaign applicants
    campaign.applicants.push({
      influencerId: influencerProfile._id,
      message,
      status: 'pending'
    });
    await campaign.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const { campaignId } = req.query;
    const query = {};

    if (campaignId) {
      query.campaignId = campaignId;
    } else {
      // Get applications for user's campaigns or user's applications
      const influencerProfile = await InfluencerProfile.findOne({ userId: req.user._id });
      if (influencerProfile) {
        query.influencerId = influencerProfile._id;
      }
    }

    const applications = await Application.find(query)
      .populate('campaignId', 'title budget brandId')
      .populate('influencerId', 'name profilePicture')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    application.reviewedAt = new Date();
    await application.save();

    // Update campaign applicants
    const campaign = await Campaign.findById(application.campaignId);
    if (campaign) {
      const applicant = campaign.applicants.find(
        a => a.influencerId.toString() === application.influencerId.toString()
      );
      if (applicant) {
        applicant.status = status;
        await campaign.save();
      }
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







