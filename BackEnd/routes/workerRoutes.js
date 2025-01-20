// src/routes/workerRoutes.js
const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

router.post('/register', async (req, res) => {
    try {
        const newWorker = await workerController.createWorker(req.body);
        res.status(201).json(newWorker);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const worker = await workerController.getWorkerById(req.params.id);
        if (!worker) {
            return res.status(404).json({ message: 'Worker not found' });
        }
        res.json(worker);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const workers = await workerController.getAllWorkers();
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedWorker = await workerController.updateWorker(req.params.id, req.body);
        res.json(updatedWorker);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await workerController.deleteWorker(req.params.id);
        res.status(204).json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;