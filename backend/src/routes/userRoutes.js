// Example userRoutes.js
const router = require('express').Router();
const { auth } = require('../middleware/auth');
const { getUsersToMessage } = require('../controllers/userController');

// ... other user routes

router.get('/messageable', auth, getUsersToMessage); 

module.exports = router;