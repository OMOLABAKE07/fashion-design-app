const Design = require('../models/design');
const Customer = require('../models/customer');

// Get all designs
const getAllDesigns = async (req, res) => {
  try {
    const designs = await Design.findAll({
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
};

// Get designs by customer ID
const getDesignsByCustomerId = async (req, res) => {
  try {
    const { customerId } = req.params;
    const designs = await Design.findAll({
      where: { customerId }
    });
    res.json(designs);
  } catch (error) {
    console.error('Error fetching designs:', error);
    res.status(500).json({ error: 'Failed to fetch designs' });
  }
};

// Get design by ID
const getDesignById = async (req, res) => {
  try {
    const { id } = req.params;
    const design = await Design.findByPk(id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }
    
    res.json(design);
  } catch (error) {
    console.error('Error fetching design:', error);
    res.status(500).json({ error: 'Failed to fetch design' });
  }
};

// Create design
const createDesign = async (req, res) => {
  try {
    const designData = req.body;
    
    // Validate that customer exists
    const customer = await Customer.findByPk(designData.customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    const design = await Design.create(designData);
    
    // Include customer info in response
    const designWithCustomer = await Design.findByPk(design.id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.status(201).json(designWithCustomer);
  } catch (error) {
    console.error('Error creating design:', error);
    res.status(500).json({ error: 'Failed to create design' });
  }
};

// Update design
const updateDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const designData = req.body;
    
    const [updatedRowsCount] = await Design.update(designData, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }
    
    const updatedDesign = await Design.findByPk(id, {
      include: [{
        model: Customer,
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.json(updatedDesign);
  } catch (error) {
    console.error('Error updating design:', error);
    res.status(500).json({ error: 'Failed to update design' });
  }
};

// Delete design
const deleteDesign = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRowsCount = await Design.destroy({
      where: { id }
    });
    
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Design not found' });
    }
    
    // Return a success message instead of 204 No Content
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Error deleting design:', error);
    res.status(500).json({ error: 'Failed to delete design' });
  }
};

module.exports = {
  getAllDesigns,
  getDesignsByCustomerId,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign
};