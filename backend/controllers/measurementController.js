const Measurement = require('../models/measurement');
const Customer = require('../models/customer');

// Get all measurements
const getAllMeasurements = async (req, res) => {
  try {
    const measurements = await Measurement.findAll({
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
};

// Get measurements by customer ID
const getMeasurementsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const measurements = await Measurement.findAll({
      where: { customerId },
      order: [['created_at', 'DESC']]
    });
    res.json(measurements);
  } catch (error) {
    console.error('Error fetching measurements:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
};

// Get measurement by ID
const getMeasurementById = async (req, res) => {
  try {
    const { id } = req.params;
    const measurement = await Measurement.findByPk(id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!measurement) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    
    res.json(measurement);
  } catch (error) {
    console.error('Error fetching measurement:', error);
    res.status(500).json({ error: 'Failed to fetch measurement' });
  }
};

// Create measurement
const createMeasurement = async (req, res) => {
  try {
    const measurementData = req.body;
    
    // Validate that customer exists
    const customer = await Customer.findByPk(measurementData.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Set customer name if not provided
    if (!measurementData.customerName) {
      measurementData.customerName = customer.name;
    }
    
    const measurement = await Measurement.create(measurementData);
    
    // Include customer info in response
    const measurementWithCustomer = await Measurement.findByPk(measurement.id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.status(201).json(measurementWithCustomer);
  } catch (error) {
    console.error('Error creating measurement:', error);
    res.status(500).json({ error: 'Failed to create measurement' });
  }
};

// Update measurement
const updateMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    const measurementData = req.body;
    
    const [updatedRowsCount] = await Measurement.update(measurementData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    
    const updatedMeasurement = await Measurement.findByPk(id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.json(updatedMeasurement);
  } catch (error) {
    console.error('Error updating measurement:', error);
    res.status(500).json({ error: 'Failed to update measurement' });
  }
};

// Delete measurement
const deleteMeasurement = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRowsCount = await Measurement.destroy({
      where: { id }
    });
    
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Measurement not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting measurement:', error);
    res.status(500).json({ error: 'Failed to delete measurement' });
  }
};

module.exports = {
  getAllMeasurements,
  getMeasurementsByCustomerId,
  getMeasurementById,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement
};