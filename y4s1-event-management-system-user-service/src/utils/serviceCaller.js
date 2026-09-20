const axios = require('axios');

// This is a reusable HTTP client for calling other microservices
// In production: use service discovery or env vars for URLs

const createServiceClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    timeout: 5000, // 5 seconds timeout
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'SmartEvent/UserService/1.0'
    }
  });

  // Optional: Add interceptor for logging or retry later
  client.interceptors.request.use(config => {
    console.log(`[Service Call] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  });

  client.interceptors.response.use(
    response => response,
    error => {
      console.error(`[Service Call Error] ${error.message}`);
      return Promise.reject(error);
    }
  );

  return client;
};

// Example: If User Service ever needs to call Notification Service
// (not required now, but good for symmetry)
const notificationClient = createServiceClient(process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3004');

// Currently not used, but you can export more clients later

module.exports = {
  createServiceClient,
  // Add specific callers if needed later
  // notificationClient
};