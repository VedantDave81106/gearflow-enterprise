"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle2, Server, Layers, ShieldCheck, Gauge, FileText } from "lucide-react";
import Link from "next/link";

interface AcademicRubricModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AcademicRubricModal({ open, onOpenChange }: AcademicRubricModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-y-auto sm:rounded-xl">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Course Outcome & Academic Rubric Mapping
              </DialogTitle>
              <DialogDescription className="text-xs">
                Web Development Engineering Assignment Specification & Verification Matrix
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 py-2 text-xs">
          {/* Outcomes Matrix */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>Target Course Outcomes (COs)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg border bg-muted/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary font-mono">CO1</span>
                  <Badge variant="success">Verified</Badge>
                </div>
                <p className="font-semibold text-foreground">
                  Next.js App Router, Component Trees & Hydration
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Demonstrated via server-streamed async RSC in <code>app/page.tsx</code>,
                  interactive Flight RPC serialization inspector in <code>components/hydration-boundary-demo.tsx</code>,
                  and zero-CLS theme switching via <code>next-themes</code>.
                </p>
              </div>

              <div className="p-3.5 rounded-lg border bg-muted/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">CO2</span>
                  <Badge variant="success">Verified</Badge>
                </div>
                <p className="font-semibold text-foreground">
                  Full-Stack Server Actions & State Tracking
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Demonstrated via native Server Action <code>submitOrderMutation</code> in <code>app/actions/order-actions.ts</code>,
                  shared Zod schema validation, backend inventory check, and server price recalculation.
                </p>
              </div>
            </div>
          </div>

          {/* Unit Coverage */}
          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-foreground text-sm">Associated Syllabus Units</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="p-2.5 rounded-md border bg-background/50">
                <div className="font-semibold text-foreground">Unit I</div>
                <div className="text-[11px] text-muted-foreground">
                  App Router Architecture, root layout orchestration, routing conventions.
                </div>
              </div>
              <div className="p-2.5 rounded-md border bg-background/50">
                <div className="font-semibold text-foreground">Unit II</div>
                <div className="text-[11px] text-muted-foreground">
                  Modern UI Engineering, Radix primitives, accessible forms, responsive layout.
                </div>
              </div>
              <div className="p-2.5 rounded-md border bg-background/50">
                <div className="font-semibold text-foreground">Unit III</div>
                <div className="text-[11px] text-muted-foreground">
                  React Server Components (RSC), Flight protocol, Server Actions & streaming.
                </div>
              </div>
            </div>
          </div>

          {/* Self-Learning Modules */}
          <div className="space-y-2 pt-2 border-t">
            <h4 className="font-semibold text-foreground text-sm">Self-Learning Modules Implemented</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 p-2 rounded border bg-muted/10">
                <Layers className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                <span>Topic 1: shadcn/ui & Radix UI Primitives</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded border bg-muted/10">
                <Server className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                <span>Topic 2: Zustand Persistent Client Store</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded border bg-muted/10">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Topic 3: Zod & React Hook Form Validation</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded border bg-muted/10">
                <Gauge className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Topic 6: Dynamic OG Image & Core Web Vitals</span>
              </div>
            </div>
          </div>

          {/* Program Outcomes */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border text-[11px]">
            <div>
              <span className="font-semibold block text-foreground">Mapped Program Outcomes:</span>
              <span className="text-muted-foreground font-mono">PO1, PO3, PO5, PO11 | PSO 2, PSO 3</span>
            </div>
            <Link href="/report" onClick={() => onOpenChange(false)}>
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Open Technical Report</span>
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
