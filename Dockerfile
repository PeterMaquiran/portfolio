# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* pnpm-workspace.yaml* .npmrc* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /app

ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDiw9WDTvOuu-DFD-eB18UbrTSmfF0D-uk
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=active-cosine-319019.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=active-cosine-319019
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=active-cosine-319019.firebasestorage.app
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=308195231751
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:308195231751:web:19cb539172056f394ec2a2
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WQYTHP22TQ
ENV NEXT_PUBLIC_FIREBASE_VAPID_KEY=BFsAOxo3XNFsNWTupcspNaNHyOebKcFwb8xYXsux8zdRtXsgClVzehEcPNYa-4Gm3HouzsswdX2C_0CzGFJhMzU

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV SQLITE_PATH=/data/chat.db
ENV SITE_URL=https://peter.tvone.ao
ENV NOTIFICATION_API_URL=http://172.19.0.35:3000
ENV NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDiw9WDTvOuu-DFD-eB18UbrTSmfF0D-uk
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=active-cosine-319019.firebaseapp.com
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=active-cosine-319019
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=active-cosine-319019.firebasestorage.app
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=308195231751
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:308195231751:web:19cb539172056f394ec2a2
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-WQYTHP22TQ
ENV NEXT_PUBLIC_FIREBASE_VAPID_KEY=BFsAOxo3XNFsNWTupcspNaNHyOebKcFwb8xYXsux8zdRtXsgClVzehEcPNYa-4Gm3HouzsswdX2C_0CzGFJhMzU

RUN apk add --no-cache wget libstdc++ \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/socket-server.mjs ./socket-server.mjs
COPY --from=builder --chown=nextjs:nodejs /app/next.config.ts ./next.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/locales ./locales
COPY --from=builder --chown=nextjs:nodejs /app/lib ./lib

RUN mkdir -p /data && chown nextjs:nodejs /data

USER nextjs

CMD ["node", "socket-server.mjs"]
