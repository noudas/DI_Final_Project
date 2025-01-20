// src/controllers/userController.js
const User = require('../models/user');

exports.createUser = async (userData) => {
    try {
        const newUser = new User(userData);
        return await newUser.save();
    } catch (error) {
        throw error;
    }
};

exports.getUserById = async (userId) => {
    try {
        return await User.findById(userId);
    } catch (error) {
        throw error;
    }
};

exports.getAllUsers = async () => {
    try {
        return await User.find({});
    } catch (error) {
        throw error;
    }
};

exports.updateUser = async (userId, userData) => {
    try {
        return await User.findByIdAndUpdate(userId, userData, { new: true });
    } catch (error) {
        throw error;
    }
};

exports.deleteUser = async (userId) => {
    try {
        return await User.findByIdAndDelete(userId);
    } catch (error) {
        throw error;
    }
};
