const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const customerRoutes = require('./routes/customers');
const measurementRoutes = require('./routes/measurements');
const designRoutes = require('./routes/designs');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for file uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/messages', messageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Fashion Design Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Application error:', err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
const initializeApp = async () => {
  try {
    // console.log('Attempting to connect to database...');
    await sequelize.authenticate();
    // console.log('Database connection has been established successfully.');
    
    // Sync models
    await sequelize.sync({ alter: true });
    // console.log('All models were synchronized successfully.');
    
    // Start server
    const server = app.listen(PORT, () => {
      // console.log(`Server is running on port ${PORT}`);
      // console.log(`Health check endpoint: http://localhost:${PORT}/api/health`);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      // console.log('Shutting down gracefully...');
      await sequelize.close();
      server.close(() => {
        // console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Unable to start the application:', error);
    // console.log('Please check your database configuration and ensure your database server is running.');
    process.exit(1);
  }
};

initializeApp();

module.exports = app;