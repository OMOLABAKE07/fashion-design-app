// Measurement model
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customer');

const Measurement = sequelize.define('Measurement', {
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
  customerName: {
    type: DataTypes.STRING(200),
    allowNull: false,
    field: 'customer_name'
  },
  measurementDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'measurement_date'
  },
  notes: {
    type: DataTypes.TEXT
  },
  // Bust measurements
  bust: {
    type: DataTypes.DECIMAL(5, 2)
  },
  shoulderToUnderBust: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'shoulder_to_under_bust'
  },
  shoulderToUpperBust: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'shoulder_to_upper_bust'
  },
  shoulderToNipplePoint: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'shoulder_to_nipple_point'
  },
  nippleToNipple: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'nipple_to_nipple'
  },
  roundUpperBust: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'round_upper_bust'
  },
  roundUnderBust: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'round_under_bust'
  },
  // Shoulder measurements
  shoulder: {
    type: DataTypes.DECIMAL(5, 2)
  },
  // Length measurements
  halfLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'half_length'
  },
  blouseLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'blouse_length'
  },
  longGownLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'long_gown_length'
  },
  shortGownLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'short_gown_length'
  },
  threeQuarterGownLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'three_quarter_gown_length'
  },
  trouserLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'trouser_length'
  },
  // Sleeve measurements
  roundSleeve: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'round_sleeve'
  },
  biceps: {
    type: DataTypes.DECIMAL(5, 2)
  },
  elbow: {
    type: DataTypes.DECIMAL(5, 2)
  },
  longSleeve: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'long_sleeve'
  },
  shortSleeve: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'short_sleeve'
  },
  threeQuarterSleeve: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'three_quarter_sleeve'
  },
  // Skirt measurements
  longSkirt: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'long_skirt'
  },
  shortSkirt: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'short_skirt'
  },
  threeQuarterSkirt: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'three_quarter_skirt'
  },
  // Gown measurements
  gownLongLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'gown_long_length'
  },
  gownShortLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'gown_short_length'
  },
  gownThreeQuarterLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'gown_three_quarter_length'
  },
  // Trouser measurements
  waist: {
    type: DataTypes.DECIMAL(5, 2)
  },
  band: {
    type: DataTypes.DECIMAL(5, 2)
  },
  thigh: {
    type: DataTypes.DECIMAL(5, 2)
  },
  knee: {
    type: DataTypes.DECIMAL(5, 2)
  },
  inseam: {
    type: DataTypes.DECIMAL(5, 2)
  },
  outseam: {
    type: DataTypes.DECIMAL(5, 2)
  },
  ankle: {
    type: DataTypes.DECIMAL(5, 2)
  },
  crotch: {
    type: DataTypes.DECIMAL(5, 2)
  },
  calf: {
    type: DataTypes.DECIMAL(5, 2)
  },
  // Agbada measurements
  agbadaLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'agbada_length'
  },
  agbadaShoulder: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'agbada_shoulder'
  },
  agbadaChest: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'agbada_chest'
  },
  agbadaSleeve: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'agbada_sleeve'
  },
  // Top measurements
  topLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'top_length'
  },
  kaftanLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'kaftan_length'
  },
  jalamiaLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'jalamia_length'
  },
  shirtLength: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'shirt_length'
  },
  topShoulder: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'top_shoulder'
  },
  neck: {
    type: DataTypes.DECIMAL(5, 2)
  },
  chest: {
    type: DataTypes.DECIMAL(5, 2)
  },
  bustUpperChest: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'bust_upper_chest'
  },
  stomach: {
    type: DataTypes.DECIMAL(5, 2)
  },
  capSize: {
    type: DataTypes.DECIMAL(5, 2),
    field: 'cap_size'
  },
  categories: {
    type: DataTypes.JSON
  }
}, {
  tableName: 'measurements',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Customer.hasMany(Measurement, { foreignKey: 'customerId' });
Measurement.belongsTo(Customer, { foreignKey: 'customerId' });

module.exports = Measurement;