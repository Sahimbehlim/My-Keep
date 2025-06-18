const mongoose = require("mongoose");

const connectToMongoDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Disconnected. Reconnecting...");
  setTimeout(() => connectToMongoDB(process.env.MONGO_URL), 3000);
});

module.exports = { connectToMongoDB };
