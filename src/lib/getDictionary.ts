// lib/getDictionary.ts
import en from "../locales/en.json";
import pt from "../locales/pt.json";

// Detect from environment
export type Dictionary = typeof en;

export function getDictionaryByBrowser(): Dictionary {
  if (typeof window !== "undefined") {
    const lang = navigator.language?.split("-")[0] || "en";
    if (lang.startsWith("pt")) return pt as Dictionary;
    return pt;
  }
  return pt;
}