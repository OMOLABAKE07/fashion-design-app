const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Vue dev server
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Fashion Design App API is running' });
});

// Customer endpoints
app.get('/api/customers', (req, res) => {
  // Mock data - replace with actual database queries
  res.json([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' }
  ]);
});

app.get('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;
  // Mock data - replace with actual database query
  res.json({ id: customerId, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' });
});

app.post('/api/customers', (req, res) => {
  const customerData = req.body;
  // Mock response - replace with actual database insert
  res.status(201).json({ id: 3, ...customerData });
});

app.put('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;
  const customerData = req.body;
  // Mock response - replace with actual database update
  res.json({ id: customerId, ...customerData });
});

app.delete('/api/customers/:id', (req, res) => {
  const customerId = req.params.id;
  // Mock response - replace with actual database delete
  res.json({ message: `Customer ${customerId} deleted successfully` });
});

// Measurement endpoints
app.get('/api/measurements', (req, res) => {
  // Mock data - replace with actual database queries
  res.json([
    { id: 1, customerId: 1, category: 'shirt', measurements: { chest: 42, waist: 36 } },
    { id: 2, customerId: 2, category: 'pants', measurements: { waist: 32, inseam: 30 } }
  ]);
});

app.get('/api/measurements/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  // Mock data - replace with actual database query
  res.json([
    { id: 1, customerId: customerId, category: 'shirt', measurements: { chest: 42, waist: 36 } }
  ]);
});

// Design endpoints
app.get('/api/designs', (req, res) => {
  // Mock data - replace with actual database queries
  res.json([
    { id: 1, customerId: 1, name: 'Summer Dress', description: 'Lightweight cotton dress' },
    { id: 2, customerId: 2, name: 'Business Suit', description: 'Formal suit for meetings' }
  ]);
});

app.get('/api/designs/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  // Mock data - replace with actual database query
  res.json([
    { id: 1, customerId: customerId, name: 'Summer Dress', description: 'Lightweight cotton dress' }
  ]);
});

// Message endpoints
app.get('/api/messages', (req, res) => {
  // Mock data - replace with actual database queries
  res.json([
    { id: 1, customerId: 1, subject: 'Order Status', content: 'Your order is being processed' },
    { id: 2, customerId: 2, subject: 'Appointment', content: 'Meeting scheduled for tomorrow' }
  ]);
});

app.get('/api/messages/customer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  // Mock data - replace with actual database query
  res.json([
    { id: 1, customerId: customerId, subject: 'Order Status', content: 'Your order is being processed' }
  ]);
});

// Serve frontend for any other routes (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Fashion Design App server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});