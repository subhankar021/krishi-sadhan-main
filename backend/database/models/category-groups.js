const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryGroupId: { type: Number, required: true },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const CategoryGroups = mongoose.models.CategoryGroups || mongoose.model('CategoryGroups', categorySchema, 'category-groups');

module.exports = CategoryGroups;