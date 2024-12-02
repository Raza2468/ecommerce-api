const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Order = require('../models/orderSchema');


//@desc Get a user by ID
//@routee GET /users/:id
//@access Public
exports.getById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


//@desc Get all users
//@routee GET /users
//@access Admin
exports.getAll = async (req, res,) => {
    try {
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};


//@desc Update a user by ID
//@routee PUT /users/:id
//@access Public/Admin
exports.update = async (req, res) => {
    try {
        const { name, password,email } = req.body; // Only allow name and password to be updated
        const userId = req.params.id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        if (name) user.name = name;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        //  // Validate and update fields
        //  if (email && email !== user.email) {
        //     // Check if the email is already taken by another user
        //     const existingUser = await User.findOne({ email });
        //     if (existingUser) {
        //         return res.status(409).json({
        //             success: false,
        //             message: 'Email already exists.',
        //         });
        //     }
        //     user.email = email;
        // }

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully.',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email, 
                password: updatedUser.password, 
                role: updatedUser.role,
            },
        });
    } catch (error) {
        console.error('Error during user update:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};



//@desc Delete a user by ID
//@routee DELETE /users/:id
//@access Admin

exports.delete = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully.',
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};






// exports.getOrderHistory = async (req, res) => {
//     try {
//         const userId = req.params.id;

//         // Fetch the user and populate orders and product details
//         const user = await User.findById(userId)
//             .populate({
//                 path: 'orders',  // Populate the orders array
//                 populate: {
//                     path: 'products.product',  // Populate the product details in each order
//                     select: 'name price description'  // Select specific fields from the product
//                 }
//             });

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'User not found.',
//             });
//         }

//         // Return the populated order details, including product details
//         return res.status(200).json({
//             success: true,
//             message: 'Order history retrieved successfully.',
//             data: user.orders,  // Return populated orders, which includes the products
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: 'Internal Server Error',
//             error: error.message,
//         });
//     }
// };

