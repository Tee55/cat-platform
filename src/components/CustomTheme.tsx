"use client";

import { createContext, useEffect, useState, useContext } from "react";
import type { Appearance } from "@/shared/types";

interface ThemeContextValue {
  toggleTheme: () => void;
  theme: Appearance;
}

const ThemeContext = createContext<ThemeContextValue>({
  toggleTheme: () => {},
  theme: "light",
});

export const useCustomTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Appearance>("light");

  useEffect(() => {
    // Load saved theme from localStorage or fallback to system preference
    const saved = localStorage.getItem("appearance") as Appearance | null;

    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      updateHtmlClass(saved);
    } else {
      // Detect system preference on first load
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const initial = prefersDark ? "dark" : "light";
      setTheme(initial);
      updateHtmlClass(initial);
    }
  }, []);

  // Update <html> class for Tailwind dark mode
  const updateHtmlClass = (theme: Appearance) => {
    const html = document.documentElement;
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("appearance", newTheme);
    updateHtmlClass(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      {/* You can wrap children in a div if you want to control scope, but
          applying the class on <html> is preferred for global dark mode */}
      {children}
    </ThemeContext.Provider>
  );
};
