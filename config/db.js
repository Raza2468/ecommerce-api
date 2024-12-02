const mongoose = require("mongoose");

const connectDb = async () => {

  try {
    await mongoose.connect(process.env.DB_REMOTE);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDb;