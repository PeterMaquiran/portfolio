# 1. Build stage
FROM node:20-bullseye AS builder
WORKDIR /app

# Install build tools + Rust for lightningcss native build
RUN apt-get update && apt-get install -y python3 make g++ libc6-dev curl && \
    curl https://sh.rustup.rs -sSf | bash -s -- -y && \
    . "$HOME/.cargo/env"

# Copy package files and install deps cleanly
COPY package*.json ./
RUN rm -rf node_modules && npm ci

# Copy rest of the code
COPY . .

# Force remove any cached prebuilt lightningcss binary
RUN rm -rf node_modules/lightningcss/node/*.node

# Rebuild lightningcss from source using Rust
RUN . "$HOME/.cargo/env" && npm rebuild lightningcss --build-from-source

# Build the Next.js app
RUN npm run build

# 2. Production stage
FROM node:20-bullseye AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built app + production deps
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "start"]
