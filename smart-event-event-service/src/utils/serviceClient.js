import axios from "axios";

const NOTIFICATION_SERVICE_URL =
    process.env.NOTIFICATION_SERVICE_URL || "http://127.0.0.1:3006";

// Send reminder to Notification Service (real inter-service HTTP call)
const sendEventReminder = async (event) => {
  try {
    await axios.post(
      `${NOTIFICATION_SERVICE_URL}/api/notifications/event-reminder`,
      {
        eventId: event._id.toString(),
        title: event.title,
        date: event.date,
        location: event.location,
        message: `🔔 Reminder: Your event "${event.title}" is scheduled for ${new Date(event.date).toLocaleDateString()} at ${event.location}`,
      },
      {
        timeout: 5000,
      },
    );
    console.log(
      `✅ Reminder request sent to Notification Service for event: ${event.title}`,
    );
  } catch (err) {
    console.warn(
      `⚠️ Could not send reminder to Notification Service (this is non-blocking): ${err.message}`,
    );
    // We don't fail the event creation if notification fails
  }
};

export default sendEventReminder;
