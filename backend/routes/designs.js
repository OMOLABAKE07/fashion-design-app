const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');

// GET /api/designs - Get all designs
router.get('/', designController.getAllDesigns);

// GET /api/designs/customer/:customerId - Get designs by customer ID
router.get('/customer/:customerId', designController.getDesignsByCustomerId);

// GET /api/designs/:id - Get design by ID
router.get('/:id', designController.getDesignById);

// POST /api/designs - Create a new design
router.post('/', designController.createDesign);

// PUT /api/designs/:id - Update design
router.put('/:id', designController.updateDesign);

// DELETE /api/designs/:id - Delete design
router.delete('/:id', designController.deleteDesign);

module.exports = router;