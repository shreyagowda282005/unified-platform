const express = require('express');
const router = express.Router();
const { auth, requireRole } = require('../middleware/auth');
const {
  getDashboard,
  getUsers,
  deleteUser,
  getCampaigns,
  deleteCampaign,
  getPayments
} = require('../controllers/adminController');

router.use(auth, requireRole('admin'));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/campaigns', getCampaigns);
router.delete('/campaigns/:id', deleteCampaign);
router.get('/payments', getPayments);

module.exports = router;







