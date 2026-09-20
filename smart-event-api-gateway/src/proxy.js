// src/proxy.js — Proxy configuration factory for downstream services
import { createProxyMiddleware } from "http-proxy-middleware";

/**
 * Creates a proxy middleware instance for a downstream service.
 *
 * When mounted with app.use("/api/events", createServiceProxy(...)),
 * Express strips the mount path from req.url, so we need pathRewrite
 * to prepend it back before forwarding to the downstream service.
 *
 * Example: Gateway /api/events/123 → Express sees req.url = "/123"
 *          → pathRewrite prepends "/api/events" → downstream gets /api/events/123
 *
 * @param {string} serviceName  — Human-readable name (for logging)
 * @param {string} targetUrl    — The base URL of the downstream service
 * @returns {import("http-proxy-middleware").RequestHandler}
 */
export function createServiceProxy(serviceName, targetUrl) {
  return createProxyMiddleware({
    target: targetUrl,
    changeOrigin: true,

    // Timeout for downstream service responses
    proxyTimeout: 30000,
    timeout: 30000,

    on: {
      // Rewrite path: prepend back the mount path that Express strips
      proxyReq: (proxyReq, req) => {
        // req.originalUrl has the full original path (e.g. /api/events/123)
        // req.url has the stripped path (e.g. /123)
        // We want the downstream to receive the full original path
        const fullPath = req.originalUrl;
        proxyReq.path = fullPath;

        console.log(
          `[Gateway] ${req.method} ${fullPath} → ${serviceName} (${targetUrl}${fullPath})`
        );
      },

      // Handle proxy errors gracefully
      error: (err, req, res) => {
        const url = req.originalUrl || req.url;
        console.error(
          `[Gateway] Proxy error for ${serviceName}: ${err.message} (${url})`
        );

        // Only send response if headers haven't been sent yet
        if (!res.headersSent) {
          res.status(503).json({
            error: "Service Unavailable",
            message: `${serviceName} is currently unreachable`,
            service: serviceName,
          });
        }
      },
    },
  });
}
