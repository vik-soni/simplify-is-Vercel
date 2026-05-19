"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics/gtm";

type ThemeMode = "dark" | "light";
const THEME_KEY = "simplify-theme";

function applyTheme(theme: ThemeMode): void {
  document.documentElement.classList.toggle("light", theme === "light");
}

export function DarkLightToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem(THEME_KEY);
    const resolved: ThemeMode = saved === "light" ? "light" : "dark";
    setTheme(resolved);
    applyTheme(resolved);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem(THEME_KEY, nextTheme);
    applyTheme(nextTheme);
    trackEvent("theme_toggle", { theme: nextTheme });
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark and light theme"
      className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-on-surface-muted transition-colors duration-300 hover:text-on-surface hover:bg-surface-container-high"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
