const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryId: { type: Number, required: true },
    categoryGroupId: { type: Number, required: true },
    name: { type: String, required: true },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Categories = mongoose.models.Categories || mongoose.model('Categories', categorySchema, 'categories');

module.exports = Categories;