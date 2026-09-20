// src/server.js — API Gateway entry point
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServiceProxy } from "./proxy.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Downstream service URLs ────────────────────────────────────────────────
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://127.0.0.1:3001";
const EVENT_SERVICE_URL =
  process.env.EVENT_SERVICE_URL || "http://127.0.0.1:3002";
const REGISTRATION_SERVICE_URL =
  process.env.REGISTRATION_SERVICE_URL || "http://127.0.0.1:3003";
const NOTIFICATION_SERVICE_URL =
  process.env.NOTIFICATION_SERVICE_URL || "http://127.0.0.1:3004";

// ─── Global middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Restrict to frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));

// ─── Proxy routes ───────────────────────────────────────────────────────────
// The User Service mounts its routes under /api (e.g., app.use("/api", userRoutes))
// so /api/users/login on the gateway → /api/users/login on the user service.
//
// All other services mount under /api/events, /api/registrations, /api/notifications
// so paths pass through unchanged.

// User Service — /api/users/*
app.use(
  "/api/users",
  createServiceProxy("User Service", USER_SERVICE_URL)
);

// Event Service — /api/events/*
app.use(
  "/api/events",
  createServiceProxy("Event Service", EVENT_SERVICE_URL)
);

// Registration Service — /api/registrations/*
app.use(
  "/api/registrations",
  createServiceProxy("Registration Service", REGISTRATION_SERVICE_URL)
);

// Notification Service — /api/notifications/*
app.use(
  "/api/notifications",
  createServiceProxy("Notification Service", NOTIFICATION_SERVICE_URL)
);

// ─── Health aggregation endpoint ────────────────────────────────────────────
app.get("/health", async (req, res) => {
  const services = [
    { name: "user-service", url: `${USER_SERVICE_URL}/health` },
    { name: "event-service", url: `${EVENT_SERVICE_URL}/health` },
    { name: "registration-service", url: `${REGISTRATION_SERVICE_URL}/health` },
    {
      name: "notification-service",
      url: `${NOTIFICATION_SERVICE_URL}/health`,
    },
  ];

  const results = await Promise.allSettled(
    services.map(async (service) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(service.url, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (response.ok) {
          const data = await response.json();
          return { name: service.name, status: "healthy", data };
        }
        return { name: service.name, status: "unhealthy", code: response.status };
      } catch (err) {
        clearTimeout(timeout);
        return { name: service.name, status: "unreachable", error: err.message };
      }
    })
  );

  const serviceStatuses = results.map((r) =>
    r.status === "fulfilled" ? r.value : { status: "error" }
  );

  const allHealthy = serviceStatuses.every((s) => s.status === "healthy");

  res.status(allHealthy ? 200 : 207).json({
    status: allHealthy ? "healthy" : "degraded",
    gateway: "smart-event-api-gateway",
    timestamp: new Date().toISOString(),
    services: serviceStatuses,
  });
});

// ─── Gateway info endpoint ──────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    service: "Smart Event API Gateway",
    version: "1.0.0",
    routes: {
      "/api/users/*": `→ User Service (${USER_SERVICE_URL})`,
      "/api/events/*": `→ Event Service (${EVENT_SERVICE_URL})`,
      "/api/registrations/*": `→ Registration Service (${REGISTRATION_SERVICE_URL})`,
      "/api/notifications/*": `→ Notification Service (${NOTIFICATION_SERVICE_URL})`,
    },
    health: "/health",
  });
});

// ─── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} is not handled by the gateway`,
  });
});

// ─── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[Gateway] Unhandled error:", err.message);
  res.status(500).json({
    error: "Internal Gateway Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// ─── Start server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`   ├── User Service         → ${USER_SERVICE_URL}`);
  console.log(`   ├── Event Service        → ${EVENT_SERVICE_URL}`);
  console.log(`   ├── Registration Service → ${REGISTRATION_SERVICE_URL}`);
  console.log(`   └── Notification Service → ${NOTIFICATION_SERVICE_URL}`);
  console.log(`\n   Health check: http://localhost:${PORT}/health\n`);
});
