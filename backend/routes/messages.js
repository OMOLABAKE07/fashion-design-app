const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// GET /api/messages - Get all messages
router.get('/', messageController.getAllMessages);

// GET /api/messages/customer/:customerId - Get messages by customer ID
router.get('/customer/:customerId', messageController.getMessagesByCustomerId);

// GET /api/messages/:id - Get message by ID
router.get('/:id', messageController.getMessageById);

// POST /api/messages - Create a new message
router.post('/', messageController.createMessage);

// PUT /api/messages/:id - Update message
router.put('/:id', messageController.updateMessage);

// DELETE /api/messages/:id - Delete message
router.delete('/:id', messageController.deleteMessage);

module.exports = router;