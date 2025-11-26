const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createPayment,
  getPayments,
  updatePaymentStatus
} = require('../controllers/paymentController');

router.use(auth);

router.post('/', createPayment);
router.get('/', getPayments);
router.put('/:id/status', updatePaymentStatus);

module.exports = router;







