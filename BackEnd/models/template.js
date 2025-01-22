// src/models/template.js
const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    workerName: {
        type: String,
        required: true,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker', // Reference to the Workers collection
        required: true
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Flexible type to allow objects for future expansion
        required: true
    },
    shared: {
        type: Boolean,
        default: false
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Categories collection
        required: false
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
    timestamps: true // Automatically manages `createdAt` and `updatedAt` fields
});

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
