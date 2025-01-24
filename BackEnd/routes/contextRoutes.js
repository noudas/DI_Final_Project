const express = require('express');
const router = express.Router();
const { client } = require('../connection/db');
const { ObjectId } = require('mongodb');

const getContextCollection = async () => {
    const db = client.db("DIFinalProject"); // Replace with your database name
    return db.collection("contexts"); // Ensure your collection name matches
};

// Route to create a new context
router.post('/', async (req, res) => {
    try {
        const { name, description, words } = req.body;
        const contextCollection = await getContextCollection();
        const result = await contextCollection.insertOne({ name, description, words, createdAt: new Date(), updatedAt: new Date() });
        res.status(201).json({ message: 'Context created successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating context', error });
    }
});

// Route to fetch a single context by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contextCollection = await getContextCollection();
        const context = await contextCollection.findOne({ _id: new ObjectId(id) });
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
        const contextCollection = await getContextCollection();
        const contexts = await contextCollection.find({}).toArray();
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
        const contextCollection = await getContextCollection();
        const result = await contextCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { ...updateData, updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        if (result.value) {
            return res.status(404).json({ message: 'Context not found' });
        }
        res.status(200).json({ message: 'Context updated successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating context', error });
    }
});

// Route to delete a context by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const contextCollection = await getContextCollection();
        const result = await contextCollection.findOneAndDelete({ _id: new ObjectId(id) });
        if (result.value) {
            return res.status(404).json({ message: 'Context not found' });
        }
        res.status(200).json({ message: 'Context deleted successfully', result });
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
        const contextCollection = await getContextCollection();
        const result = await contextCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $push: { words: { $each: words } }, $set: { updatedAt: new Date() } },
            { returnDocument: 'after' }
        );
        if (result.value) {
            return res.status(404).json({ message: 'Context not found' });
        }
        res.status(200).json({ message: 'Words added successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding words', error });
    }
});

// Route to remove a word from a context
router.delete('/:id/words', async (req, res) => {
    const { id } = req.params;
    try {
        const contextCollection = await getContextCollection();
        const result = await contextCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: { words: [], updatedAt: new Date() } }, // Clears the words array
            { returnDocument: 'after' }
        );

        if (!result) {
            // If no document was found
            return res.status(404).json({ message: 'Context not found' });
        }

        res.status(200).json({ message: 'Words array cleared successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error clearing words', error });
    }
});


module.exports = router;
