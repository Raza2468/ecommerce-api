const Order = require('../models/orderSchema'); 
const User = require('../models/userSchema');

// @desc Create a new order
// @route POST /v1/orders
// @access Private
exports.create = async (req, res) => {
    try {
        const { user, products, totalAmount } = req.body;

        // Validate required fields
        if (!user || !products || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'User, products, and totalAmount are required fields.',
            });
        }

        // Create new order
        const newOrder = new Order({
            user,
            products,
            totalAmount,
            status: 'pending', // Default status is 'pending'
        });

        // Save the order
        const savedOrder = await newOrder.save();

        // Add order reference to the user
        const userUpdate = await User.findByIdAndUpdate(user, {
            $push: { orders: savedOrder._id }  // Add the order ID to the user's orders array
        });

        // Populate the user and products fields
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate('user', 'name email')  
            .populate('products.product');  
        return res.status(201).json({
            success: true,
            message: 'Order created successfully.',
            data: populatedOrder,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Get all orders
// @route GET /v1/orders
// @access Private (Admin or User themselves)
exports.getAll = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('products.product');
        return res.status(200).json({
            success: true,
            data: orders,
            totalOrders: orders.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Get a single order by ID
// @route GET /v1/orders/:id
// @access Private (Admin or User themselves)
exports.getById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.',
            });
        }
        return res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Update an order by ID
// @route PUT /v1/orders/:id
// @access Private (Admin only)
exports.update = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order updated successfully.',
            data: updatedOrder,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Delete an order by ID
// @route DELETE /v1/orders/:id
// @access Private (Admin only)
exports.delete = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order deleted successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
