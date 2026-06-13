const mongoose = require("mongoose");

const url =
  "mongodb+srv://dalakotiarun8:mongodbarun@devtinder.jlbogzu.mongodb.net/devTinder";

const connectDB = async () => {
  await mongoose.connect(url);
};

module.exports = connectDB;
