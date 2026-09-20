// src/index.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

// // Routes
app.use("/api/notifications", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "notification" });
});

async function startServer() {
  try {
    await connectDB();
    console.log("Database connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Notification Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start service:", error);
    process.exit(1);
  }
}

startServer();
