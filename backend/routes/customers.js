const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// GET /api/customers - Get all customers (with optional search)
router.get('/', customerController.getAllCustomers);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', customerController.getCustomerById);

// POST /api/customers - Create a new customer
router.post('/', customerController.createCustomer);

// PUT /api/customers/:id - Update customer
router.put('/:id', customerController.updateCustomer);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;