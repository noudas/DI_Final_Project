// src/models/context.js
const mongoose = require('mongoose');

const contextSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Automatically manages `createdAt` and `updatedAt`
});

const Context = mongoose.model('Context', contextSchema);

module.exports = Context;