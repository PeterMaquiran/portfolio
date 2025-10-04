"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import Image from "next/image";


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
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen">
      <Header />
    </div>
  );
}
