// Simple database connection test
const { Sequelize } = require('sequelize');

// Try SQLite first
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './test-database.sqlite',
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('SQLite connection successful!');
    
    // Test creating a simple table
    const User = sequelize.define('User', {
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
    
    await User.sync({ alter: true });
    console.log('Table creation successful!');
    
    await sequelize.close();
    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('SQLite test failed:', error.message);
    
    // Try MySQL if SQLite fails
    console.log('Trying MySQL connection...');
    const mysqlSequelize = new Sequelize(
      'fashion_design_db',
      'root',
      '',
      {
        host: 'localhost',
        port: 3306,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
          connectTimeout: 5000
        }
      }
    );
    
    try {
      await mysqlSequelize.authenticate();
      console.log('MySQL connection successful!');
      await mysqlSequelize.close();
    } catch (mysqlError) {
      console.error('MySQL test failed:', mysqlError.message);
      console.log('Please make sure you have a database server running.');
    }
  }
}

testConnection();