const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
 * Verify a JWT token.
 * param {string} token - JWT token to verify.
 * returns {Object} - Decoded token payload if valid.
 * throws {Error} - If token is invalid or expired.
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }
}

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    verifyToken,
};