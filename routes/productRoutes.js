const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get all products
router.get('/', productController.getAll);

// Route to get a single product by ID
router.get('/:id', productController.getById);

// Route to create a new product
router.post('/', authenticate, checkRole('admin'), productController.create);

// Route to update a product by ID
router.put('/:id', authenticate, checkRole('admin'), productController.update);

// Route to delete a product by ID
router.delete('/:id', authenticate, checkRole('admin'), productController.delete);


module.exports = router;
