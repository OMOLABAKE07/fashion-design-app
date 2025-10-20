const Message = require('../models/message');
const Customer = require('../models/customer');

// Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get messages by customer ID
const getMessagesByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const messages = await Message.findAll({
      where: { customerId }
    });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Get message by ID
const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
};

// Create message
const createMessage = async (req, res) => {
  try {
    const messageData = req.body;
    
    // Validate that customer exists if customerId is provided
    if (messageData.customerId) {
      const customer = await Customer.findByPk(messageData.customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
    }
    
    const message = await Message.create(messageData);
    
    // Include customer info in response if customer exists
    let messageWithCustomer = message;
    if (message.customerId) {
      messageWithCustomer = await Message.findByPk(message.id, {
        include: [{
          model: Customer,
          attributes: ['id', 'name', 'email']
        }]
      });
    }
    
    res.status(201).json(messageWithCustomer);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

// Update message
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const messageData = req.body;
    
    const [updatedRowsCount] = await Message.update(messageData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    const updatedMessage = await Message.findByPk(id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.json(updatedMessage);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRowsCount = await Message.destroy({
      where: { id }
    });
    
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
};

module.exports = {
  getAllMessages,
  getMessagesByCustomerId,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage
};