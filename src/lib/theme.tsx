"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light";
type ThemeContext = { theme: Theme; toggleTheme: () => void };

const ThemeCtx = createContext<ThemeContext | null>(null);

const STORAGE_KEY = "cemac_theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light") apply("light");
  }, []);

  function apply(t: Theme) {
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
    localStorage.setItem(STORAGE_KEY, t);
  }

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme: () => apply(theme === "dark" ? "light" : "dark") }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
