const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectToDatabase } = require('./connection/db');

const port = 3000;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const workerRoutes = require('./routes/workerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const templateRoutes = require('./routes/templateRoutes');
const contextRoutes = require('./routes/contextRoutes');

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/context', contextRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Connect to MongoDB before starting the server
connectToDatabase().then(() => {
  app.listen(port, function () {
    console.log("Server is listening at port:" + port);
  });
}).catch((error) => {
  console.error("Failed to start server:", error);
});

module.exports = app;
