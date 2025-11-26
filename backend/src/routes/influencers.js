const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getDashboard,
  uploadPortfolio,
  getApplications,
  getEarnings
} = require('../controllers/influencerController');
const upload = require('../middleware/upload');

router.use(auth);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getDashboard);
router.post('/portfolio', upload.array('files', 10), uploadPortfolio);
router.get('/applications', getApplications);
router.get('/earnings', getEarnings);

module.exports = router;







