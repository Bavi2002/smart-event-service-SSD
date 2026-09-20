// src/routes/notificationRoutes.js
import express from "express";
import protect from "../middleware/auth.js";
import {
  sendBookingConfirmation,
  sendEventReminder,
  getMyNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

// Protected routes (called by other services or authenticated users)
router.post("/booking-confirmation", protect, sendBookingConfirmation);
router.post("/event-reminder", protect, sendEventReminder);
router.get("/my-notifications", protect, getMyNotifications);

export default router;
