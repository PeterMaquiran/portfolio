"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Rocket } from "lucide-react";
import Image from "next/image";
import { ReactNode, useEffect, useRef, useState } from "react";
import EarthBackground from "./components/EarthBackground";
import Phone from "./components/Phone";
import Monitor from "./components/Monitor";
import Modal from "./components/Modal";
interface PhoneConfig {
  canvasHeight: string;
  canvasWidth: string;
  screenSource: string;
  enableZoom: boolean;
  enablePan: boolean;
  cameraStepBack: number;
}

// —————————————————————————————————————————————
// Portfolio data
// —————————————————————————————————————————————
const skills = {
  web: [
    { name: "Vue", level: 100 },
    { name: "Angular", level: 100 },
    { name: "Ionic (Angular)", level: 95 },
    { name: "TypeScript", level: 100 },
    { name: "Chat app", level: 100 },
    { name: "HTML", level: 100 },
    { name: "CSS", level: 100 },
    { name: "Taiwind", level: 100 },
    { name: "RxJS", level: 100 },
    { name: "Zod", level: 100 },
    { name: "Webpack", level: 80 },
    { name: "Sentry", level: 80 },
    { name: "OpenTelemetry (web)", level: 100 },
    { name: "Firebase", level: 80 },
  ],
  backend: [
    { name: "Node.js", level: 100 },
    { name: "Nest.js", level: 100 },
    { name: "RabbitMQ", level: 80 },
    { name: "Redis", level: 80 },
    { name: "Postgres", level: 80 },
    { name: "Nginx", level: 95 },
    { name: "REST", level: 100 },
    { name: "WebSockets", level: 80 },
    { name: "WebSockets", level: 80 },
    { name: "Docker", level: 100 },
    { name: "Swarm", level: 80 },
    { name: "Self hosted Gitea", level: 80 },
    { name: "Self hosted Drone Ci", level: 80 },
    { name: "Self hosted Grafana", level: 80 },
    { name: "Self hosted Prometheus", level: 80 },
    { name: "Self hosted Prometheus", level: 80 },
  ],
  observability: [
    { name: "OpenTelemetry Collector", level: 100 },
    { name: "Zipkin", level: 100 },
    { name: "Prometheus", level: 100 },
    { name: "Loki", level: 100 },
    { name: "Grafana", level: 100 },
    { name: "Server monitoring", level: 100 },
    { name: "User monitoring", level: 100 },
    { name: "Metrics", level: 100 },
    { name: "Logs", level: 100 },
    { name: "Tracing", level: 100 },
  ],
  mobile: [
    { name: "Flutter", level: 80 },
    { name: "Ionic", level: 90 },
    { name: "Capacitor", level: 85 },
    { name: "Offline-first", level: 95 },
    { name: "Offline-first chat app", level: 95 },
    { name: "Android/iOS", level: 90 },
    { name: "Firebase Push Notification", level: 100 },
  ],
};


const projects = [
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
    title: "Reactive Portfolio Website",
    blurb:
      "Responsive Next.js portfolio optimized for web and mobile with smooth animations, 3D elements, and language templates (EN/PT).",
    stack: ["Next.js", "React", "Tailwind", "Three.js"],
    highlights: [
      "Fully responsive and mobile-first design",
      "Interactive 3D scenes using Three.js",
      "Multilingual templates (English & Portuguese)",
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


const SkillsSection = ({
  skills,
  activeTab,
  setActiveTab,
}: {
  skills: Record<string, { name: string; level: number }[]>,
  activeTab: string,
  setActiveTab: (tab: string) => void
}) => {
  const categories = Object.keys(skills);

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

  const [activeTab, setActiveTab] = useState("web"); // default tab
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  function openModal(content: ReactNode) {
    setModalContent(content);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #1c2235ff 100%)",
      }}
    >
      <Header />
      

      <div className="max-w-6xl mx-auto px-4 pt-16 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* About */}
        <div id="about" title="About" className="flex-1" >
          <p className="max-w-3xl leading-relaxed text-neutral-200">
            I'm a <strong>Web & Mobile Developer</strong> focused on building reliable, observable, and offline-ready applications.
            I work mainly with <strong>Angular</strong>, <strong>Ionic</strong>, and <strong>Node.js</strong>, crafting smooth experiences that stay fast — even with poor connectivity.
          </p>

          <p className="max-w-3xl leading-relaxed text-neutral-200 mt-4">
            I care deeply about <strong>observability</strong> and <strong>performance</strong>, using <strong>OpenTelemetry</strong>, <strong>Zipkin</strong>, <strong>Prometheus</strong>, and <strong>Grafana</strong> to trace and monitor systems end-to-end.
            I also manage <strong>Docker-based infrastructure</strong> with <strong>Nginx</strong>, <strong>Certbot</strong>, and automated <strong>CI/CD pipelines</strong> for secure, zero-downtime deployments.
          </p>

          <p className="max-w-3xl leading-relaxed text-neutral-200 mt-4">
            I love turning complex systems into simple, dependable apps — where every request, metric, and trace tells a story.
          </p>
        </div>

        {/* Earth */}
        <div className="flex-1 flex justify-end">
          {activeTab === "web" && <Monitor screenSource="/front-end.png" />}
          {activeTab === "mobile" && <Phone />}
          {activeTab === "backend" && <Monitor />}
          {activeTab === "observability" && <EarthBackground />}
        </div>
      </div>

      {/* Skills */}
      <SkillsSection skills={skills} activeTab={activeTab} setActiveTab={setActiveTab} />


      {/* Projects */}
      <Section id="projects" title="Projects">
        <div className="grid gap-8" style={{cursor:'pointer'}} 
           onClick={() => 
            openModal(
              <Phone
                canvasHeight="800px"
                canvasWidth="880px"
                screenSource="/mobile-porfoio.png"
                enableZoom={true}
                enablePan={true}
                cameraStepBack={8}
              />
          )}
        >
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
      <Section id="experience" title="Experience">
        <div className="space-y-6">
          {experiences.map((exp) => (
            <div key={exp.role}>
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


      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {modalContent}
      </Modal>

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
