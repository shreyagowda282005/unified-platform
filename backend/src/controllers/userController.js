// Example userController.js
const User = require('../models/User');

exports.getUsersToMessage = async (req, res) => {
  try {
    // Fetch all users *except* the currently logged-in user
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('_id name profilePicture'); // Only select necessary fields

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};