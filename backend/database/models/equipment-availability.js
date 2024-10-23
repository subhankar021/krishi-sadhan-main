const mongoose = require('mongoose');

const equipmentAvailabilitySchema = new mongoose.Schema({
    availabilityId: { type: Number, required: true },
    equipmentId: { type: Number, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const EquipmentAvailability = mongoose.models.EquipmentAvailability || mongoose.model('EquipmentAvailability', equipmentAvailabilitySchema, 'equipment_availability');

module.exports = EquipmentAvailability;