# 1. Build stage
FROM node:20-bullseye AS builder
WORKDIR /app

# Ensure system deps for native modules
RUN apt-get update && apt-get install -y python3 make g++ libc6-dev && rm -rf /var/lib/apt/lists/*

# Copy package files and install
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# 🔧 Force rebuild lightningcss native binary
RUN npm rebuild lightningcss --force

# Build the app (no Turbopack)
RUN npm run build

# 2. Production stage
FROM node:20-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

RUN npm ci --omit=dev

CMD ["npm", "start"]
