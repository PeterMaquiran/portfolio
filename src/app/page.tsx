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
import SkillsSection from "./components/SkillsSection";
import { getDictionaryByBrowser } from "@/lib/getDictionary";
import { strong } from "framer-motion/client";

// —————————————————————————————————————————————
// Portfolio data
// —————————————————————————————————————————————
const skills =  getDictionaryByBrowser().skills;
const projects = getDictionaryByBrowser().projects;
const experiences = getDictionaryByBrowser().experiences.reverse();
const testimonials = getDictionaryByBrowser().testimonials;
const about = getDictionaryByBrowser().about;
const sectionsTitle = getDictionaryByBrowser().sectionsTitle;
const navBar = getDictionaryByBrowser().navBar;
const experiencesExample = getDictionaryByBrowser().experiencesExample;

// —————————————————————————————————————————————
// Helpers
// —————————————————————————————————————————————
const Section = ({ id, title, children }: any) => (
  <section id={id} className="max-w-6xl mx-auto px-4 py-16">
    <h2 className="text-2xl font-bold mb-6 text-neutral-100">{title}</h2>
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
  return [true, true, null, true];
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100"
      style={{
        background: "linear-gradient(145deg, #0f172a 0%, #1e293b 40%, #1c2235ff 100%)",
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
          {activeTab === "backend" && <Monitor spinDuration={2500} canvasHeight="230px" canvasWidth="300px" />}
          {activeTab === "observability" && <EarthBackground  />}
        </div>
      </div>

      {/* Skills */}
      <SkillsSection skills={skills} activeTab={activeTab} setActiveTab={setActiveTab} />


      {/* Projects */}
      <Section id="projects" title={sectionsTitle.Projects}>
        <div className="grid gap-8">
          {projects.map((p, index) => (
            <motion.div
              style={{
                background: "lab(83 -18.93 -28.32 / 0.1)",
              }}
              key={index}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-sm cursor-pointer"
              onClick={() =>
                openModal(projectPreviews()[index], ["Grafana", "Mobile"])
              }
            >
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm mb-3 text-neutral-300">{p.blurb}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {p.stack.map((tech: string) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-0.5 bg-indigo-900/40 text-indigo-300 rounded"
                    style={{
                      background: "lab(83 -18.93 -28.32 / 0.1)",
                      color: "lab(83 -18.9 -28.38)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <ul className="text-sm space-y-1 text-neutral-100 list-disc pl-4">
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
        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div
              className={`p-3 rounded-2xl transition-colors ${
                _experiencePreviews()[index] != null
                  ? "cursor-pointer"
                  : "cursor-default"
              }`}
              key={index}
              style={{
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                _experiencePreviews()[index] != null
                  ? (e.currentTarget.style.background =
                      "lab(83 -18.93 -28.32 / 0.1)")
                  : ""
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
              onClick={() =>
                _experiencePreviews()[index] != null
                  ? openModal(
                      experiencePreviews()[index] as ReactNode[],
                      experiencesExample[index] ?? []
                    )
                  : ""
              }
            >
              <h3 className="font-semibold text-lg">{exp.role}</h3>
              {exp.company && (
                <div className="text-sm text-neutral-400">{exp.company}</div>
              )}
              <div className="text-sm text-neutral-300 mb-2">{exp.period}</div>

              {exp.projects?.map((project: any) => (
                <div key={project.name} className="mt-3">
                  <div className="text-sm text-neutral-400">
                    <strong>Project:</strong> {project.name}
                  </div>
                  {project.position && (
                    <div className="text-sm text-neutral-400 mb-1">
                      <strong>Position:</strong> {project.position}
                    </div>
                  )}
                  <ul className="text-sm list-disc pl-5 space-y-1 text-neutral-200">
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
              style={{
                background: "lab(83 -18.93 -28.32 / 0.1)",
              }}
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-sm"
            >
              <p className="italic text-neutral-300 mb-3">
                “{t.quote}”
              </p>
              <div className="text-sm text-neutral-500 flex flex-col justify-between" style={{ color:"lab(83 -18.93 -28.32 / 0.8)"}}>
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


      {/* Footer */}
      <footer className="py-10 border-t border-neutral-800 text-center text-sm text-neutral-500" style={{ color:"lab(83 -18.93 -28.32 / 0.6)"}}>
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
