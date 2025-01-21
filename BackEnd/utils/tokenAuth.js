const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../connection/db');
const { ObjectId } = require('mongodb');
require("dotenv").config()


const SECRET_KEY = process.env.JWT_SECRET
const TOKEN_EXPIRY = '1h';

/**
 * Hash a plain text password.
 * param {string} password - Plain text password.
 * returns {Promise<string>} - Hashed password.
 */
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare a plain text password with a hashed password.
 * param {string} password - Plain text password.
 * param {string} hashedPassword - Hashed password.
 * returns {Promise<boolean>} - Whether the passwords match.
 */
async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate a JWT token for a user.
 * param {Object} payload - Data to include in the token (e.g., user ID, role).
 * returns {string} - Signed JWT token.
 */
function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Verifies a JWT token and checks its validity against the database.
 *
 * This function ensures that the provided token is:
 * - Signed with the correct secret.
 * - Associated with an existing user.
 * - Validated against the current token version stored in the database.
 *
 * param {string} token - The JWT token to verify.
 * returns {Object} - Decoded token payload if the token is valid.
 * throws {Error} - Throws an error if the token is invalid, expired, 
 *                   or the token version is outdated.
 */
const verifyToken = async (token, collectionType) => {
    try {
        // Decode and verify the token
        const payload = jwt.verify(token, SECRET_KEY);

        // Determine collection based on the route or collectionType passed in
        let collectionName;
        if (collectionType === 'worker') {
            collectionName = 'workers';
        } else if (collectionType === 'user') {
            collectionName = 'users';
        } else {
            throw new Error('Unknown collection type');
        }

        const db = client.db("DIFinalProject");
        const collection = db.collection(collectionName);

        // Fetch the user/worker and verify token version
        const user = await collection.findOne({ _id: new ObjectId(payload.id) });

        if (!user || user.tokenVersion !== payload.tokenVersion) {
            throw new Error('Token is invalid or outdated');
        }

        return payload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};



module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
};