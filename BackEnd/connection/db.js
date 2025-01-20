const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path:'./.env'});

const uri = "mongodb+srv://admin:admin@difinalproject.wb5cp.mongodb.net/?retryWrites=true&w=majority&appName=DIFinalProject";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    console.log("Trying to connect");
    await client.connect();
    
    // Send a ping to confirm a successful connection
    const result = await client.db().command({ ping: 1 });
    console.log(`Pinged your deployment. You successfully connected to MongoDB! (${result.ok})`);

    // Perform database operations here if needed
    // For example:
    // const db = client.db(process.env.MONGO_DB_NAME);
    // const collection = db.collection("users");

    // Example insert operation
    // const result = await collection.insertOne({ name: "John Doe", age: 30 });
    // console.log(`Inserted document with _id: ${result.insertedId}`);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

async function connectToDatabase() {
  try {
    await run();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    // You might want to implement retry logic here if needed
  }
}

module.exports = { client, connectToDatabase };