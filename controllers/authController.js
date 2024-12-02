const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');


//@desc Register a new user
//@routee POST /v1/auth/register
//@access Public

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(422).json({
                success: false,
                message: 'Name, email, and password are required.',
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already exists.',
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: 'user', // Default role
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email,
                role: savedUser.role,
            },
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



//@desc Login user
//@routee POST /v1/auth/login
//@access Public

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(422).json({
                success: false,
                message: 'Email and password are required.',
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
            });
        }

        // Generate a JWT token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.SERVERSECRETKEY,
            { expiresIn: '5d' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
