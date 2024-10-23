const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    equipmentId: { type: Number, required: true },
    categoryId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    aggregatorId: { type: Number },
    imageUrl: { type: String },
    price: { type: Number, required: true },
    viewCount: { type: Number, default: 0 },
    villageIds: [{ type: Number }],
    pincode: { type: Number },
    isActive: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Equipments = mongoose.models.Equipments || mongoose.model('Equipments', equipmentSchema, 'equipments');

module.exports = Equipments;