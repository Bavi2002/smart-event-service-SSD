const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const swaggerRoutes = require("./routes/swaggerRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Allow frontend later
app.use(express.json());

// ... existing imports
const { rateLimit } = require("express-rate-limit");
const { validationResult } = require("express-validator");

// Rate limiting: 100 requests per 15 min per IP (adjust for demo)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter); // Apply globally (or per-route if preferred)

// Routes
app.use("/api", require("./routes/userRoutes"));
app.use("/api-docs", swaggerRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "API is healthy",
    timestamp: new Date(),
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(
    `User Service running on port ${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
