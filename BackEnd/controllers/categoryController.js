// src/controllers/categoryController.js
const Category = require("../models/category");

exports.createCategory = async (categoryData) => {
    try {
        const newCategory = new Category(categoryData);
        return await newCategory.save();
    } catch (error) {
        throw error;
    }
};

exports.getCategorybyId = async (categoryId) => {
    try {
        return await Category.findById(categoryId);
    } catch (error) {
        throw error;
    }
};

exports.getAllCategories = async () => {
    try {
        return await Category.find({});
    } catch (error) {
        throw error;
    }
};

exports.updateCategory = async (categoryId, categoryData) => {
    try {
        return await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
    } catch (error) {
        throw error;
    }
};

exports.deleteCategory = async (categoryId) => {
    try {
        return await Category.findByIdAndDelete(categoryId);
    } catch (error) {
        throw error;
    }
};