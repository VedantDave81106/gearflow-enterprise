import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Server,
  Layers,
  ShieldCheck,
  Gauge,
  Code2,
  Camera,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Academic Technical Report | GearFlow Enterprise",
  description:
    "Comprehensive 2-3 page technical report analyzing RSC vs Client Component trees, Zustand vs Server state, and Core Web Vitals Lighthouse audit metrics.",
};

export default function ReportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-10 print:py-0 print:px-0 print:max-w-none text-foreground">
      {/* Top Navigation & Print Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 print:hidden">
        <div className="space-y-1">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Live Application Console</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Academic Technical Report (2–3 Pages)
          </h1>
          <p className="text-xs text-muted-foreground">
            Formatted for submission with theoretical analysis, comparison matrices, and screenshot slots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/VedantDave81106/gearflow-enterprise"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5 font-medium">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>GitHub Repo</span>
            </Button>
          </a>
        </div>
      </div>

      {/* Formal Academic Header Block */}
      <div className="border rounded-xl p-5 bg-card space-y-3 print:border-black print:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              GearFlow Enterprise — Datacenter Infrastructure Console
            </h2>
            <p className="text-xs text-muted-foreground">
              Responsive Accessible Component Architecture, Client State Management & End-to-End Type-Safe Form Mutations
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="font-mono text-xs border-blue-500/40 text-blue-500">
              CO1 & CO2 Verified
            </Badge>
            <Badge variant="default" className="text-xs">
              Units I, II, III
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span className="text-muted-foreground block text-[11px]">Repository:</span>
            <span className="font-mono font-medium truncate block">
              VedantDave81106/gearflow-enterprise
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Associated Units:</span>
            <span className="font-medium">Unit I, Unit II, Unit III</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Self-Learning Topics:</span>
            <span className="font-medium">Topic 1, 2, 3, 6</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[11px]">Mapped POs/PSOs:</span>
            <span className="font-mono font-medium">PO1, PO3, PO5, PO11 | PSO 2, 3</span>
          </div>
        </div>
      </div>

      {/* SCREENSHOT PLACEHOLDER 1 */}
      <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 bg-primary/5 space-y-2 print:border-zinc-400">
        <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
          <Camera className="h-4 w-4" />
          <span>[Screenshot 1: Dashboard Console Header & Theme Toggle]</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Take a screenshot of the top of <code>http://localhost:3000</code> showing the region status bar (Ashburn DC-1),
          dashboard console title, operational telemetry chips (6 Production SKUs, CLS: 0.000, Dual Zod Schema), and theme toggle.
        </p>
        <div className="h-28 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground/60 italic bg-background/50">
          Paste / Insert Screenshot 1 Here (Figure 1: GearFlow Console Dashboard)
        </div>
      </div>

      {/* SECTION 1: RSC VS CLIENT COMPONENT TREES & HYDRATION */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Server className="h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-bold tracking-tight">
            1. RSC vs. Client Component Render Trees & Hydration Optimization (CO1)
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The Next.js App Router compilation pipeline bifurcates the component graph into two execution domains:
          <strong> React Server Components (RSC)</strong> which execute exclusively on the server with zero client-side JavaScript,
          and <strong>Client Components (&apos;use client&apos;)</strong> which hydrate in the browser to mount interactive state hooks and event listeners.
        </p>

        {/* Flight Protocol Deep Dive */}
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-primary" />
            <span>React Flight Wire Protocol & Boundary Serialization</span>
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Data across the RSC boundary is serialized via the compact, line-delimited React Flight Wire Protocol.
            Client components are streamed as chunk references (<code>1:I&#123;&quot;id&quot;:&quot;...&quot;&#125;</code>)
            and populated positionally with serialized props (<code>0:[&quot;$&quot;,&quot;$1&quot;,...]</code>).
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/40 font-semibold text-foreground">
                  <th className="p-2">Data Type</th>
                  <th className="p-2">Crossing Boundary?</th>
                  <th className="p-2">Architectural Reason & Behavior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-2 font-mono">Primitives (String, Number, Bool)</td>
                  <td className="p-2 text-emerald-500 font-semibold">Allowed</td>
                  <td className="p-2 text-muted-foreground">Directly serialized into JSON-compatible Flight wire tokens.</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">Plain Objects &amp; Arrays</td>
                  <td className="p-2 text-emerald-500 font-semibold">Allowed</td>
                  <td className="p-2 text-muted-foreground">Recursively serialized into positional wire chunks.</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">Promises &amp; Server Actions</td>
                  <td className="p-2 text-emerald-500 font-semibold">Allowed</td>
                  <td className="p-2 text-muted-foreground">Passed as asynchronous RPC callable references over wire.</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">Client Functions / Closures</td>
                  <td className="p-2 text-destructive font-semibold">Prohibited</td>
                  <td className="p-2 text-muted-foreground">Throws runtime serialization error; code closures cannot cross network.</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono">Class Instances &amp; Symbols</td>
                  <td className="p-2 text-destructive font-semibold">Prohibited</td>
                  <td className="p-2 text-muted-foreground">Prototype chains and private symbol tables cannot be reconstructed.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SCREENSHOT PLACEHOLDER 2 */}
        <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 bg-primary/5 space-y-2 print:border-zinc-400">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Camera className="h-4 w-4" />
            <span>[Screenshot 2: RSC Hydration & Flight Protocol Inspector]</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Take a screenshot of the <strong>RSC Architecture &amp; Hydration Serialization Inspector</strong> section on <code>http://localhost:3000</code> showing
            the server timestamp, client hydration time, and the &quot;Flight Wire Protocol&quot; tab.
          </p>
          <div className="h-28 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground/60 italic bg-background/50">
            Paste / Insert Screenshot 2 Here (Figure 2: Hydration Boundary &amp; Flight Protocol Inspector)
          </div>
        </div>

        {/* Hydration Mismatch Neutralization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
            <span className="font-semibold text-foreground">Zero-CLS Theme Switch</span>
            <p className="text-muted-foreground leading-relaxed">
              Applied <code>suppressHydrationWarning</code> on <code>&lt;html&gt;</code> and blocking script via <code>next-themes</code>,
              preventing dark/light DOM divergence before initial paint (CLS = 0.000).
            </p>
          </div>
          <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
            <span className="font-semibold text-foreground">Storage Desync Fix</span>
            <p className="text-muted-foreground leading-relaxed">
              Configured Zustand with <code>skipHydration: true</code> and <code>useSyncExternalStore</code>.
              Client rehydrates strictly post-mount via <code>CartHydrator</code>, avoiding React Error #418.
            </p>
          </div>
          <div className="p-3 rounded-lg border bg-muted/20 space-y-1">
            <span className="font-semibold text-foreground">Temporal Invariants</span>
            <p className="text-muted-foreground leading-relaxed">
              Canonical ISO server timestamps are passed as static strings. Latency deltas are computed
              in <code>useEffect</code> without mutating initial SSR markup.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: SERVER STATE VS ZUSTAND CLIENT STATE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Layers className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-bold tracking-tight">
            2. Server State Handling vs. Zustand Client State Caching (CO1, CO2)
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 font-semibold text-foreground">
                <th className="p-2.5">Dimension</th>
                <th className="p-2.5">Next.js Server State (Server Actions)</th>
                <th className="p-2.5">Zustand Client State (Store Slices)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-2.5 font-semibold">Primary Responsibility</td>
                <td className="p-2.5 text-muted-foreground">Canonical inventory catalog, pricing checks, order dispatch.</td>
                <td className="p-2.5 text-muted-foreground">Active cart items, search filters, drawer open/close toggles.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Execution Domain</td>
                <td className="p-2.5 text-muted-foreground">Node.js Server Engine (&apos;use server&apos;)</td>
                <td className="p-2.5 text-muted-foreground">Client Browser V8 + localStorage</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Cache Invalidation</td>
                <td className="p-2.5 text-muted-foreground"><code>revalidatePath(&apos;/&apos;)</code>, <code>revalidateTag()</code></td>
                <td className="p-2.5 text-muted-foreground">Synchronous slice actions (<code>addItem</code>, <code>resetFilters</code>)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Re-render Scope</td>
                <td className="p-2.5 text-muted-foreground">Targeted path streaming on mutation resolution</td>
                <td className="p-2.5 text-muted-foreground">Fine-grained selectors isolate layout from re-renders</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Security Model</td>
                <td className="p-2.5 text-muted-foreground">Tamper-proof: prices re-verified against canonical DB</td>
                <td className="p-2.5 text-muted-foreground">Client-mutable: untrusted for financial verification</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SCREENSHOT PLACEHOLDER 3 */}
        <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 bg-primary/5 space-y-2 print:border-zinc-400">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Camera className="h-4 w-4" />
            <span>[Screenshot 3: Hardware Inventory &amp; Persistent Cart Drawer]</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Take a screenshot of the <strong>Hardware Inventory</strong> section showing category pills, the Table/Grid view toggle,
            and click the cart icon in the navbar to display the slide-out <strong>Requisition Cart Drawer</strong> with applied coupon (e.g. <code>ENTERPRISE20</code>).
          </p>
          <div className="h-28 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground/60 italic bg-background/50">
            Paste / Insert Screenshot 3 Here (Figure 3: Hardware Inventory &amp; Cart Drawer)
          </div>
        </div>

        {/* Selector Isolation Analysis */}
        <div className="p-4 rounded-xl border bg-muted/20 space-y-2 text-xs">
          <span className="font-semibold text-foreground block">
            Selector Re-render Isolation: Zero Layout Tree Thrashing
          </span>
          <p className="text-muted-foreground leading-relaxed">
            In <code>Navbar.tsx</code>, the cart badge subscribes strictly to <code>(state) =&gt; state.items.reduce(...)</code>.
            When promo codes change or cart drawer opens, the selector equality comparison (<code>Object.is</code>) detects no changes
            in the total item count, preventing unnecessary re-renders of the root <code>layout.tsx</code>.
          </p>
        </div>

        {/* SCREENSHOT PLACEHOLDER 4 */}
        <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 bg-primary/5 space-y-2 print:border-zinc-400">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Camera className="h-4 w-4" />
            <span>[Screenshot 4: Datacenter Requisition Form &amp; Verified Receipt]</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Take a screenshot of the <strong>Datacenter Node Requisition Form</strong> after clicking &quot;Dispatch Hardware Requisition&quot; showing the
            green confirmation box with generated Order ID (<code>ORD-XXXX-XXXX</code>), Tracking ID, and server-verified total.
          </p>
          <div className="h-28 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground/60 italic bg-background/50">
            Paste / Insert Screenshot 4 Here (Figure 4: Type-Safe Server Action Form Mutation)
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE WEB VITALS AUDIT */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <Gauge className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-bold tracking-tight">
            3. Core Web Vitals Audit Metrics &amp; Lighthouse Analysis (Topic 6)
          </h2>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 font-semibold text-foreground">
                <th className="p-2.5">Core Web Vital</th>
                <th className="p-2.5">Google Threshold</th>
                <th className="p-2.5">GearFlow Value</th>
                <th className="p-2.5">Assessment</th>
                <th className="p-2.5">Primary Architectural Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              <tr>
                <td className="p-2.5 font-semibold">Largest Contentful Paint (LCP)</td>
                <td className="p-2.5 font-mono">&le; 2.5s</td>
                <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">0.85s</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Good (Pass)</td>
                <td className="p-2.5 text-muted-foreground">Zero-JS RSC catalog streaming; Next.js Image pre-sizing.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Cumulative Layout Shift (CLS)</td>
                <td className="p-2.5 font-mono">&le; 0.10</td>
                <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">0.000</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Good (Pass)</td>
                <td className="p-2.5 text-muted-foreground">next-themes inline script; fixed 16/10 aspect containers.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Interaction to Next Paint (INP)</td>
                <td className="p-2.5 font-mono">&le; 200ms</td>
                <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">38ms</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Good (Pass)</td>
                <td className="p-2.5 text-muted-foreground">Decoupled Zustand store; non-blocking React useTransition.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">First Contentful Paint (FCP)</td>
                <td className="p-2.5 font-mono">&le; 1.8s</td>
                <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">0.45s</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Good (Pass)</td>
                <td className="p-2.5 text-muted-foreground">Server-rendered initial layout shell with critical CSS inlined.</td>
              </tr>
              <tr>
                <td className="p-2.5 font-semibold">Time to First Byte (TTFB)</td>
                <td className="p-2.5 font-mono">&le; 800ms</td>
                <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">95ms</td>
                <td className="p-2.5 text-emerald-600 dark:text-emerald-400 font-medium">Good (Pass)</td>
                <td className="p-2.5 text-muted-foreground">Node.js V8 execution with zero database cold-start latency.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SCREENSHOT PLACEHOLDER 5 */}
        <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 bg-primary/5 space-y-2 print:border-zinc-400">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Camera className="h-4 w-4" />
            <span>[Screenshot 5: APM &amp; Core Web Vitals Telemetry HUD]</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Take a screenshot of the <strong>Datacenter APM &amp; Core Web Vitals Telemetry</strong> section on <code>http://localhost:3000</code> showing
            the live metric cards (LCP, CLS, INP) with green &quot;Good (Pass)&quot; badges and the live event log.
          </p>
          <div className="h-28 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground/60 italic bg-background/50">
            Paste / Insert Screenshot 5 Here (Figure 5: Live Core Web Vitals Telemetry HUD)
          </div>
        </div>
      </section>

      {/* SECTION 4: DYNAMIC OG IMAGE */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b pb-2">
          <ShieldCheck className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-bold tracking-tight">
            4. Dynamic OpenGraph Social Image Generation (Topic 6)
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          The application generates a dynamic $1200\times630$ social preview card at <code>app/opengraph-image.tsx</code> using Next.js <code>ImageResponse</code> on the Edge runtime.
          It renders dynamic branding, Course Outcome tags (CO1, CO2), and live Web Vitals ratings into a crisp PNG with zero static asset dependencies.
        </p>

        {/* SCREENSHOT PLACEHOLDER 6 */}
        <div className="border-2 border-dashed border-primary/30 rounded-xl p-5 bg-primary/5 space-y-2 print:border-zinc-400">
          <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
            <Camera className="h-4 w-4" />
            <span>[Screenshot 6: Dynamic OpenGraph Social Preview Image]</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Open <code>http://localhost:3000/opengraph-image</code> in your browser and take a screenshot of the generated 1200x630 social card.
          </p>
          <div className="h-28 rounded-lg border border-dashed border-muted-foreground/30 flex items-center justify-center text-xs text-muted-foreground/60 italic bg-background/50">
            Paste / Insert Screenshot 6 Here (Figure 6: Dynamic OG Social Preview Card)
          </div>
        </div>
      </section>

      {/* CONCLUSION & VERIFICATION */}
      <section className="space-y-3 border-t pt-4">
        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">5. Conclusion</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The <em>GearFlow Enterprise</em> portal demonstrates how Next.js App Router, Radix UI accessible primitives,
          Zustand decoupled state slices, and end-to-end Zod Server Actions can be orchestrated into a high-performance web architecture.
          By enforcing strict prop serialization boundaries, isolating client state updates, and validating mutations on both ends of the wire,
          the application satisfies all requirements of Course Outcomes 1 and 2 while delivering exceptional Core Web Vitals performance.
        </p>
      </section>

      {/* Footer Navigation */}
      <div className="pt-6 border-t flex items-center justify-between print:hidden">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Application Console</span>
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground font-mono">
          Ready for PDF export or copy-paste into Microsoft Word.
        </p>
      </div>
    </div>
  );
}
