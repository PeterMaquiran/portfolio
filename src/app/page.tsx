/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Github, Link, Linkedin, Mail } from "lucide-react";
import { JSX, ReactNode, useEffect, useState } from "react";
import EarthBackground from "./components/EarthBackground";
import Phone from "./components/Phone";
import Monitor from "./components/Monitor";
import Modal from "./components/Modal";
import Header from "./components/Header";
import ESP32 from "./components/esp32";
import SkillsSection from "./components/SkillsSection";
import { getDictionaryByBrowser } from "@/lib/getDictionary";
import { strong } from "framer-motion/client";

// —————————————————————————————————————————————
// Portfolio data
// —————————————————————————————————————————————
const skills =  getDictionaryByBrowser().skills;
const projects = getDictionaryByBrowser().projects;
const experiences = getDictionaryByBrowser().experiences;
const testimonials = getDictionaryByBrowser().testimonials;
const about = getDictionaryByBrowser().about;
const sectionsTitle = getDictionaryByBrowser().sectionsTitle;
const navBar = getDictionaryByBrowser().navBar;
const experiencesExample = getDictionaryByBrowser().experiencesExample;

// —————————————————————————————————————————————
// Helpers
// —————————————————————————————————————————————
const Section = ({ id, title, children }: any) => (
  <section id={id} className="relative max-w-6xl mx-auto px-4 py-16">
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
    <h2 className="mb-8 text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
      {title}
    </h2>
    {children}
  </section>
);

// —————————————————————————————————————————————
// Previews
// —————————————————————————————————————————————
function projectPreviews(): JSX.Element[][] {
  return [
    [
      <Monitor
        key="monitor"
        screenSource="/grafana-monitoring.png"
        cameraStepBack={
          window.innerWidth < 640
            ? 12
            : window.innerWidth < 1024
            ? 8
            : 6
        }
      />
    ],
    [<Phone
      key="phone"
      screenSource="/mobile-porfoio.png"
      enableZoom
      enablePan
      cameraStepBack={10}
      targetCameraStepBack={
          window.innerHeight < 640
            ? 7
            : window.innerHeight < 880
            ? 5.5
            : 6.5
      }
      spin={true}
    />],
  ];
}

function experiencePreviews(): (JSX.Element | null)[][] {
  return [
    [
      <Phone
        key="phone"
        screenSource="/pontrofrescho-mobile.png"
        enableZoom
        enablePan
        cameraStepBack={10}
        targetCameraStepBack={
          window.innerHeight < 640
            ? 7
            : window.innerHeight < 880
            ? 5.5
            : 6.5
        }
      />,
      <Monitor
        key="monitor"
        screenSource="/ponto-fresco-desktop.png"
        cameraStepBack={
          window.innerWidth < 640
            ? 12
            : window.innerWidth < 1024
            ? 8
            : 6
        }
      />
    ],
    [
      <Monitor
        key="monitor"
        screenSource="/prescricao.jpg"
        cameraStepBack={
          window.innerWidth < 640
            ? 12
            : window.innerWidth < 1024
            ? 8
            : 6
        }
      />
    ],
    [],
    [
      <Phone
        key="phone"
        screenSource="/digipay.png"
        enableZoom
        enablePan
        cameraStepBack={10}
        targetCameraStepBack={
          window.innerHeight < 640
            ? 7
            : window.innerHeight < 880
            ? 5.5
            : 6.5
        }
      />
    ],
  ].reverse();
}

function _experiencePreviews(): (boolean | null)[] {
  return [true, null, true, true];
}

// —————————————————————————————————————————————
// Main Component
// —————————————————————————————————————————————
export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [tabs, setTabs] = useState<{ label: string; content: ReactNode }[]>([]);
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [activeTab, setActiveTab] = useState("web"); // default tab

  useEffect(() => {
    document.title = "Peter Maquiran | Portfolio";
  }, []);

  // ————————————————————————————————————————
  // Open Modal with multiple tabs
  // ————————————————————————————————————————
  function openModal(contents: ReactNode[], labels: string[]) {
    const combinedTabs = contents.map((content, i) => ({
      label: labels[i] || `Tab ${i + 1}`,
      content,
    }));
    setTabs(combinedTabs);
    setShowModal(true);
  }

  return (
    <div
      className="min-h-screen text-neutral-100 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at -10% -10%, rgba(56,189,248,0.10), transparent 55%), radial-gradient(circle at 110% -10%, rgba(129,140,248,0.12), transparent 55%), radial-gradient(circle at 50% 40%, rgba(148,163,184,0.18), transparent 60%), radial-gradient(circle at 50% 120%, rgba(45, 212, 190, 0.14), transparent 55%), linear-gradient(145deg, #020617 0%, #020617 40%, #0f172a 100%)",
      }}
    >
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 pt-16 flex flex-col md:flex-row items-center justify-between gap-12">

        {/* About */}
        <div id="about" title="About" className="flex-1" >
          <p className="max-w-3xl leading-relaxed text-neutral-200" dangerouslySetInnerHTML={{ __html: about.intro }} />
          <p className="max-w-3xl leading-relaxed text-neutral-200 mt-4" dangerouslySetInnerHTML={{ __html: about.observability }} />
          <p className="max-w-3xl leading-relaxed text-neutral-200 mt-4" dangerouslySetInnerHTML={{ __html: about.philosophy }} />
        </div>

        {/* Earth */}
        <div className="flex-1 flex justify-end">
          {activeTab === "web" && <Monitor  spinDuration={2500} screenSource="/front-end.png" canvasHeight="230px" canvasWidth="300px" />}
          {activeTab === "mobile" && <Phone targetCameraStepBack={5} cameraStepBack={8} canvasHeight="230px" canvasWidth="300px" />}
          {activeTab === "Microcontroller" && <ESP32 targetCameraStepBack={5} cameraStepBack={8} canvasHeight="230px" canvasWidth="300px" />}
          {activeTab === "backend" && <Monitor spinDuration={2500} canvasHeight="230px" canvasWidth="300px" />}
          {activeTab === "observability" && <EarthBackground  />}
        </div>
      </div>

      {/* Skills */}
      <SkillsSection skills={skills} activeTab={activeTab} setActiveTab={setActiveTab} />


      {/* Projects */}
      <Section id="projects" title={sectionsTitle.Projects}>
        <div className="grid gap-7">
          {projects.map((p, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 px-6 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.5)] cursor-pointer transition-transform duration-200"
              onClick={() =>
                openModal(projectPreviews()[index], ["Grafana", "Mobile"])
              }
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-sky-400/5 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex flex-col gap-3">
                <h3 className="text-base font-semibold text-neutral-50">
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-300">
                  {p.blurb}
                </p>
              </div>

              <div className="relative mt-4 mb-3 flex flex-wrap gap-2">
                {p.stack.map((tech: string) => (
                  <span
                    key={tech}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-sky-400/30 bg-slate-800/70 text-sky-200/95"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <ul className="relative text-sm space-y-1.5 text-neutral-100 list-disc pl-4">
                {p.highlights.map((h: string) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ————————————————————————————————
          Experience Section
      ———————————————————————————————— */}
      <Section id="experience" title={sectionsTitle.Experience}>
        <div className="space-y-5">
          {experiences.map((exp, index) => (
            <div
              className={`group relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/75 px-5 py-4 transition-colors ${
                _experiencePreviews()[index] != null
                  ? "cursor-pointer hover:border-sky-400/40"
                  : "cursor-default"
              }`}
              key={index}
              onClick={() =>
                _experiencePreviews()[index] != null
                  ? openModal(
                      experiencePreviews()[index] as ReactNode[],
                      experiencesExample[index] ?? []
                    )
                  : ""
              }
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <h3 className="relative text-base font-semibold text-neutral-50">
                {exp.role}
              </h3>
              {exp.company && (
                <div className="relative text-xs uppercase tracking-[0.2em] text-slate-400 mt-1">
                  {exp.company}
                </div>
              )}
              <div className="relative mt-1 text-xs text-slate-400">
                {exp.period}
              </div>

              {exp.projects?.map((project: any) => (
                <div key={project.name} className="relative mt-4 rounded-xl bg-slate-800/70 px-3 py-3 border border-slate-700/70">
                  <div className="text-xs font-medium text-slate-300">
                    <strong>Project:</strong> {project.name}
                  </div>
                  {project.position && (
                    <div className="text-xs text-slate-400 mb-1 mt-0.5">
                      <strong>Position:</strong> {project.position}
                    </div>
                  )}
                  <ul className="text-sm list-disc pl-4 space-y-1.5 text-neutral-200">
                    {project.bullets.map((b: string) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>


      {/* Testimonials */}
      <Section id="testimonials" title={sectionsTitle.Testimonials}>
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.a
              href={t.link}
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-slate-900/80 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.5)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-400/12 via-sky-400/10 to-transparent opacity-0 blur-xl transition-opacity duration-300 hover:opacity-100" />
              <p className="relative italic text-neutral-300 mb-3">
                “{t.quote}”
              </p>
              <div className="relative text-sm text-slate-300 flex flex-col justify-between">
                {t.author}
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* ————————————————————————————————
          Modal Component
      ———————————————————————————————— */}

      { showModal == true ? 
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          tabs={tabs}
        />
      : null}


      {/* Premium LinkedIn badge above footer */}
      <div className="mt-12 mb-6 flex justify-center">
        <a
          href="https://www.linkedin.com/in/petermaquiran/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-4 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 px-5 py-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] transition transform hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(37,99,235,0.55)]"
        >
          {/* Glow */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-cyan-400/10 to-transparent opacity-0 blur-xl transition-opacity group-hover:opacity-100" />

          {/* Avatar */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-blue-400/40 bg-slate-800">
            <img
              src="/peter-linkedin.jpg" // <-- replace with your actual photo path
              alt="Peter Maquiran"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="relative flex flex-col">
            <span className="text-xs uppercase tracking-[0.18em] text-blue-300/80">
              Available for opportunities
            </span>
            <span className="text-sm font-semibold text-neutral-50">
              Peter Maquiran
            </span>
            <span className="text-xs text-neutral-400">
              Software Developer · Web, Mobile & Observability
            </span>
          </div>

          {/* LinkedIn pill */}
          <div className="relative ml-4 flex items-center gap-2 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold text-white shadow-lg group-hover:bg-blue-500">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-blue-600">
              in
            </span>
            <span className="hidden sm:inline">
              View profile
            </span>
          </div>
        </a>
      </div>

      {/* Footer */}
      <footer className="py-10 border-t text-center text-sm text-neutral-500" style={{ color:"lab(83 -18.93 -28.32 / 0.6)", borderColor: "lab(83 -18.93 -28.32 / 0.2)"}}>
        <div className="flex justify-center gap-4 mb-2">
          <a href="https://github.com/PeterMaquiran" className="hover:text-neutral-300">
            <Github className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/in/petermaquiran/" className="hover:text-neutral-300">
            <Linkedin className="w-5 h-5" />
          </a>
          <a href="mailto:petermaquiran29@gmail.com" className="hover:text-neutral-300">
            <Mail className="w-5 h-5" />
          </a>
        </div>
        © {new Date().getFullYear()} Peter Maquiran 
      </footer>
    </div>
  );
}
