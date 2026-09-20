const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect, validateTokenForServices } = require("../middleware/auth");

/**
 * Middleware to handle validation results
 * This keeps the route definitions clean.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Returns the first error message to keep response consistent
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// --- Routes ---

// Register with validation
router.post(
  "/users/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be 2-50 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
    body("phone")
      .optional()
      .trim()
      .isMobilePhone("any")
      .withMessage("Invalid phone number"),
    validate, // Executes the error check
  ],
  registerUser,
);

// Login with validation
router.post(
  "/users/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").exists().withMessage("Password required"),
    validate, // Executes the error check
  ],
  loginUser,
);

// Profile Routes
router.get("/users/profile", protect, getUserProfile);
router.put("/users/profile", protect, updateUserProfile);

// Service-to-Service Validation
router.post("/users/validate-token", validateTokenForServices);

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "User Service" });
});

module.exports = router;
