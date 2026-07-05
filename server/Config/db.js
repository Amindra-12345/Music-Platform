const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Looks for the MONGO_URI string inside your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`🚀 MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Database Connection Error: ${error.message}`);
    process.exit(1); // Stop the server entirely if database connection fails
  }
};

module.exports = connectDB;