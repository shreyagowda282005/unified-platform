const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Placeholder for user routes
router.get('/profile', auth, (req, res) => {
  res.json(req.user);
});

module.exports = router;
// backend/routes/users.js (or wherever your user routes are)

// GET /api/users/suggestions - Get suggested users to follow
router.get('/suggestions', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const currentUserId = req.user.id

    // Find users that the current user is NOT following
    // and are not the current user themselves
    const suggestions = await User.find({
      _id: { 
        $ne: currentUserId, // Exclude current user
        $nin: req.user.following || [] // Exclude users already following
      }
    })
      .select('name email profilePicture userType bio location followersCount')
      .limit(limit)
      .sort({ followersCount: -1 }) // Sort by most popular

    // Add isFollowing field
    const suggestionsWithFollowStatus = suggestions.map(user => ({
      ...user.toObject(),
      isFollowing: false // They're suggestions, so not following yet
    }))

    res.json(suggestionsWithFollowStatus)
  } catch (error) {
    console.error('Error getting suggestions:', error)
    res.status(500).json({ message: 'Error getting user suggestions' })
  }
})

// If you don't have a User model with followersCount, here's an alternative:
router.get('/suggestions', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5
    const currentUserId = req.user.id

    // Get current user's following list
    const currentUser = await User.findById(currentUserId)
    const followingIds = currentUser.following || []

    // Find users not in following list and not the current user
    const suggestions = await User.find({
      _id: { 
        $ne: currentUserId,
        $nin: followingIds
      }
    })
      .select('name email profilePicture userType bio location')
      .limit(limit)

    // Count followers for each suggested user
    const suggestionsWithCounts = await Promise.all(
      suggestions.map(async (user) => {
        const followerCount = await User.countDocuments({ 
          following: user._id 
        })
        
        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          userType: user.userType,
          bio: user.bio,
          location: user.location,
          followersCount: followerCount,
          isFollowing: false
        }
      })
    )

    // Sort by follower count
    suggestionsWithCounts.sort((a, b) => b.followersCount - a.followersCount)

    res.json(suggestionsWithCounts)
  } catch (error) {
    console.error('Error getting suggestions:', error)
    res.status(500).json({ message: 'Error getting user suggestions' })
  }
})






