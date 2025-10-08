# 1. Build stage
FROM node:20-bullseye AS builder
WORKDIR /app

# Ensure OpenSSL and build tools are available
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Copy package files and install deps
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Rebuild lightningcss to ensure correct binary
RUN npm rebuild lightningcss

# Build app (disable Turbopack for stable build)
RUN npm run build

# 2. Production stage
FROM node:20-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Install only production deps
RUN npm ci --omit=dev

CMD ["npm", "start"]
