const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: { type: Number, required: true },
    fullName: { type: String, required: false },
    email: { type: String, required: false },
    phoneNumber: { type: Number, required: false, unique: true },
    address: {
        line1: { type: String, required: false },
        line2: { type: String, required: false },
        villageId: { type: Number, required: false },
        pinCode: { type: Number, required: false }
    },
    otp: { type: String, required: false },
    isOtpVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');
module.exports = User;
