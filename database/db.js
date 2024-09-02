import mongoose from "mongoose";

const mongo_uri = 'mongodb+srv://pandeykaran1515:EsgAqTAYHVpkdjhT@cluster0.xrkqhgn.mongodb.net/';

const db = mongoose
  .connect(mongo_uri)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error while connecting to Database", error.message);
    process.exit(1);
  });

export default db;
