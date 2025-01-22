const express = require('express');
const router = express.Router();
const { client } = require('../connection/db');
const { ObjectId } = require('mongodb');

// Get the collection
const getCategoryCollection = async () => {
    const db = client.db("DIFinalProject"); // Replace with your database name
    return db.collection("categories"); // Ensure your collection name matches
};

// Create a new category
router.post('/', async (req, res) => {
    try {
        
        const categoryCollection = await getCategoryCollection();
        const { name, description } = req.body;

        const newCategory = {
            name,
            description: description || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        const result = await categoryCollection.insertOne(newCategory);        
        res.status(201).json({ message: 'Category created successfully', newCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all categories
router.get('/', async (req, res) => {
    try {
        const categoryCollection = await getCategoryCollection();
        const categories = await categoryCollection.find({}).toArray();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get category by ID
router.get('/:id', async (req, res) => {
    try {
        const categoryCollection = await getCategoryCollection();
        const categoryId = req.params.id;

        if (!ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const category = await categoryCollection.findOne({ _id: new ObjectId(categoryId) });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update category by ID
router.put('/:id', async (req, res) => {
    try {
        const categoryCollection = await getCategoryCollection();
        const categoryId = req.params.id;
        const { name, description } = req.body;

        if (!ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const updatedCategory = {
            ...(name && { name }),
            ...(description && { description }),
            updatedAt: new Date()
        };

        const result = await categoryCollection.findOneAndUpdate(
            { _id: new ObjectId(categoryId) },
            { $set: updatedCategory },
            { returnDocument: 'after' }
        );

        if (result.value) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', updatedCategory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete category by ID
router.delete('/:id', async (req, res) => {
    try {
        const categoryCollection = await getCategoryCollection();
        const categoryId = req.params.id;

        if (!ObjectId.isValid(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID' });
        }

        const result = await categoryCollection.findOneAndDelete({ _id: new ObjectId(categoryId) });

        if (result.value) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
