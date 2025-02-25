const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true });

let db;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      db = client.db("football_score_app");
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw error;
    }
  }
  return db;
}

module.exports = connectDB;