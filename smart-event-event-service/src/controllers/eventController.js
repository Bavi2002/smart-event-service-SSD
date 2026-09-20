import Event from "../models/Event.js";
import sendEventReminder from "../utils/serviceClient.js";

// Create event (protected - organizer only)
const createEvent = async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizerId: req.user.id || req.user.userId,
    });
    await event.save();

    // 🔥 INTER-SERVICE CALL: Notify Notification Service
    await sendEventReminder(event);

    res.status(201).json({
      message: "Event created successfully",
      event,
      reminderSent: true,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all events (with optional search)
const getAllEvents = async (req, res) => {
  try {
    const { search, date } = req.query;
    let query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (date) query.date = { $gte: new Date(date) };
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update event (protected)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizerId !== (req.user.id || req.user.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    Object.assign(event, req.body);
    await event.save();
    res.json({ message: "Event updated", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete event (protected)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizerId !== (req.user.id || req.user.userId)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Check availability (public - used by Registration Service)
const checkAvailability = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // In future we can count real bookings from Registration Service
    const remaining = event.capacity; // placeholder for now
    res.json({
      eventId: event._id,
      remaining,
      capacity: event.capacity,
      message: "Availability checked successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  checkAvailability,
};
