// Script to initialize the database and tables
require('dotenv').config();
const sequelize = require('../config/database');
const Customer = require('../models/customer');
const Measurement = require('../models/measurement');
const Design = require('../models/design');
const Message = require('../models/message');
const SyncQueue = require('../models/syncQueue');

const initDatabase = async () => {
  try {
    // Authenticate database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    console.log('Database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();