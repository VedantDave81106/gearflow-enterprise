import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NextGadgets - Responsive Accessible Component Architecture";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          backgroundColor: "#090d16",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "#f8fafc",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              NG
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", letterSpacing: "-0.5px" }}>
              NextGadgets <span style={{ color: "#60a5fa" }}>Store</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "#93c5fd",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              CO1: App Router & Hydration
            </div>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "9999px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#6ee7b7",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              CO2: Server Actions & Zod
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "800",
              lineHeight: "1.15",
              letterSpacing: "-1.5px",
              color: "#ffffff",
              maxWidth: "1000px",
            }}
          >
            Responsive Accessible Component Architecture & Server Actions
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              maxWidth: "850px",
              lineHeight: "1.4",
            }}
          >
            Decoupled Zustand Client State • Radix Accessible Primitives • Shared Zod Validation Schema • Zero Layout Shift Hydration
          </div>
        </div>

        {/* Footer Pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1e293b",
            paddingTop: "30px",
          }}
        >
          <div style={{ display: "flex", gap: "24px", fontSize: "16px", color: "#64748b" }}>
            <span>Next.js 15 App Router</span>
            <span>•</span>
            <span>Radix UI + shadcn</span>
            <span>•</span>
            <span>Zustand Slice Store</span>
            <span>•</span>
            <span>Flight Protocol Audited</span>
          </div>

          <div
            style={{
              fontSize: "15px",
              color: "#38bdf8",
              fontWeight: "600",
            }}
          >
            Core Web Vitals: LCP &lt; 1.2s | CLS 0.00 | INP &lt; 50ms
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
