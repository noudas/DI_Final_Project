const express = require('express');
const router = express.Router();
const { client } = require('../connection/db');
const { ObjectId } = require('mongodb');
const { hashPassword, comparePassword, generateToken, verifyToken } = require('../utils/tokenAuth');

// **Register Route**
// **Register Route**
router.post('/register', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");

        const {
            username,
            email,
            password,
            firstName,
            lastName,
        } = req.body;

        // Check if the user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create user object with all fields
        const user = {
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            tokenVersion: 0, // Initial version
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await collection.insertOne(user);

        res.status(201).json({ id: result.insertedId, message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});



// **Login Route**
router.post('/login', async (req, res) => {
    try {
        const db = client.db("DIFinalProject");
        const collection = db.collection("users");

        const user = await collection.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify password
        const isPasswordValid = await comparePassword(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token with tokenVersion
        const token = generateToken({ id: user._id, email: user.email, tokenVersion: user.tokenVersion });

        res.status(200).json({ token });
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

        // Pass 'worker' as the collectionType
        const payload = await verifyToken(token, 'user');
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
