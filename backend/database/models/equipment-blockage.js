const mongoose = require('mongoose');

const equipmentBlockageSchema = new mongoose.Schema({
    blockageId: { type: Number, required: true },
    equipmentId: { type: Number, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const EquipmentBlockage = mongoose.models.EquipmentBlockage || mongoose.model('EquipmentBlockage', equipmentBlockageSchema, 'equipment_blockage');

module.exports = EquipmentBlockage;