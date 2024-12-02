const express = require('express');
const orderController = require('../controllers/orderController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a new order
router.post('/', orderController.create);

// Route to get all orders (Admin only)
router.get('/', authenticate, checkRole('admin'), orderController.getAll);

// Route to get a single order by ID (Admin or user who made the order)
router.get('/:id', orderController.getById);

// Route to update an order (Admin only)
router.put('/:id', authenticate, checkRole('admin'), orderController.update);

// Route to delete an order (Admin only)
router.delete('/:id', authenticate, checkRole('admin'), orderController.delete);

module.exports = router;
