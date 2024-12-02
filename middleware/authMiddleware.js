const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");


exports.authenticate = async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "You must be logged in to access this resource." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SERVERSECRETKEY);

        const currentUser = await User.findOne({ _id: decoded.id })
            .select('-password').exec();

        if (!currentUser) {
            return (res.status(401).json({
                message: "No user found associated with this token."
            }));
        }

        req.user = currentUser;
        next();

    } catch (error) {
        return res.status(401).json({
            statusCode: 401,
            message: "Invalid or expired token."
        })
    }
};


// Check Role middleware to ensure user has the required role
exports.checkRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ success: false, message: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
};

