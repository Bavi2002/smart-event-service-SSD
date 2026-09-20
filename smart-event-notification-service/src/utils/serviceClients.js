// src/utils/serviceClients.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://127.0.0.1:3006";
const EVENT_SERVICE_URL =
  process.env.EVENT_SERVICE_URL || "http://127.0.0.1:3006";

// Internal JWT – same secret as User Service uses to sign tokens
// In production: better to use service-to-service auth (API keys, mutual TLS, or IAM), but JWT is acceptable for uni project
const INTERNAL_JWT = "Bearer " + process.env.JWT_SECRET; // temporary – all services share same secret for simplicity

/**
 * Fetch user email from User Service
 * @param {string} userId
 * @returns {Promise<{email: string, name?: string}>}
 */
const getUserEmailFromUserService = async (userId) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/users/${userId}`,
      {
        headers: {
          Authorization: INTERNAL_JWT,
        },
      },
    );

    if (!response.data?.email) {
      throw new Error("User email not found");
    }

    return {
      email: response.data.email,
      name: response.data.name || "User",
    };
  } catch (err) {
    console.error(`Failed to fetch user from User Service: ${err.message}`);
    throw err;
  }
};

/**
 * Optional: Fetch event title/date from Event Service (if needed for richer emails)
 * @param {string} eventId
 * @returns {Promise<{title: string, date: string}>}
 */
const getEventDetailsFromEventService = async (eventId) => {
  try {
    const response = await axios.get(
      `${EVENT_SERVICE_URL}/api/events/${eventId}`,
      {
        headers: {
          Authorization: INTERNAL_JWT,
        },
      },
    );

    return {
      title: response.data.title || "Event",
      date: response.data.date || new Date().toISOString(),
    };
  } catch (err) {
    console.error(`Failed to fetch event details: ${err.message}`);
    return { title: "Event", date: new Date().toISOString() }; // fallback
  }
};

export { getUserEmailFromUserService, getEventDetailsFromEventService };
