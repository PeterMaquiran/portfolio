/* eslint-disable react/no-unescaped-entities */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Rocket } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

// —————————————————————————————————————————————
// Portfolio data
// —————————————————————————————————————————————
const skills = {
  frontend: [
    "Angular",
    "Ionic (Angular)",
    "TypeScript",
    "RxJS",
    "Zod",
    "Webpack",
    "Sentry",
    "OpenTelemetry (web)",
  ],
  backend: [
    "Node.js",
    "Express",
    "RabbitMQ",
    "Redis",
    "SQLite/Postgres",
    "Nginx",
    "REST",
    "WebSockets",
  ],
  devops: [
    "Docker",
    "Docker Swarm",
    "Compose",
    "Nginx Reverse Proxy",
    "Certbot/SSL",
    "OpenTelemetry Collector",
    "Zipkin",
    "Prometheus",
    "Loki",
    "Drone CI",
  ],
  mobile: [
    "Ionic",
    "Capacitor",
    "Offline-first",
    "Chunked Uploads (>5GB)",
    "AES Encryption",
    "Android/iOS",
  ],
};

const projects = [
  {
    title: "Observability-First Chat/Feed App",
    blurb:
      "Offline-first Ionic/Angular app with chunked media uploads, scroll-position history loading, and end-to-end tracing.",
    stack: ["Ionic", "Angular", "OpenTelemetry", "Zipkin", "Prometheus", "Sentry"],
    highlights: [
      "Maintains scroll position when prepending history",
      "Uploads 5GB+ files via chunked strategy with resume",
      "Traces flows front-to-back with OTel + Zipkin",
    ],
  },
  {
    title: "Self-Hosted DevOps Stack",
    blurb:
      "Docker Swarm cluster with Nginx reverse proxy, TLS via Certbot, private registry, Drone CI, and metrics/logs/traces pipeline.",
    stack: ["Docker", "Swarm", "Nginx", "Certbot", "Drone", "Prometheus", "Loki"],
    highlights: [
      "Blue/green style updates for zero-downtime",
      "Gitea + Drone CI pipelines to build & deploy",
      "Centralized logs and dashboards",
    ],
  },
  {
    title: "Secure Media Validator",
    blurb:
      "Reusable FileValidatorService to validate images, video, audio, and filenames with strict schema (Zod) and Sentry reporting.",
    stack: ["TypeScript", "Angular", "Zod", "Sentry"],
    highlights: [
      "Schema-driven validation",
      "Fast diff checks for large objects",
      "Actionable error telemetry",
    ],
  },
];

const experiences = [
  {
    role: "Full-Stack Web & Mobile Engineer",
    period: "2019 — Present",
    bullets: [
      "Architected offline-first mobile flows with background sync",
      "Implemented distributed tracing across web, API, and services",
      "Managed Docker Swarm stacks with Nginx reverse proxy and TLS",
    ],
  },
];

const testimonials = [
  {
    quote:
      "Peter brought production-grade observability to our stack. We caught issues before users did and shipped faster.",
    author: "Engineering Manager, SaaS Company",
  },
  {
    quote:
      "Our media uploads went from fragile to rock-solid, even on spotty networks. Huge win for our mobile users.",
    author: "Product Lead, Mobile Startup",
  },
];



const Header = () => (
  <header className="sticky top-0 z-50 w-full backdrop-blur bg-white/80 dark:bg-neutral-900/80 border-b">
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="h-9 w-9 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow"
        >
          <Rocket className="h-5 w-5" />
        </motion.div>
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">
            Peter Maquiran
          </div>
          <div className="text-xs text-neutral-500">Web & Mobile Engineer</div>
        </div>
      </div>
      <nav className="hidden md:flex gap-5 text-sm text-neutral-700 dark:text-neutral-300">
        {["About", "Skills", "Projects", "Experience", "Testimonials"].map(
          (item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-indigo-500">
              {item}
            </a>
          )
        )}
      </nav>
    </div>
  </header>
);

const Section = ({ id, title, children }: any) => (
  <section id={id} className="max-w-6xl mx-auto px-4 py-16">
    <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
      {title}
    </h2>
    {children}
  </section>
);


export default function Home() {
  useEffect(() => {
    document.title = "Peter Maquiran | Portfolio";
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100">
      <Header />

      {/* About */}
      <Section id="about" title="About">
        <p className="max-w-3xl leading-relaxed">
          I'm a full-stack web and mobile engineer specializing in{" "}
          <strong>Angular, Ionic, and Node.js</strong>. I design offline-first
          systems with robust observability pipelines powered by{" "}
          <strong>OpenTelemetry, Prometheus, and Zipkin</strong>. My work spans
          the full stack — from frontend UX to backend reliability and
          DevOps automation.
        </p>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Skills">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(skills).map(([key, list]) => (
            <div key={key}>
              <h3 className="font-semibold mb-2 capitalize text-indigo-500">
                {key}
              </h3>
              <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                {list.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Projects">
        <div className="grid gap-8">
          {projects.map((p) => (
            <motion.div
              key={p.title}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm mb-3 text-neutral-600 dark:text-neutral-400">
                {p.blurb}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {p.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-300 list-disc pl-4">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience">
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.role}>
              <h3 className="font-semibold">{exp.role}</h3>
              <div className="text-sm text-neutral-500 mb-2">{exp.period}</div>
              <ul className="text-sm list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-400">
                {exp.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section id="testimonials" title="Testimonials">
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <p className="italic text-neutral-700 dark:text-neutral-300 mb-3">
                “{t.quote}”
              </p>
              <div className="text-sm text-neutral-500">— {t.author}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-10 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500">
        <div className="flex justify-center gap-4 mb-2">
          <a href="#" className="hover:text-indigo-500">
            <Github className="w-5 h-5" />
          </a>
          <a href="#" className="hover:text-indigo-500">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:contact@peter.dev" className="hover:text-indigo-500">
            <Mail className="w-5 h-5" />
          </a>
        </div>
        © {new Date().getFullYear()} Peter Maquiran
      </footer>
    </div>
  );
}
