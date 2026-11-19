import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";

const THEME_KEY = "openatlas-theme";
export type ThemeMode = "auto" | "light" | "dark";

function applyTheme(mode: ThemeMode) {
  const dark = mode === "dark" || (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>("auto");
  useEffect(() => {
    const stored = (localStorage.getItem(THEME_KEY) as ThemeMode | null) ?? "auto";
    setMode(stored);
    applyTheme(stored);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => { if ((localStorage.getItem(THEME_KEY) as ThemeMode | null) === "auto") applyTheme("auto"); };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  const cycle = () => {
    const next: ThemeMode = mode === "auto" ? "light" : mode === "light" ? "dark" : "auto";
    setMode(next);
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  };
  const label = mode === "auto" ? "Theme: follow system" : mode === "light" ? "Theme: light" : "Theme: dark";
  return (
    <button type="button" className="theme-toggle" onClick={cycle} aria-label={label} title={label}>
      {mode === "auto" ? <Monitor size={16} /> : mode === "light" ? <Sun size={16} /> : <Moon size={16} />}
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
