const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connected");
  } catch (error) {
    console.error("Database connection failure");
  }

};

module.exports = {
  connectDB
};