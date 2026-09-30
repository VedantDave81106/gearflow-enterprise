import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart-drawer";
import { CartHydrator } from "@/components/cart-hydrator";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "NextGadgets | Responsive Architecture & Server Action Form Mutations",
  description:
    "Accessible Next.js 15 App Router application with React Server Components, Zustand persistent client store, and type-safe Server Actions with Zod validation.",
  keywords: [
    "Next.js App Router",
    "React Server Components",
    "Hydration Boundary",
    "Zustand State Management",
    "Server Actions",
    "Zod Validation",
    "Radix UI",
    "Core Web Vitals",
  ],
  authors: [{ name: "Student Web Development Team" }],
  openGraph: {
    title: "NextGadgets | Responsive Accessible Component Architecture",
    description:
      "Next.js App Router, Radix Primitives, Zustand Persistent Store, and Type-Safe Server Actions.",
    type: "website",
    siteName: "NextGadgets",
  },
  twitter: {
    card: "summary_large_image",
    title: "NextGadgets | Next.js App Router Architecture",
    description: "Type-safe form mutations, persistent Zustand client store, and zero CLS hydration.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Safe Zustand rehydration trigger for localStorage */}
          <CartHydrator />

          {/* Accessible Global Header */}
          <Navbar />

          {/* Main Application Shell */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Slide-out Persistent Cart Drawer */}
          <CartDrawer />

          {/* Global Accessible Sonner Toast Notifications */}
          <Toaster position="bottom-right" richColors />

          {/* Application Footer */}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
