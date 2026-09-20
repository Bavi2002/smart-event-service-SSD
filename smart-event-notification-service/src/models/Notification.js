// src/models/Notification.js
import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["booking_confirmation", "event_reminder"],
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    subject: { type: String, required: true },
    to: { type: String, required: true }, // email
    body: { type: String, required: true }, // HTML or plain
    status: {
      type: String,
      enum: ["sent", "failed"],
      default: "sent",
    },
    messageId: { type: String }, // Resend message ID
    errorMessage: { type: String },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
