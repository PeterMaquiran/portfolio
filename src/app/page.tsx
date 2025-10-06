/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import EarthBackground from "./components/EarthBackground";
import Phone from "./components/Phone";
import Monitor from "./components/Monitor";
import Modal from "./components/Modal";
import Header from "./components/Header";
import SkillsSection from "./components/SkillsSection";
import { getDictionaryByBrowser } from "@/lib/getDictionary";

// —————————————————————————————————————————————
// Portfolio data
// —————————————————————————————————————————————
const skills =  getDictionaryByBrowser().skills;
const projects = getDictionaryByBrowser().projects;
const experiences = getDictionaryByBrowser().experiences;
const testimonials = getDictionaryByBrowser().testimonials;
const about = getDictionaryByBrowser().about;


const Section = ({ id, title, children }: any) => (
  <section id={id} className="max-w-6xl mx-auto px-4 py-16"

  >
    <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
      {title}
    </h2>
    {children}
  </section>
);


function projectPreviews() {
  return [
    <Monitor
      key="monitor"
      canvasHeight="800px"
      canvasWidth="800px"
      screenSource="/grafana-monitoring.png"
      //enableZoom
      //enablePan
      cameraStepBack={window.innerWidth < 768 ? 12 : 8} // smaller for mobile
    />,
    <Phone
      key="phone"
      canvasHeight="800px"
      canvasWidth="880px"
      screenSource="/mobile-porfoio.png"
      enableZoom
      enablePan
      cameraStepBack={8}
    />
  ];
}


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
          <p className="max-w-3xl leading-relaxed text-neutral-200" dangerouslySetInnerHTML={{ __html: about.intro }} />
          <p className="max-w-3xl leading-relaxed text-neutral-200 mt-4" dangerouslySetInnerHTML={{ __html: about.observability }} />
          <p className="max-w-3xl leading-relaxed text-neutral-200 mt-4" dangerouslySetInnerHTML={{ __html: about.philosophy }} />
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
        <div className="grid gap-8">
          {projects.map((p, index) => (
            <motion.div
              style={{
                background: "lab(83 -18.93 -28.32 / 0.1)",
              }}
              key={p.title}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm cursor-pointer"
              onClick={() => openModal(projectPreviews()[index])}
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
            <div 
              className="p-3 rounded-2xl cursor-pointer transition-colors"
              key={exp.role}
              style={{
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "lab(83 -18.93 -28.32 / 0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
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
