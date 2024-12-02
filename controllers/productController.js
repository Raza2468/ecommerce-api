const Product = require('../models/productSchema');

// @desc Create a new product
// @route POST /v1/products
// @access Public
exports.create = async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, description, price, category, stock.',
            });
        }

        // Create a new product
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            stock,
            image,
        });

        const savedProduct = await newProduct.save();

        return res.status(201).json({
            success: true,
            message: 'Product created successfully.',
            data: savedProduct,
        });
    } catch (error) {
        if (error.code === 11000) {  // MongoDB duplicate key error
            return res.status(409).json({
                success: false,
                message: 'Product with this name already exists.',
                error: error.message,
            });
        }

        // Other errors
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Get all products
// @route GET /v1/products
// @access Public
exports.getAll = async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({
            success: true,
            data: products,
            totalproducts: products.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Get a product by ID
// @route GET /v1/products/:id
// @access Public
exports.getById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }
        return res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Update a product by ID
// @route PUT /v1/products/:id
// @access Public
exports.update = async (req, res) => {
    try {
        const { name, description, price, category, stock, image } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, category, stock, image },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully.',
            data: updatedProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// @desc Delete a product by ID
// @route DELETE /v1/products/:id
// @access Public
exports.delete = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully.',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};
