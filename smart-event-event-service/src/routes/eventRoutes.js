import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import validateEvent from "../middleware/validation.js";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  checkAvailability,
} from "../controllers/eventController.js";

const router = Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);
router.get("/:id/availability", checkAvailability);

// Protected routes
router.post("/", authMiddleware, validateEvent, createEvent);
router.put("/:id", authMiddleware, validateEvent, updateEvent);
router.delete("/:id", authMiddleware, deleteEvent);

export default router;
