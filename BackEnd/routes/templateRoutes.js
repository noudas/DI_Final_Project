const express = require('express');
const router = express.Router();
const { client } = require('../connection/db'); // MongoDB client
const { ObjectId } = require('mongodb');

// Create a template
router.post('/', async (req, res) => {
    const { title, workerName, createdBy, content, shared, categoryId } = req.body;
    console.log(req.body);  
    try {
        const db = client.db('DIFinalProject');
        const templatesCollection = db.collection('templates');

        // Validate ObjectId format
        if (!ObjectId.isValid(createdBy)) {
            return res.status(400).json({ error: 'Invalid createdBy ObjectId' });
        }
        
        let categoryObjectId = null;
        if (categoryId) {
            if (!ObjectId.isValid(categoryId)) {
                return res.status(400).json({ error: 'Invalid categoryId ObjectId' });
            }
            categoryObjectId = new ObjectId(categoryId);
        }
        
        const newTemplate = {
            title,
            workerName,
            createdBy: new ObjectId(createdBy),
            content,
            shared: shared || false,
            categoryId: categoryId ? new ObjectId(categoryId) : null,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await templatesCollection.insertOne(newTemplate);
        res.status(201).json({ message: 'Template created successfully', templateId: result.insertedId });
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ error: 'Failed to create template' });
    }
});

// Get all templates
router.get('/', async (req, res) => {
    try {
        const db = client.db('DIFinalProject');
        const templatesCollection = db.collection('templates');

        const templates = await templatesCollection.find({}).toArray();
        res.status(200).json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ error: 'Failed to fetch templates' });
    }
});

// Get a single template by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = client.db('DIFinalProject');
        const templatesCollection = db.collection('templates');

        const template = await templatesCollection.findOne({ _id: new ObjectId(id) });

        if (!template) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.status(200).json(template);
    } catch (error) {
        console.error('Error fetching template:', error);
        res.status(500).json({ error: 'Failed to fetch template' });
    }
});

// Update a template
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, workerName, content, shared, categoryId, context } = req.body;

    try {
        const db = client.db('DIFinalProject');
        const templatesCollection = db.collection('templates');

        const updatedTemplate = {
            ...(title && { title }),
            ...(workerName && { workerName }),
            ...(content && { content }),
            ...(shared !== undefined && { shared }),
            ...(categoryId && { categoryId: new ObjectId(categoryId) }),
            updatedAt: new Date()
        };

        const result = await templatesCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedTemplate }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.status(200).json({ message: 'Template updated successfully' });
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ error: 'Failed to update template' });
    }
});

// Delete a template
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const db = client.db('DIFinalProject');
        const templatesCollection = db.collection('templates');

        const result = await templatesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ error: 'Failed to delete template' });
    }
});

module.exports = router;
