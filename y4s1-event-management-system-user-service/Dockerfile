# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for bcrypt (node-gyp)
RUN apk add --no-cache python3 make g++ 

COPY package*.json ./
RUN npm ci

COPY . .

# -------------------------------
# Stage 2: Production image
# -------------------------------
FROM node:20-alpine

# Security: run as non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -S appuser -u 1001 -G nodejs

WORKDIR /app

# Copy only production dependencies + built code
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env.example ./.env

# Change ownership
RUN chown -R appuser:nodejs /app

# Switch to non-root user
USER appuser

# Expose port (same as your app)
EXPOSE 3001

# Healthcheck (good for orchestration)
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start command
CMD ["node", "src/server.js"]