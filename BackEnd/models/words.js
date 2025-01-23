// src/models/word.js
const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        trim: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the Categories collection
        required: true
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template', // Reference to the Templates collection
        required: true
    },
    contextId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Context', // Reference to the Contexts collection
        required: true
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

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
