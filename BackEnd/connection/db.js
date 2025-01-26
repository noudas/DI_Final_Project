//src/connection/db.js
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://admin:admin@difinalproject.wb5cp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let dbInstance; // Shared database instance

async function connectToDatabase() {
  try {
    if (!dbInstance) {
      await client.connect();
      console.log("Successfully connected to MongoDB");
      dbInstance = client.db("DIFinalProject"); // Set your database name
    }
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

module.exports = { client, connectToDatabase };
