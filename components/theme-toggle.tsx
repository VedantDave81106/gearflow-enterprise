"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Segmented Theme Toggle Button for the Navbar.
 * Displays explicit "Light" and "Dark" buttons with instantaneous 1-click switching.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting for client mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center rounded-lg border bg-muted/40 p-0.5 text-xs">
        <span className="px-2.5 py-1 text-muted-foreground opacity-50 flex items-center gap-1.5 font-medium">
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span className="hidden sm:inline">Light</span>
        </span>
        <span className="px-2.5 py-1 text-muted-foreground opacity-50 flex items-center gap-1.5 font-medium">
          <Moon className="h-3.5 w-3.5 text-blue-400" />
          <span className="hidden sm:inline">Dark</span>
        </span>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      role="group"
      aria-label="Display theme selection"
      className="flex items-center rounded-lg border border-border/80 bg-muted/40 p-0.5 text-xs shadow-xs"
    >
      {/* Light Mode Button */}
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
          !isDark
            ? "bg-background text-foreground shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={!isDark}
        aria-label="Set Light Mode"
      >
        <Sun className="h-3.5 w-3.5 text-amber-500" />
        <span className="hidden sm:inline">Light</span>
      </button>

      {/* Dark Mode Button */}
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
          isDark
            ? "bg-background text-foreground shadow-xs font-bold"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={isDark}
        aria-label="Set Dark Mode"
      >
        <Moon className="h-3.5 w-3.5 text-blue-400" />
        <span className="hidden sm:inline">Dark</span>
      </button>
    </div>
  );
}

/**
 * On-screen 1-click Light/Dark Mode toggle button.
 * Can be placed directly inside any page content block.
 */
export function ScreenThemeButton() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-8 w-36 rounded-md bg-muted/50 animate-pulse border" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/80 bg-background hover:bg-muted/70 text-xs font-semibold transition-all shadow-xs text-foreground cursor-pointer"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-500 animate-spin-slow" />
          <span>Switch to Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 text-blue-500" />
          <span>Switch to Dark Mode</span>
        </>
      )}
    </button>
  );
}
