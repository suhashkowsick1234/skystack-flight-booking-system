const mongoose = require("mongoose");
const env = process.env.NODE_ENV || "test";
const config = require('../config/config.json')[env]

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(config["mongodb"]["MONGO_URI"], {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};