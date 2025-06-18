require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToMongoDB } = require("./config/connection");
const authMiddleware = require("./middlewares/auth");

const userRoutes = require("./routes/user-routes");
const noteRoutes = require("./routes/note-routes");

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Connect to MongoDB
connectToMongoDB(process.env.MONGO_URL);

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));

// 🔹 Routes
app.use("/api/user", userRoutes);
app.use("/api/notes", authMiddleware, noteRoutes);

// 🔹 404 Error Handling
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 🔹 Centralized Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// 🔹 Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
