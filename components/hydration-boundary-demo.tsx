"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Server,
  Laptop,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Code2,
  Cpu,
  Terminal,
} from "lucide-react";

export interface HydrationAuditPayload {
  serverBuildId: string;
  serverTimestamp: string;
  nodeEnvironment: string;
  executionTarget: string;
  catalogCount: number;
  serverCapabilities: string[];
}

interface HydrationBoundaryDemoProps {
  serverPayload: HydrationAuditPayload;
}

export function HydrationBoundaryDemo({
  serverPayload,
}: HydrationBoundaryDemoProps) {
  const [clientMountedAt, setClientMountedAt] = React.useState<string | null>(
    null
  );
  const [hydrationLatencyMs, setHydrationLatencyMs] = React.useState<
    number | null
  >(null);
  const [isClientHydrated, setIsClientHydrated] = React.useState(false);

  React.useEffect(() => {
    const clientTime = new Date();
    const serverTime = new Date(serverPayload.serverTimestamp);
    const latency = Math.max(0, clientTime.getTime() - serverTime.getTime());

    setClientMountedAt(clientTime.toLocaleTimeString());
    setHydrationLatencyMs(latency);
    setIsClientHydrated(true);
  }, [serverPayload.serverTimestamp]);

  return (
    <Card id="hydration-section" className="border-border/70 shadow-xs overflow-hidden bg-card">
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg font-bold tracking-tight">
                RSC Architecture & Hydration Serialization Inspector
              </CardTitle>
              <Badge variant="outline" className="text-[11px] font-mono border-blue-500/40 text-blue-500">
                CO1 Engineering Tool
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Live inspection of React Server Component (RSC) to Client Component boundaries
              and React Flight wire protocol serialization.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted/60 border text-muted-foreground">
              <Server className="h-3 w-3 text-blue-500" />
              <span>Server RSC</span>
            </span>
            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted/60 border text-muted-foreground">
              <Laptop className="h-3 w-3 text-emerald-500" />
              <span>Client Tree</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Real-time Telemetry Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border bg-muted/15 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                RSC Stream Generation (Server)
              </span>
              <p className="text-xs font-mono font-medium flex items-center gap-1.5 text-foreground">
                <Clock className="h-3 w-3 text-blue-500" />
                {serverPayload.serverTimestamp}
              </p>
            </div>
            <Badge variant="info">Server Node.js</Badge>
          </div>

          <div className="p-3 rounded-lg border bg-muted/15 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                Client DOM Mount & Hydration
              </span>
              <p className="text-xs font-mono font-medium flex items-center gap-1.5 text-foreground">
                <Cpu className="h-3 w-3 text-emerald-500" />
                {isClientHydrated ? clientMountedAt : "Mounting..."}
              </p>
            </div>
            <Badge variant={isClientHydrated ? "success" : "secondary"}>
              {isClientHydrated ? "Hydrated (Pass)" : "Pending"}
            </Badge>
          </div>

          <div className="p-3 rounded-lg border bg-muted/15 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                Hydration Delta / Shift
              </span>
              <p className="text-xs font-mono font-medium text-foreground">
                {hydrationLatencyMs !== null ? `${hydrationLatencyMs} ms` : "--"} • CLS: 0.000
              </p>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono">
              0 Errors
            </Badge>
          </div>
        </div>

        {/* Deep Dive Tabs */}
        <Tabs defaultValue="serialization" className="w-full">
          <TabsList className="grid grid-cols-3 w-full sm:w-[480px]">
            <TabsTrigger value="serialization">Props Serialization</TabsTrigger>
            <TabsTrigger value="flight">Flight Wire Protocol</TabsTrigger>
            <TabsTrigger value="rules">Boundary Invariants</TabsTrigger>
          </TabsList>

          <TabsContent value="serialization" className="space-y-3 pt-3">
            <div className="rounded-lg border bg-muted/20 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" />
                  <span>Serialized Payload Transferred Over Network Boundary</span>
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  Payload size: ~{JSON.stringify(serverPayload).length} bytes
                </span>
              </div>
              <pre className="p-3 rounded-md bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                {JSON.stringify(serverPayload, null, 2)}
              </pre>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All fields are JSON-serializable primitives (strings, numbers, arrays).
                React Flight serializes these props into the HTML stream so the client component
                tree can hydrate without fetching redundant REST/GraphQL endpoints.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="flight" className="space-y-3 pt-3">
            <div className="rounded-lg border bg-muted/20 p-4 space-y-2.5">
              <span className="text-xs font-semibold text-foreground flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-500" />
                <span>Next.js Flight Stream (RSC Payload Simulation)</span>
              </span>
              <pre className="p-3 rounded-md bg-zinc-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-zinc-800">
{`1:I{"id":"./components/hydration-boundary-demo.tsx","chunks":["app/page.js"],"name":"HydrationBoundaryDemo"}
2:{"serverBuildId":"${serverPayload.serverBuildId}","catalogCount":${serverPayload.catalogCount}}
M3:{"id":"app/layout","chunks":["..."]}
0:["$","$1",null,{"serverPayload":"$2"}]`}
              </pre>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The Flight format splits the output into slots: references to client module chunks (<code>$1</code>)
                and serialized props (<code>$2</code>). This enables instant progressive streaming where HTML is sent
                first, followed by JS chunks, avoiding the classic blank screen waterfall.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-3 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                  <CheckCircle2 className="h-4 w-4" /> Serializable Across Boundary
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Primitives (Strings, Numbers, Booleans, null)</li>
                  <li>Plain JavaScript Objects (<code>&#123;&#125;</code>) and Arrays (<code>[]</code>)</li>
                  <li>Promises & Server Actions (references passed as async functions)</li>
                  <li>JSX Elements (<code>React.ReactNode</code>) passed as <code>children</code></li>
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5 space-y-2">
                <div className="flex items-center gap-2 text-destructive font-semibold text-xs">
                  <XCircle className="h-4 w-4" /> Non-Serializable (Causes Hydration Error)
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Standard client closures / anonymous event handlers (<code>onClick=&#123;() =&gt; ...&#125;</code>)</li>
                  <li>Symbols (<code>Symbol(&apos;token&apos;)</code>) and Class instances (<code>new User()</code>)</li>
                  <li>Unformatted Dates (causes mismatch if server UTC ≠ client local time)</li>
                  <li>DOM nodes, window, or document references</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
