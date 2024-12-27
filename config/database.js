const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri || "mongodb://localhost:27017");
const DB = client.db("football_score_app");

module.exports = DB;
