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
        return await Template.findById(templateId)
            .populate('createdBy', 'firstName lastName') // Populate worker details
            .populate('categoryId', 'name'); // Populate category details
    } catch (error) {
        throw error;
    }
};

exports.getAllTemplates = async () => {
    try {
        return await Template.find({})
            .populate('createdBy', 'firstName lastName')
            .populate('categoryId', 'name'); // Include related fields
    } catch (error) {
        throw error;
    }
};

exports.updateTemplate = async (templateId, templateData) => {
    try {
        templateData.updatedAt = Date.now(); // Update the `updatedAt` timestamp
        return await Template.findByIdAndUpdate(templateId, templateData, { new: true })
            .populate('createdBy', 'firstName lastName')
            .populate('categoryId', 'name');
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
