const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    orders: {
        type: [{ type: mongoose.Schema.Types.ObjectId }],
        ref: 'order', // Reference to the Order model
        default: undefined
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
