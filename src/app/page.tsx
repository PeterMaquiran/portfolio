"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Rocket } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import EarthBackground from "./components/EarthBackground";
import Phone from "./components/Phone";
import Monitor from "./components/Monitor";

// —————————————————————————————————————————————
// Portfolio data
// —————————————————————————————————————————————
const skills = {
  frontend: [
    { name: "Angular", level: 95 },
    { name: "Ionic (Angular)", level: 90 },
    { name: "TypeScript", level: 95 },
    { name: "RxJS", level: 90 },
    { name: "Zod", level: 85 },
    { name: "Webpack", level: 80 },
    { name: "Sentry", level: 80 },
    { name: "OpenTelemetry (web)", level: 75 },
  ],
  backend: [
    { name: "Node.js", level: 90 },
    { name: "Express", level: 90 },
    { name: "RabbitMQ", level: 80 },
    { name: "Redis", level: 85 },
    { name: "SQLite/Postgres", level: 80 },
    { name: "Nginx", level: 85 },
    { name: "REST", level: 95 },
    { name: "WebSockets", level: 80 },
  ],
  devops: [
    { name: "Docker", level: 90 },
    { name: "Docker Swarm", level: 85 },
    { name: "Compose", level: 90 },
    { name: "Nginx Reverse Proxy", level: 85 },
    { name: "Certbot/SSL", level: 80 },
    { name: "OpenTelemetry Collector", level: 75 },
    { name: "Zipkin", level: 80 },
    { name: "Prometheus", level: 80 },
    { name: "Loki", level: 75 },
    { name: "Drone CI", level: 70 },
  ],
  mobile: [
    { name: "Ionic", level: 90 },
    { name: "Capacitor", level: 85 },
    { name: "Offline-first", level: 95 },
    { name: "Chunked Uploads (>5GB)", level: 90 },
    { name: "AES Encryption", level: 80 },
    { name: "Android/iOS", level: 90 },
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
  <header className="sticky top-0 z-50 w-full backdrop-blur  border-b"
    style={{
      background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #1c2235ff 100%)',
      borderBottom: '1px solid lab(83 -18.93 -28.32 / 0.3)'
    }}
  >
    <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="h-9 w-9 rounded-2xl grid place-items-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow"
        >
          <Rocket className="h-5 w-5" />
        </motion.div> */}
        <div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">
            Peter Maquiran
          </div>
          <div className="text-xs" style={{ color:"lab(83 -18.93 -28.32 / 0.7)"}}>Software Developer</div>
        </div>
      </div>
      <nav className="hidden md:flex gap-5 text-sm text-neutral-700 dark:text-neutral-300">
        {["Skills", "Projects", "Experience", "Testimonials"].map(
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
  <section id={id} className="max-w-6xl mx-auto px-4 py-16"

  >
    <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
      {title}
    </h2>
    {children}
  </section>
);


const SkillsSection = ({ skills }: { skills: Record<string, { name: string; level: number }[]> }) => {
  const categories = Object.keys(skills);
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <section id="skills" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">Skills</h2>

      {/* Tabs header */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-1.5 text-sm rounded-md transition-colors`}
            style={{
              background: activeTab === cat
                ? "lab(83 -18.93 -28.32 / 0.7)"
                : "lab(83 -18.93 -28.32 / 0.1)",
              color: activeTab === cat
                ? "white"
                : "lab(83 -18.93 -28.32 / 0.7)",
              cursor:'pointer'
            }}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {skills[activeTab].map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-sm text-neutral-700 dark:text-neutral-300">
              <span>{s.name}</span>
              <span className="text-neutral-300">{s.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                style={{ background:"lab(83 -18.93 -28.32 / 0.7)"}}
                whileInView={{ width: `${s.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default function Home() {
  useEffect(() => {
    document.title = "Peter Maquiran | Portfolio";
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showPhone, setShowPhone] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #1c2235ff 100%)",
      }}
    >
      <Header />
      

      <div className="max-w-6xl mx-auto px-4 pt-16 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* About */}
        <div id="about" title="About" className="flex-1">
          <p className="max-w-3xl leading-relaxed">
            I'm a full-stack web and mobile engineer specializing in{" "}
            <strong>Angular, Ionic, and Node.js</strong>. I design offline-first
            systems with robust observability pipelines powered by{" "}
            <strong>OpenTelemetry, Prometheus, and Zipkin</strong>. My work spans
            the full stack — from frontend UX to backend reliability and
            DevOps automation.
          </p>
        </div>

        {/* Earth */}
        <div className="flex-1 flex justify-end">
          <EarthBackground />
          <Phone />
        </div>
      </div>

      <Monitor/>

      {/* Skills */}
      <SkillsSection skills={skills}/>


      {/* Projects */}
      <Section id="projects" title="Projects">
        <div className="grid gap-8">
          {projects.map((p) => (
            <motion.div
              style={{
                background: "lab(83 -18.93 -28.32 / 0.1)",
              }}
              key={p.title}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm mb-3 text-neutral-600 dark:text-neutral-300">
                {p.blurb}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {p.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 rounded"
                    style={{
                      background: 'lab(83 -18.93 -28.32 / 0.1)',
                      color: 'lab(83 -18.9 -28.38)'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <ul className="text-sm space-y-1 text-neutral-700 dark:text-neutral-100 list-disc pl-4">
                {p.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience" onClick={() => setShowPhone(true)}>
        <div className="space-y-6" onClick={() => setShowPhone(true)}>
          {experiences.map((exp) => (
            <div key={exp.role} onClick={() => setShowPhone(true)}>
              <h3 className="font-semibold">{exp.role}</h3>
              <div className="text-sm text-neutral-300 mb-2">{exp.period}</div>
              <ul className="text-sm list-disc pl-5 space-y-1 text-neutral-600 dark:text-neutral-200">
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
              style={{
                background: "lab(83 -18.93 -28.32 / 0.1)",
              }}
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <p className="italic text-neutral-700 dark:text-neutral-300 mb-3">
                “{t.quote}”
              </p>
              <div className="text-sm text-neutral-500" style={{ color:"lab(83 -18.93 -28.32 / 0.8)"}}>— {t.author}</div>
            </motion.div>
          ))}
        </div>
      </Section>


      {/* Centered overlay modal */}
      {showPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          {/* Phone canvas container */}
          <Phone />
          {/* Close button */}
          <button
            onClick={() => setShowPhone(false)}
            className="absolute top-4 right-4 text-white text-xl font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="py-10 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm text-neutral-500" style={{ color:"lab(83 -18.93 -28.32 / 0.6)"}}>
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
