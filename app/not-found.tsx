import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ServerCrash } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="p-4 rounded-2xl bg-muted/40 border">
        <ServerCrash className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">404 - Node Not Found</h2>
        <p className="text-xs text-muted-foreground max-w-sm">
          The requested infrastructure route or SKU does not exist in the active cluster registry.
        </p>
      </div>
      <Link href="/">
        <Button size="sm" variant="outline" className="gap-2 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Console</span>
        </Button>
      </Link>
    </div>
  );
}
