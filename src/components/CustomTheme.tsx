// app/providers/theme-provider.tsx
"use client";

import { Theme } from "@radix-ui/themes";
import { createContext, useEffect, useState, useContext } from "react";
import type { Appearance } from "@/shared/types";

const ThemeContext = createContext({
  toggleTheme: () => {},
  theme: "light" as Appearance,
});

export const useCustomTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Appearance>("light");

  useEffect(() => {
    const saved = localStorage.getItem("appearance") as Appearance;
    setTheme(saved ?? "light");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("appearance", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ toggleTheme, theme }}>
      <Theme
        accentColor="teal"
        grayColor="gray"
        panelBackground="solid"
        scaling="100%"
        radius="full"
        appearance={theme}
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
};
