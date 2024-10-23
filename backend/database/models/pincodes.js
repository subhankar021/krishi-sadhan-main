const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
    villageId: { type: Number, required: true, unique: true },
    village: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    loc: {
        type: { type: String },
        coordinates: [Number],
    }
}, {
    timestamps: true
})

const PinCodes = mongoose.models.PinCodes || mongoose.model('PinCodes', pincodeSchema, 'PinCodes');

module.exports = PinCodes;