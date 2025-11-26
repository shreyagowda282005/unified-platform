const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  applyToCampaign,
  getApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

router.post('/', auth, applyToCampaign);
router.get('/', auth, getApplications);
router.put('/:id/status', auth, updateApplicationStatus);

module.exports = router;







