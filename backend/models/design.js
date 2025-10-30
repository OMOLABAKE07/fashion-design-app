// Design model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');

const Design = sequelize.define('Design', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Customer,
      key: 'id'
    },
    field: 'customer_id'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('draft', 'in_progress', 'completed', 'delivered'),
    defaultValue: 'draft'
  },
  part_payment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'part_payment'
  },
  balance_to_pay: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'balance_to_pay'
  }
}, {
  tableName: 'designs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Customer.hasMany(Design, { foreignKey: 'customerId' });
Design.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = Design;