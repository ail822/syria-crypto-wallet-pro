
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "dark" | "light" | "blue" | "green" | "purple";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Get initial theme from localStorage or system preference
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) return savedTheme;
    
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove("dark", "light", "theme-blue", "theme-green", "theme-purple");
    
    // Add the appropriate class based on theme
    if (theme === "dark" || theme === "light") {
      root.classList.add(theme);
    } else {
      // For custom themes, add both dark mode and the theme-specific class
      root.classList.add("dark");
      root.classList.add(`theme-${theme}`);
    }
    
    // Update the background color based on theme
    if (theme === "light") {
      root.style.backgroundColor = "#ffffff";
    } else if (theme === "dark") {
      root.style.backgroundColor = "#121212";
    } else if (theme === "blue") {
      root.style.backgroundColor = "#0c1e47";
    } else if (theme === "green") {
      root.style.backgroundColor = "#0c2a1c";
    } else if (theme === "purple") {
      root.style.backgroundColor = "#240c47";
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
