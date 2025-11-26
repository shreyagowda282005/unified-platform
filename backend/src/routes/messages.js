const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  sendMessage,
  getConversations,
  getMessages
} = require('../controllers/messageController');

router.use(auth);

router.post('/', sendMessage);
router.get('/conversations', getConversations);
router.get('/:userId', getMessages);

module.exports = router;







