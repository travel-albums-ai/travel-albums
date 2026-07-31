# Multi-stage Dockerfile for travel-albums
# Stage 1: Builder - Install dependencies and build artifacts
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

RUN ls -la

# Build client and bundle server
RUN npm run build && npm run bundle

# Stage 2: Runtime - Minimal production image
FROM node:20-alpine

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --production && npm cache clean --force

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/server.bundle.cjs ./server.cjs
COPY --from=builder /app/indexer.bundle.cjs ./indexer.cjs

# Copy config and static assets (if they exist)
COPY server-config.json* ./
COPY airports.json* ./
COPY cities.json* ./
COPY public* ./public/

# Create directories for dynamic data
RUN mkdir -p thumbnails Takeout

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3001) + '/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Expose port
EXPOSE 3001

# Run the bundled server
CMD ["node", "server.cjs"]
