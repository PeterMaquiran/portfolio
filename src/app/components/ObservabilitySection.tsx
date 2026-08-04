'use client'

import React, { useState } from 'react'

const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`

interface StackItemProps {
  name: string
  iconSrc?: string
  children?: React.ReactNode
  className?: string
}

const StackItem: React.FC<StackItemProps> = ({ name, iconSrc, children, className }) => (
  <div
    className={`flex items-center gap-3 rounded-md border border-border-subtle bg-surface-chip px-5 py-3.5 text-sm font-medium text-fg-secondary backdrop-blur-sm transition-colors duration-200 hover:border-border-strong hover:bg-surface-hover`}
  >
    {iconSrc ? (
      <img src={iconSrc} alt={`${name} logo`} className={`h-6 w-6 shrink-0 object-contain`} />
    ) : (
      children
    )}
    <span>{name}</span>
  </div>
)

interface ObservabilitySectionProps {
  labels: {
    showMore: string
    showLess: string
  }
}

export const ObservabilitySection: React.FC<ObservabilitySectionProps> = ({ labels }) => {
  const [showMore, setShowMore] = useState(false)
  return (
    <section
      id="observability"
      className="relative z-10 w-full scroll-mt-36 space-y-1 md:scroll-mt-28"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 100% 100% at 50% 12%, var(--card-glow) 0%, transparent 55%)',
        }}
      />
      <div
        className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface p-6 text-fg backdrop-blur-3xl transition-all duration-300 sm:p-10"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ backgroundImage: noiseBg }}
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Column 1: Observability */}
          <div>
            <h3 className="mb-5 text-lg font-medium text-fg">Observability</h3>

            <div className="flex flex-col gap-3">
              <StackItem
                name="Prometheus"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg"
              />

              <StackItem name="Zipkin" iconSrc="/zipkin.svg" />

              <StackItem
                name="Loki"
                iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/loki.svg"
              />

              <StackItem
                name="Grafana"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg"
              />

              <StackItem name="Grafana Alloy">
                <svg
                  className="h-6 w-6 shrink-0 text-orange-500 dark:text-orange-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </StackItem>

              <StackItem
                name="Uptime Kuma"
                iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/uptime-kuma.svg"
              />
            </div>
          </div>

          {/* Column 2: Frontend */}
          <div>
            <h3 className="mb-5 text-lg font-medium text-fg">Frontend</h3>

            <div className="flex flex-col gap-3">
              <StackItem
                name="React"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
              />

              <StackItem
                name="Vue"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg"
              />

              <StackItem
                name="Flutter"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"
              />

              <StackItem
                name="Tailwind"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"
              />

              <StackItem name="Offline First">
                <svg
                  className="h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-3.21M8.53 16.11a6 6 0 016.95 0M12 20h.01" />
                </svg>
              </StackItem>

              <StackItem name="Animations">
                <svg
                  className="h-6 w-6 shrink-0 text-violet-600 dark:text-purple-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3v3m0 12v3M3 12h3m12 0h3m-2.5-6.5l-2.1 2.1m-8.8 8.8l-2.1 2.1m0-13l2.1 2.1m8.8 8.8l2.1 2.1" />
                </svg>
              </StackItem>
            </div>
          </div>

          {/* Column 3: Backend */}
          <div>
            <h3 className="mb-5 text-lg font-medium text-fg">Backend & Services</h3>

            <div className="flex flex-col gap-3">
              <StackItem
                name="NestJS"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg"
              />

              <StackItem
                name="Python"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
              />

              <StackItem
                name="Redis"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg"
              />

              <StackItem
                name="RabbitMQ"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rabbitmq/rabbitmq-original.svg"
              />

              <StackItem
                name="Socket.io"
                iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg"
              />

              <StackItem
                name="Keycloak"
                iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/keycloak.svg"
              />
            </div>
          </div>

          {/* Full width: Other — hidden until Show More */}
          <div className="md:col-span-3">
            {showMore && (
              <>
                <h3 className="mb-5 text-lg font-medium text-fg">Other</h3>

                <div className="flex flex-wrap gap-3">
                  <StackItem
                    name="Docker"
                    iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg"
                  />

                  <StackItem
                    name="PostgreSQL"
                    iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg"
                  />

                  <StackItem
                    name="MongoDB"
                    iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
                  />

                  <StackItem
                    name="Nginx"
                    iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg"
                  />

                  <StackItem
                    name="Linux"
                    iconSrc="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg"
                  />

                  <StackItem
                    name="MinIO S3"
                    iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/minio.svg"
                  />

                  <StackItem
                    name="TUS Upload"
                    iconSrc="/tus.png"
                    className="bg-white rounded-full"
                  />

                  <StackItem
                    name="Gitea"
                    iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/gitea.svg"
                  />

                  <StackItem name="Drone CI" iconSrc="/drone-ci.svg" />

                  <StackItem name="Playwright" iconSrc="/playwright-logo.svg" />

                  <StackItem
                    name="Firebase"
                    iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/firebase.svg"
                  />

                  <StackItem
                    name="Cloudflare"
                    iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/cloudflare.svg"
                  />

                  <StackItem
                    name="WireGuard"
                    iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/wireguard.svg"
                  />

                  <StackItem
                    name="Vault"
                    iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/vault.svg"
                  />
                  {/* <StackItem
                    name="ESP32"
                    iconSrc="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/espressif.svg"
                  /> */}
                </div>
              </>
            )}

            <div className={`flex justify-center ${showMore ? 'mt-6' : ''}`}>
              <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-2 rounded-md border border-border-subtle bg-surface-chip px-6 py-2.5 text-sm font-medium text-fg-secondary backdrop-blur-sm transition-all duration-200 hover:border-border-strong hover:bg-surface-hover hover:text-fg"
              >
                <span>{showMore ? labels.showLess : labels.showMore}</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    showMore ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ObservabilitySection
