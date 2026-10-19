const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n[!] MongoDB Connection Error: ${error.message}`);
    console.error(`[!] Please make sure MongoDB is running (e.g., docker compose up -d)\n`);
    process.exit(1);
  }
};

module.exports = connectDB;
