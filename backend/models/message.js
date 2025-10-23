// Message model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Customer,
      key: 'id'
    },
    field: 'customer_id'
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('unread', 'read', 'archived', 'sent'), // Added 'sent' to match frontend
    defaultValue: 'unread'
  }
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Customer.hasMany(Message, { foreignKey: 'customerId' });
Message.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = Message;