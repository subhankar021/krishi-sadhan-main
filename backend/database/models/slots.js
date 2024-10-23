const mongoose = require('mongoose');

const slotConfigSchema = new mongoose.Schema({
    slotId: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    daysCount: { type: Number, required: true },
    isActive: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const SlotConfig = mongoose.models.SlotConfig || mongoose.model('SlotConfig', slotConfigSchema, 'slot_config');

module.exports = SlotConfig;