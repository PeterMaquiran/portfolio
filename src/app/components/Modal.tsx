"use client";
import { ReactNode, useEffect, useState } from "react";

interface Tab {
  label: string;
  content: ReactNode;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: Tab[];
  background?: string;
}

export default function Modal({
  isOpen,
  onClose,
  tabs,
  background = "lab(8 -4.04 -6.43 / 0.44)",
}: ModalProps) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) {
    setActiveTab(0);
    return null;
  }

  const hasMultipleTabs = tabs.length > 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 backdrop-blur-md overflow-auto"
      style={{ background }}
    >
      {/* Only render tab buttons if there’s more than one */}
      {hasMultipleTabs && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 px-4 py-2 z-[60]">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer backdrop-blur-md"
              style={{
                background:
                  activeTab === i
                    ? "lab(83 -18.93 -28.32 / 0.7)"
                    : "lab(83 -18.93 -28.32 / 0.1)",
                color:
                  activeTab === i
                    ? "white"
                    : "lab(83 -18.9 -28.38 / 0.7)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Close Button */}
      <button
        onClick={() => {
          onClose();
          setActiveTab(0);
        }}
        style={{ color: "lab(83 -18.93 -28.32 / 0.8)" }}
        className="fixed top-4 right-6 text-2xl font-bold cursor-pointer z-[60]"
      >
        ×
      </button>

      {/* Tab Content */}
      <div className="flex justify-center items-center w-full min-h-screen">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
