import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { ui, type Lang } from "@/lib/i18n";

const THEME_KEY = "openatlas-theme";
export type ThemeMode = "auto" | "light" | "dark";

function storedTheme(): ThemeMode {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : "auto";
  } catch {
    return "auto";
  }
}

function applyTheme(mode: ThemeMode) {
  const dark =
    mode === "dark" ||
    (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle({ lang }: { lang: Lang }) {
  const t = ui[lang];
  const [mode, setMode] = useState<ThemeMode>("auto");
  useEffect(() => {
    const current = storedTheme();
    setMode(current);
    applyTheme(current);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (storedTheme() === "auto") applyTheme("auto");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  const cycle = () => {
    const next: ThemeMode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    setMode(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable */
    }
    applyTheme(next);
  };
  const label = mode === "auto" ? t.themeAuto : mode === "light" ? t.themeLight : t.themeDark;
  return (
    <button type="button" className="theme-toggle" onClick={cycle} aria-label={label} title={label}>
      {mode === "auto" ? (
        <Monitor size={16} />
      ) : mode === "light" ? (
        <Sun size={16} />
      ) : (
        <Moon size={16} />
      )}
    </button>
  );
}

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}
