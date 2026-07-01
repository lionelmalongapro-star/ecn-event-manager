"use client";

import { useEffect, useState } from "react";

const KEY = "cemac_theme";

export function useThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  // Sync from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    const dark = stored !== "light";
    setIsDark(dark);
    document.documentElement.classList.toggle("light", !dark);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("light", !next);
      localStorage.setItem(KEY, next ? "dark" : "light");
      return next;
    });
  };

  return { isDark, toggle };
}
