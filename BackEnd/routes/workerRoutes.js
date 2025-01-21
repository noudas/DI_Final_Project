const express = require('express');
const router = express.Router();
const { client } = require('../connection/db');
const { ObjectId } = require('mongodb');
const { hashPassword, comparePassword, generateToken, verifyToken } = require('../utils/tokenAuth');

// **Register Route**
router.post('/register', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("workers");

        const { name, email, password, position } = req.body;

        // Check if the worker already exists
        const existingWorker = await collection.findOne({ email });
        if (existingWorker) {
            return res.status(400).json({ error: 'Worker with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the worker with tokenVersion
        const worker = {
            name,
            email,
            password: hashedPassword,
            position,
            tokenVersion: 0, // Initial version
        };

        const result = await collection.insertOne(worker);

        res.status(201).json({ id: result.insertedId, message: 'Worker registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// **Login Route**
router.post('/login', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("workers");

        const { email, password } = req.body;

        // Find the worker by email
        const worker = await collection.findOne({ email });
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }

        // Compare the password
        const isPasswordValid = await comparePassword(password, worker.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token with tokenVersion
        const token = generateToken({
            id: worker._id,
            position: worker.position,
            tokenVersion: worker.tokenVersion,
        });

        res.status(200).json({ token, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token
        if (!token) {
            return res.status(400).json({ error: 'No token provided' });
        }

        const payload = verifyToken(token);
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");

        // Increment the tokenVersion in the database
        await collection.updateOne(
            { _id: new ObjectId(payload.id) },
            { $inc: { tokenVersion: 1 } }
        );

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});

// **Other Routes**
router.get('/:id', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("workers");

        const worker = await collection.findOne({ _id: new ObjectId(req.params.id) });
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
        const db = client.db("DIFinalProject");
        const collection = db.collection("workers");

        const workers = await collection.find().toArray();
        res.json(workers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("workers");

        const result = await collection.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.modifiedCount === 0) {
            throw new Error('Worker not updated');
        }
        res.json({ message: 'Worker updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("workers");

        const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            throw new Error('Worker not found');
        }
        res.status(204).json({ message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
