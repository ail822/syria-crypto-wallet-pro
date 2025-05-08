
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
      <span className="sr-only">
        {theme === "dark" ? "الوضع الفاتح" : "الوضع الداكن"}
      </span>
    </Button>
  );
}
