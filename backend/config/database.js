const { Sequelize } = require('sequelize');
require('dotenv').config();

// Try to connect to MySQL first, fallback to SQLite if MySQL is not available
let sequelize;

try {
  // First, try MySQL configuration
  sequelize = new Sequelize(
    process.env.DB_NAME || 'fashion_design_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      dialectOptions: {
        connectTimeout: 10000 // 10 seconds timeout
      }
    }
  );
  
  // console.log('Attempting MySQL connection...');
} catch (mysqlError) {
  // console.log('MySQL configuration failed, falling back to SQLite...');
  // Fallback to SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

module.exports = sequelize;