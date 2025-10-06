"use client";
import { motion } from "framer-motion";
import { ReactNode, useEffect } from "react";


export default function SkillsSection({
  skills,
  activeTab,
  setActiveTab,
}: {
  skills: Record<string, { title: string; items: { name: string; level: number }[] }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
})  {
  const categories = Object.keys(skills);
  const active = skills[activeTab];

  return (
    <section id="skills" className="max-w-6xl mx-auto px-4 py-16">
      <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-neutral-100">
        {active.title}
      </h2>

      {/* Tabs header */}
      <div className="flex flex-wrap gap-3 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className="px-4 py-1.5 text-sm rounded-md transition-colors"
            style={{
              background:
                activeTab === cat
                  ? "lab(83 -18.93 -28.32 / 0.7)"
                  : "lab(83 -18.93 -28.32 / 0.1)",
              color:
                activeTab === cat
                  ? "white"
                  : "lab(83 -18.93 -28.32 / 0.7)",
              cursor: "pointer",
            }}
          >
            {skills[cat].title}
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
        {active.items.map((s) => (
          <div key={s.name}>
            <div className="flex justify-between text-sm text-neutral-700 dark:text-neutral-300">
              <span>{s.name}</span>
              <span className="text-neutral-400">{s.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${s.level}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ background: "lab(83 -18.93 -28.32 / 0.7)" }}
                className="h-full rounded-full"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
