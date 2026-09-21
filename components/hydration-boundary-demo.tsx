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
    <Card className="border-border/60 shadow-lg overflow-hidden backdrop-blur-sm bg-card/80">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <CardTitle className="text-xl tracking-tight">
                Hydration Boundary & Serialization Inspector
              </CardTitle>
            </div>
            <CardDescription className="text-xs sm:text-sm">
              CO1 Demonstration: React Server Component (RSC) to Client Component
              hydration boundary audit & Flight protocol serialization.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/40 text-blue-500 gap-1">
              <Server className="h-3 w-3" /> RSC Parent
            </Badge>
            <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-500 gap-1">
              <Laptop className="h-3 w-3" /> Client Boundary (&apos;use client&apos;)
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Real-time Hydration Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-lg border bg-background/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                RSC Render Streamed
              </span>
              <p className="text-sm font-mono font-medium flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                {serverPayload.serverTimestamp}
              </p>
            </div>
            <Badge variant="info">Server-Side</Badge>
          </div>

          <div className="p-3.5 rounded-lg border bg-background/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Client DOM Hydration
              </span>
              <p className="text-sm font-mono font-medium flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                {isClientHydrated ? clientMountedAt : "Hydrating..."}
              </p>
            </div>
            <Badge variant={isClientHydrated ? "success" : "secondary"}>
              {isClientHydrated ? "Hydrated" : "Pending"}
            </Badge>
          </div>

          <div className="p-3.5 rounded-lg border bg-background/60 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                Delta / Network Serialization
              </span>
              <p className="text-sm font-mono font-medium">
                {hydrationLatencyMs !== null ? `${hydrationLatencyMs} ms` : "--"}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              0 CLS Verified
            </Badge>
          </div>
        </div>

        {/* Deep Dive Tabs */}
        <Tabs defaultValue="serialization" className="w-full">
          <TabsList className="grid grid-cols-3 w-full sm:w-[480px]">
            <TabsTrigger value="serialization">Props Serialization</TabsTrigger>
            <TabsTrigger value="flight">Flight Wire Protocol</TabsTrigger>
            <TabsTrigger value="rules">Boundary Rules</TabsTrigger>
          </TabsList>

          <TabsContent value="serialization" className="space-y-4 pt-4">
            <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-primary" /> Serialized Props Passed Over RSC Boundary
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Payload size: ~{JSON.stringify(serverPayload).length} bytes
                </span>
              </div>
              <pre className="p-3 rounded-md bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                {JSON.stringify(serverPayload, null, 2)}
              </pre>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Notice: All fields are JSON-serializable primitives (strings, numbers, arrays).
                React Flight serializes these props into the HTML stream so the client component
                tree can hydrate without fetching redundant REST/GraphQL endpoints.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="flight" className="space-y-4 pt-4">
            <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-500" /> Next.js Flight Stream (RSC Payload Simulation)
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

          <TabsContent value="rules" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
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
                <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                  <XCircle className="h-4 w-4" /> Non-Serializable (Causes Hydration Error)
                </div>
                <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                  <li>Standard client closures / anonymous event handlers (<code>onClick=&#123;() =&gt; ...&#125;</code>)</li>
                  <li>Symbols (`Symbol(&apos;token&apos;)`) and Class instances (`new User()`)</li>
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
