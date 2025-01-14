const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    usertype: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    status: {
        type: Number,
        required: true,
        default: 0
    },
    created_at: {
        type: String,
        required: true,
        default: Date.now,
    }
});

module.exports = mongoose.model("User", userSchema);
