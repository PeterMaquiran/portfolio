# Use latest Node.js LTS Alpine base
FROM node:23-alpine AS base

# ---------- Dependencies ----------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only necessary files for dependency install
COPY package*.json ./

# Install dependencies with npm (clean and deterministic)
RUN npm ci

# ---------- Build ----------
FROM base AS builder
WORKDIR /app

# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Disable lightningcss to avoid native binary issues
ENV NEXT_PRIVATE_STANDALONE=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Patch config if needed (disable lightningcss optimization)
RUN echo "export const experimental = { optimizeCss: false };" >> next.config.mjs || true

# Build the app in standalone mode
RUN npm run build

# ---------- Production ----------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PRIVATE_STANDALONE=true
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Minimal permissions for runtime
RUN chmod -R a-w+x . && chmod -R a+x .next node_modules

USER nextjs

EXPOSE 3000
CMD ["npm", "run dev"]
