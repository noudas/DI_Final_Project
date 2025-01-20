// app.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./connection/db');
const cors = require('cors');

const port = 3000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const workerRoutes = require('./routes/workerRoutes');

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);

// Error Handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Connect to MongoDB before starting the server
require('./connection/db').connectToDatabase().then(() => {
    app.listen(port, function () {
        console.log("Server is listening at port:" + port);
    });
}).catch(console.error);

module.exports = app;
