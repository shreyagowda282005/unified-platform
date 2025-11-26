const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Temporary route to fix existing users
router.post('/fix-users', async (req, res) => {
  try {
    // Update all users without a name
    const result = await User.updateMany(
      { name: { $exists: false } },
      { $set: { name: '' } }
    );
    
    res.json({ 
      message: 'Users fixed', 
      modifiedCount: result.modifiedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all users (use only in development!)
router.delete('/delete-all-users', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ 
      message: 'All users deleted', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;