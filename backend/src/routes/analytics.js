const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getInfluencerAnalytics,
  getBrandAnalytics
} = require('../controllers/analyticsController');

router.use(auth);

router.get('/influencer', getInfluencerAnalytics);
router.get('/brand', getBrandAnalytics);

module.exports = router;







