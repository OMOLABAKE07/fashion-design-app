const express = require('express');
const router = express.Router();
const measurementController = require('../controllers/measurementController');

// GET /api/measurements - Get all measurements
router.get('/', measurementController.getAllMeasurements);

// GET /api/measurements/customer/:customerId - Get measurements by customer ID
router.get('/customer/:customerId', measurementController.getMeasurementsByCustomerId);

// GET /api/measurements/:id - Get measurement by ID
router.get('/:id', measurementController.getMeasurementById);

// POST /api/measurements - Create a new measurement
router.post('/', measurementController.createMeasurement);

// PUT /api/measurements/:id - Update measurement
router.put('/:id', measurementController.updateMeasurement);

// DELETE /api/measurements/:id - Delete measurement
router.delete('/:id', measurementController.deleteMeasurement);

module.exports = router;