// src/controllers/templateController.js
const Template = require("../models/template");

exports.createTemplate = async (templateData) => {
    try {
        const newTemplate = new Template(templateData);
        return await newTemplate.save();
    } catch (error) {
        throw error;
    }
};

exports.getTemplateById = async (templateId) => {
    try {
        return await Template.findById(templateId).populate('workerName', 'firstName lastName'); // Populate worker details if referenced
    } catch (error) {
        throw error;
    }
};

exports.getAllTemplates = async () => {
    try {
        return await Template.find({}).populate('workerName', 'firstName lastName'); // Populate worker details
    } catch (error) {
        throw error;
    }
};

exports.updateTemplate = async (templateId, templateData) => {
    try {
        templateData.updatedAt = Date.now(); // Update the `updatedAt` timestamp
        return await Template.findByIdAndUpdate(templateId, templateData, { new: true }).populate('workerName', 'firstName lastName');
    } catch (error) {
        throw error;
    }
};

exports.deleteTemplate = async (templateId) => {
    try {
        return await Template.findByIdAndDelete(templateId);
    } catch (error) {
        throw error;
    }
};
