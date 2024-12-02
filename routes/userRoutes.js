const express = require('express');
const userController = require('../controllers/userController');
const { authenticate, checkRole } = require('../middleware/authMiddleware');


const router = express.Router();


router.get('/:id', userController.getById);

// Route to update user information
router.put('/:id', userController.update);

// Route to delete a user (Admin only)
router.delete('/:id', authenticate, checkRole('admin'), userController.delete); // Sirf admin delete ya disable kar sakta hai, aur abhi ke liye sirf delete hai.

// Route to delete a user (Admin only)
router.get('/', authenticate, checkRole('admin'), userController.getAll); // Only admin can get all users

// Get user order history
// router.get('/userorder/:id', userController.getOrderHistory);


module.exports = router;
