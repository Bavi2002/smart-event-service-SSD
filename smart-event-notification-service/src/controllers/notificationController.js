// src/controllers/notificationController.js
import { Resend } from "resend";
import Notification from "../models/Notification.js";
import dotenv from "dotenv";
import {
  getUserEmailFromUserService,
  getEventDetailsFromEventService,
} from "../utils/serviceClients.js";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBookingConfirmation = async (req, res) => {
  let {
    userId,
    eventId,
    eventTitle,
    ticketCount,
    totalPrice,
    bookingId,
    userEmail,
  } = req.body;

  console.log("Received booking confirmation request:", req.body);
  // If email not provided → fetch from User Service
  if (!userEmail) {
    try {
      const userData = await getUserEmailFromUserService(userId);
      userEmail = userData.email;
      // optionally use userData.name for personalization
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Cannot send email: user email not available" });
    }
  }

  // If eventTitle not provided → fetch from Event Service
  if (!eventTitle && eventId) {
    try {
      const eventData = await getEventDetailsFromEventService(eventId);
      eventTitle = eventData.title;
    } catch (err) {
      eventTitle = "Your Event"; // fallback
    }
  }

  if (!userEmail || !eventTitle) {
    return res
      .status(400)
      .json({ message: "Missing required fields (email/title)" });
  }

  try {
    const html = `
      <h2>Booking Confirmation</h2>
      <p>Thank you for your registration!</p>
      <ul>
        <li><strong>Event:</strong> ${eventTitle}</li>
        <li><strong>Tickets:</strong> ${ticketCount || 1}</li>
        <li><strong>Total:</strong> LKR ${totalPrice || "N/A"}</li>
        <li><strong>Booking ID:</strong> ${bookingId || "N/A"}</li>
      </ul>
      <p>We look forward to seeing you!</p>
      <p>Smart Event Management Team</p>
    `;

    const { data, error } = await resend.emails.send({
      from: "Smart Events <onboarding@resend.dev>", // use sandbox domain or your verified one
      to: [userEmail],
      subject: `Booking Confirmed – ${eventTitle}`,
      html,
    });

    console.log("Email sent successfully:", data);
    console.log("Error", error)
    if (error) {
      // ... (keep existing error logging)
      await new Notification({
        /* ... failed */
      }).save();
      return res.status(500).json({ message: "Email sending failed", error });
    }

    const notification = await new Notification({
      type: "booking_confirmation",
      eventId,
      subject: `Booking Confirmed – ${eventTitle}`,
      to: userEmail,
      body: html,
      status: "sent",
      messageId: data?.id,
    }).save();

    console.log("Notification saved:", notification);
    console.log("Response", res.data)
    res.status(200).json({
      success: true,
      message: "Confirmation email sent",
      notificationId: notification._id,
      resendId: data?.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during notification" });
  }
};

const sendEventReminder = async (req, res) => {
  let { eventId, eventTitle, eventDate, userEmail } = req.body;

  // Fetch email if missing
  if (!userEmail) {
    try {
      const userData = await getUserEmailFromUserService(userId);
      userEmail = userData.email;
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Cannot send reminder: user email unavailable" });
    }
  }

  // Fetch event details if missing
  if ((!eventTitle || !eventDate) && eventId) {
    try {
      const eventData = await getEventDetailsFromEventService(eventId);
      eventTitle = eventTitle || eventData.title;
      eventDate = eventDate || eventData.date;
    } catch {}
  }

  if (!userEmail || !eventTitle) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const html = `
      <h2>Event Reminder</h2>
      <p>Your event is approaching soon!</p>
      <ul>
        <li><strong>Event:</strong> ${eventTitle}</li>
        <li><strong>Date:</strong> ${new Date(eventDate).toLocaleString("en-US", { timeZone: "Asia/Colombo" })}</li>
      </ul>
      <p>Get ready and see you there!</p>
      <p>Smart Event Management Team</p>
    `;

    const { data, error } = await resend.emails.send({
      from: "Smart Events <onboarding@resend.dev>",
      to: [userEmail],
      subject: `Reminder: ${eventTitle} is coming up`,
      html,
    });

    if (error) {
      // ... log failure
      return res.status(500).json({ message: "Reminder failed", error });
    }

    const notification = await new Notification({
      // ... success log
    }).save();

    res.status(200).json({
      success: true,
      message: "Reminder email sent",
      notificationId: notification._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.user.email })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export { sendBookingConfirmation, sendEventReminder, getMyNotifications };
