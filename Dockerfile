# 1. Build stage
FROM node:20-bullseye AS builder
WORKDIR /app

# Install system deps for native builds
RUN apt-get update && apt-get install -y python3 make g++ libc6-dev && rm -rf /var/lib/apt/lists/*

# Copy only package files first for caching
COPY package*.json ./

# Install fresh deps INSIDE Docker (no host node_modules)
RUN rm -rf node_modules && npm ci

# Copy app source
COPY . .

# Force lightningcss rebuild for Linux
RUN npm rebuild lightningcss --build-from-source

# Build the Next.js app
RUN npm run build

# 2. Production stage
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only built output + production deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "start"]
