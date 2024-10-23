const mongoose = require('mongoose');
const sequenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, default: 0 }
}, {
    timestamps: true
});

const Sequence = mongoose.models.Sequence || mongoose.model('Sequence', sequenceSchema);

module.exports = { Sequence };
