const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getDashboard,
  browseInfluencers
} = require('../controllers/brandController');

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);
router.get('/browse-influencers', browseInfluencers);

module.exports = router;







