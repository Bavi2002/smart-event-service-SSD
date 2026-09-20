# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

RUN npm install

# Copy source code
COPY . .

# Stage 2: Production image (slim)
FROM node:20-alpine

WORKDIR /app

# Copy only what's needed from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/.env.example ./.env.example

# Expose port
EXPOSE 3004

# Use non-root user (security best practice)
USER node

# Start command
CMD ["npm", "start"]