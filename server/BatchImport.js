const { MongoClient } = require("mongodb");

require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbImport = async () => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("Final_project");
  // await db.collection("companies").insertMany(companies);
  await db.collection("users").updateMany({}, {$set: {desc: ""}});
  client.close();
};

dbImport();