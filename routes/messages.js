const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Get all messages between two users
router.get('/:senderId/:receiverId', messageController.getMessages);

module.exports = router;
