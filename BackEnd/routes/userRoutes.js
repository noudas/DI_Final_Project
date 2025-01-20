// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { client } = require('../connection/db');
const { ObjectId } = require('mongodb');

router.post('/register', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");
        
        const result = await collection.insertOne(req.body);
        res.status(201).json({ id: result.insertedId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");
        
        const user = await collection.findOne({ _id: new ObjectId(req.params.id) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");
        
        const users = await collection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");
        
        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.modifiedCount === 0) {
            throw new Error('User not updated');
        }
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");
        
        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            throw new Error('User not found');
        }
        res.status(204).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
