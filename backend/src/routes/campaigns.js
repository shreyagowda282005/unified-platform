const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  browseCampaigns
} = require('../controllers/campaignController');

router.post('/', auth, createCampaign);
router.get('/', getCampaigns);
router.get('/browse', browseCampaigns);
router.get('/:id', getCampaign);
router.put('/:id', auth, updateCampaign);
router.delete('/:id', auth, deleteCampaign);

module.exports = router;







