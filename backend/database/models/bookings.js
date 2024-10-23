const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    bookingId: { type: Number, required: true },
    bookingNumber: { type: String, required: true },
    equipmentId: { type: Number, required: true },
    userId: { type: Number, required: true },
    bookingDate: { type: Date, required: true },
    price: { type: Number, required: true },
    status: { type: String }
}, {
    timestamps: true
});

const Bookings = mongoose.models.Bookings || mongoose.model('Bookings', bookingSchema, 'bookings');

module.exports = Bookings;