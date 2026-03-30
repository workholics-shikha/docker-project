const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        default: '',
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    color: {
        type: String,
    }
     
}, {
    timestamps: true,
});

module.exports = mongoose.model('user', userSchema);
