// src/controllers/contextController.js
const Context = require("../models/context");

exports.createContext = async (contextData) => {
    try {
        const newContext = new Context(contextData);
        return await newContext.save();
    } catch (error) {
        throw error;
    }
};

exports.getContextById = async (contextId) => {
    try {
        return await Context.findById(contextId).populate('words.categoryId').populate('words.templateId');
    } catch (error) {
        throw error;
    }
};

exports.getAllContexts = async () => {
    try {
        return await Context.find({}).populate('words.categoryId').populate('words.templateId');
    } catch (error) {
        throw error;
    }
};

exports.updateContext = async (contextId, contextData) => {
    try {
        return await Context.findByIdAndUpdate(contextId, contextData, { new: true });
    } catch (error) {
        throw error;
    }
};

exports.deleteContext = async (contextId) => {
    try {
        return await Context.findByIdAndDelete(contextId);
    } catch (error) {
        throw error;
    }
};

// Add words to a context
exports.addWordsToContext = async (contextId, words) => {
    try {
        const context = await Context.findById(contextId);
        if (!context) {
            throw new Error("Context not found");
        }
        context.words.push(...words);
        return await context.save();
    } catch (error) {
        throw error;
    }
};

// Remove a word from a context
exports.removeWordFromContext = async (contextId, wordId) => {
    try {
        const context = await Context.findById(contextId);
        if (!context) {
            throw new Error("Context not found");
        }
        context.words = context.words.filter(word => word._id.toString() !== wordId);
        return await context.save();
    } catch (error) {
        throw error;
    }
};

// Get words by context
exports.getWordsByContext = async (contextId) => {
    try {
        const context = await Context.findById(contextId).populate('words.categoryId').populate('words.templateId');
        if (!context) {
            throw new Error("Context not found");
        }
        return context.words;
    } catch (error) {
        throw error;
    }
};
