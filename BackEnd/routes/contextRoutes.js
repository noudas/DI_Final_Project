const express = require('express');
const router = express.Router();
const { client } = require('../connection/db');
const { ObjectId } = require('mongodb');
const Context = require('../models/context'); // Mongoose model

// Route to create a new context
router.post('/create', async (req, res) => {
    try {
        const { name, description, words } = req.body;
        const newContext = new Context({ name, description, words });
        await newContext.save();
        res.status(201).json({ message: 'Context created successfully', context: newContext });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating context', error });
    }
});

// Route to fetch a single context by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const context = await Context.findById(ObjectId(id));
        if (!context) {
            return res.status(404).json({ message: 'Context not found' });
        }
        res.status(200).json(context);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching context', error });
    }
});

// Route to fetch all contexts
router.get('/', async (req, res) => {
    try {
        const contexts = await Context.find({});
        res.status(200).json(contexts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching contexts', error });
    }
});

// Route to update a context by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedContext = await Context.findByIdAndUpdate(ObjectId(id), updateData, { new: true });
        if (!updatedContext) {
            return res.status(404).json({ message: 'Context not found' });
        }
        res.status(200).json({ message: 'Context updated successfully', context: updatedContext });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating context', error });
    }
});

// Route to delete a context by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedContext = await Context.findByIdAndDelete(ObjectId(id));
        if (!deletedContext) {
            return res.status(404).json({ message: 'Context not found' });
        }
        res.status(200).json({ message: 'Context deleted successfully', context: deletedContext });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting context', error });
    }
});

// Route to add words to a context
router.post('/:id/words', async (req, res) => {
    const { id } = req.params;
    const { words } = req.body;
    try {
        const context = await Context.findById(ObjectId(id));
        if (!context) {
            return res.status(404).json({ message: 'Context not found' });
        }
        context.words.push(...words);
        await context.save();
        res.status(200).json({ message: 'Words added successfully', context });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding words', error });
    }
});

// Route to remove a word from a context
router.delete('/:id/words/:wordId', async (req, res) => {
    const { id, wordId } = req.params;
    try {
        const context = await Context.findById(ObjectId(id));
        if (!context) {
            return res.status(404).json({ message: 'Context not found' });
        }
        context.words = context.words.filter(word => word._id.toString() !== wordId);
        await context.save();
        res.status(200).json({ message: 'Word removed successfully', context });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing word', error });
    }
});

module.exports = router;
