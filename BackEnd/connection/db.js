const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path:'../mongo.env'});

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASS = process.env.MONGO_PASS;
const MONGO_CLUSTER = process.env.MONGO_CLUSTER;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_CLUSTER}/?retryWrites=true&w=majority&appName=${MONGO_DB_NAME}`;

const uri = MONGO_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

module.exports = client;
