import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
              NG
            </div>
            <span className="font-semibold text-foreground">
              NextGadgets Store
            </span>
            <span>•</span>
            <span>Course Outcomes CO1 &amp; CO2</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/report" className="hover:text-foreground transition-colors font-medium">
              Technical Report
            </Link>
            <a
              href="#hydration-section"
              className="hover:text-foreground transition-colors"
            >
              Hydration Inspector
            </a>
            <a
              href="#web-vitals-audit"
              className="hover:text-foreground transition-colors"
            >
              Core Web Vitals
            </a>
          </div>
        </div>

        <div className="border-t pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <p>
            Built with Next.js 15 App Router, React 19, Radix UI Primitives, Tailwind CSS, Zustand, and Zod.
          </p>
          <div className="flex items-center gap-1">
            <Terminal className="h-3 w-3 text-emerald-500" />
            <span>Zero Hydration Errors • CLS 0.000 • 100% Type-Safe</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
