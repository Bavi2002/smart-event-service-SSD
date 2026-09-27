#!/bin/bash

echo "Starting all Smart Event Management System services..."

# Ensure that when we exit this script (e.g. Ctrl+C), it kills all background processes
trap "kill 0" SIGINT

BASE_DIR="/home/bavithran/Downloads/SSD_project/event-service"

echo "Starting API Gateway..."
cd "$BASE_DIR/smart-event-api-gateway" && npm run dev &

echo "Starting Event Service..."
cd "$BASE_DIR/smart-event-event-service" && npm run dev &

echo "Starting Notification Service..."
cd "$BASE_DIR/smart-event-notification-service" && npm run dev &

echo "Starting Registration Service..."
cd "$BASE_DIR/smart-event-registration-service" && npm run dev &

echo "Starting User Service..."
cd "$BASE_DIR/y4s1-event-management-system-user-service" && npm run dev &

echo "Starting Frontend..."
cd "$BASE_DIR/smart-event-frontend" && npm run dev &

echo "======================================================="
echo "All services have been started in the background!"
echo "Leave this terminal open. Press [Ctrl+C] here to stop all services."
echo "======================================================="

# Wait for all background processes to finish (which is never, unless killed)
wait
