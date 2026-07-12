"use client";

import { createContext, useContext, useState, useCallback, useSyncExternalStore, ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("lisensiku-theme");
  if (saved === "dark" || saved === "light") return saved;
  return "dark";
}

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const initialTheme = useSyncExternalStore(subscribe, getStoredTheme, () => "dark" as Theme);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [mounted, setMounted] = useState(false);

  // Apply theme to DOM once mounted
  // Using a ref-like pattern to avoid setState in effect
  if (typeof window !== "undefined" && !mounted) {
    // This runs synchronously on first client render
    setMounted(true);
  }

  // Apply theme attribute whenever theme changes
  if (typeof window !== "undefined" && mounted) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("lisensiku-theme", theme);
  }

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
