// Sync Queue model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SyncQueue = sequelize.define('SyncQueue', {
  id: {
    type: DataTypes.STRING(100),
    primaryKey: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  operation: {
    type: DataTypes.ENUM('create', 'update', 'delete'),
    allowNull: false
  },
  entityType: {
    type: DataTypes.ENUM('customer', 'measurement', 'design', 'message'),
    allowNull: false,
    field: 'entity_type'
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastAttempt: {
    type: DataTypes.DATE,
    field: 'last_attempt'
  },
  status: {
    type: DataTypes.ENUM('pending', 'retry', 'failed', 'completed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'sync_queue',
  timestamps: true
});

module.exports = SyncQueue;