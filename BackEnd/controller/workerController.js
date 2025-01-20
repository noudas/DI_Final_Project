// src/controllers/workerController.js
const Worker = require('../models/worker');

exports.createWorker = async (workerData) => {
    try {
        const newWorker = new Worker(workerData);
        return await newWorker.save();
    } catch (error) {
        throw error;
    }
};

exports.getWorkerById = async (workerId) => {
    try {
        return await Worker.findById(workerId);
    } catch (error) {
        throw error;
    }
};

exports.getAllWorkers = async () => {
    try {
        return await Worker.find({});
    } catch (error) {
        throw error;
    }
};

exports.updateWorker = async (workerId, workerData) => {
    try {
        return await Worker.findByIdAndUpdate(workerId, workerData, { new: true });
    } catch (error) {
        throw error;
    }
};

exports.deleteWorker = async (workerId) => {
    try {
        return await Worker.findByIdAndDelete(workerId);
    } catch (error) {
        throw error;
    }
};
