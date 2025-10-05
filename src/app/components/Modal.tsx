"use client";
import { ReactNode, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  background?: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  background = "bg-black/70",
}: ModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${background}`}>
      {children}
      <button
        onClick={onClose}
        style={{ color: "lab(83 -18.93 -28.32 / 0.8)" }}
        className="absolute top-4 right-4 text-xl font-bold cursor-pointer"
      >
        ×
      </button>
    </div>
  );
}
