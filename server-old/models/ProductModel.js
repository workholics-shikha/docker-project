
const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: '',
    },
    price: {
        type: Number,
        required: true,
        unique: true,
    },
    category: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }

}, {
    timestamps: true,
});

module.exports = mongoose.model('product', productSchema);