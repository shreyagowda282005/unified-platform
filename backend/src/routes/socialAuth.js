const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');

// Instagram OAuth Flow
// Note: Instagram Basic Display API requires app review for production
// For development, you can use Instagram Graph API with a test app

// @route   GET /api/social/instagram/connect
// @desc    Initiate Instagram OAuth connection
router.get('/instagram/connect', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Instagram OAuth URL
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const redirectUri = `${process.env.BACKEND_URL}/api/social/instagram/callback`;
    const scope = 'user_profile,user_media';
    
    // Store state for CSRF protection
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;
    
    res.json({ authUrl, state });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/social/instagram/callback
// @desc    Instagram OAuth callback (no auth required - called by Instagram)
router.get('/instagram/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?error=instagram_auth_failed`);
    }
    
    // Decode state to get userId
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const userId = stateData.userId;
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.INSTAGRAM_CLIENT_ID,
        client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.BACKEND_URL}/api/social/instagram/callback`,
        code: code,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?error=instagram_token_failed`);
    }
    
    // Get user profile from Instagram
    const profileResponse = await fetch(`https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`);
    const profileData = await profileResponse.json();
    
    // Update user's Instagram connection
    const user = await User.findById(userId);
    if (user) {
      user.socialMedia = user.socialMedia || {};
      user.socialMedia.instagram = profileData.username;
      user.socialMedia.instagramId = profileData.id;
      user.socialMedia.instagramToken = tokenData.access_token; // Store securely in production
      await user.save();
      
      // Update influencer profile if exists
      const influencerProfile = await InfluencerProfile.findOne({ userId: user._id });
      if (influencerProfile) {
        influencerProfile.socialPlatforms = influencerProfile.socialPlatforms || [];
        const instagramPlatform = influencerProfile.socialPlatforms.find(p => p.platform === 'instagram');
        if (instagramPlatform) {
          instagramPlatform.handle = profileData.username;
          instagramPlatform.connected = true;
        } else {
          influencerProfile.socialPlatforms.push({
            platform: 'instagram',
            handle: profileData.username,
            followers: 0, // Will be fetched separately
            verified: false,
            connected: true,
          });
        }
        await influencerProfile.save();
      }
    }
    
    res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?success=instagram_connected`);
  } catch (error) {
    console.error('Instagram callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?error=instagram_connection_failed`);
  }
});

// YouTube OAuth Flow
// @route   GET /api/social/youtube/connect
// @desc    Initiate YouTube OAuth connection
router.get('/youtube/connect', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // YouTube OAuth URL
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const redirectUri = `${process.env.BACKEND_URL}/api/social/youtube/callback`;
    const scope = 'https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/userinfo.profile';
    const responseType = 'code';
    
    // Store state for CSRF protection
    const state = Buffer.from(JSON.stringify({ userId })).toString('base64');
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}&state=${state}&access_type=offline&prompt=consent`;
    
    res.json({ authUrl, state });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/social/youtube/callback
// @desc    YouTube OAuth callback (no auth required - called by Google)
router.get('/youtube/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?error=youtube_auth_failed`);
    }
    
    // Decode state to get userId
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const userId = stateData.userId;
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.YOUTUBE_CLIENT_ID,
        client_secret: process.env.YOUTUBE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.BACKEND_URL}/api/social/youtube/callback`,
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?error=youtube_token_failed`);
    }
    
    // Get user's YouTube channel info
    const channelResponse = await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });
    
    const channelData = await channelResponse.json();
    
    if (channelData.items && channelData.items.length > 0) {
      const channel = channelData.items[0];
      const channelId = channel.id;
      const channelName = channel.snippet.title;
      const subscriberCount = parseInt(channel.statistics.subscriberCount || '0');
      
      // Update user's YouTube connection
      const user = await User.findById(userId);
      if (user) {
        user.socialMedia = user.socialMedia || {};
        user.socialMedia.youtube = channelName;
        user.socialMedia.youtubeId = channelId;
        user.socialMedia.youtubeToken = tokenData.access_token; // Store securely in production
        user.socialMedia.youtubeRefreshToken = tokenData.refresh_token;
        await user.save();
        
        // Update influencer profile if exists
        const influencerProfile = await InfluencerProfile.findOne({ userId: user._id });
        if (influencerProfile) {
          influencerProfile.socialPlatforms = influencerProfile.socialPlatforms || [];
          const youtubePlatform = influencerProfile.socialPlatforms.find(p => p.platform === 'youtube');
          if (youtubePlatform) {
            youtubePlatform.handle = channelName;
            youtubePlatform.followers = subscriberCount;
            youtubePlatform.connected = true;
          } else {
            influencerProfile.socialPlatforms.push({
              platform: 'youtube',
              handle: channelName,
              followers: subscriberCount,
              verified: channel.snippet.verified || false,
              connected: true,
            });
          }
          await influencerProfile.save();
        }
      }
    }
    
    res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?success=youtube_connected`);
  } catch (error) {
    console.error('YouTube callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/influencer/profile?error=youtube_connection_failed`);
  }
});

// @route   GET /api/social/status
// @desc    Get social media connection status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      instagram: {
        connected: !!user.socialMedia?.instagram,
        username: user.socialMedia?.instagram || null,
      },
      youtube: {
        connected: !!user.socialMedia?.youtube,
        channelName: user.socialMedia?.youtube || null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

