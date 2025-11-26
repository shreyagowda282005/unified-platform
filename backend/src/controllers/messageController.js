const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, campaignId, content, attachments } = req.body;

    const message = new Message({
      senderId: req.user._id,
      receiverId,
      campaignId,
      content,
      attachments
    });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { receiverId: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$senderId', req.user._id] },
              '$receiverId',
              '$senderId'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', req.user._id] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id }
      ]
    })
    .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { senderId: userId, receiverId: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







