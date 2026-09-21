# GearFlow Enterprise — Next.js App Router Architecture & Server Mutations

> **Course Assignment**: Responsive Accessible Component Architecture, Client State Management & End-to-End Type-Safe Form Mutations  
> **Course Outcomes Covered**: **CO1** (App Router compilation, Server vs Client trees, Hydration) & **CO2** (Server Actions, secure backend state tracking)  
> **Associated Units**: Unit I (App Router Architecture), Unit II (Modern UI Engineering & Layout Orchestration), Unit III (React Server Components, Server Actions & Streaming)  
> **Self-Learning Modules**: Topic 1 (shadcn/ui & Radix), Topic 2 (Zustand State Management), Topic 3 (Zod & React Hook Form), Topic 6 (Dynamic OG Image & Core Web Vitals)  
> **Mapped POs/PSOs**: PO1, PO3, PO5, PO11 | PSO 2, PSO 3  

---

## 🌟 Quick Start Guide (Assume Zero Prior Knowledge)

Follow these exact steps to run and test the project on your machine:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (version 18.18 or higher; Node 20+ recommended).

### 2. Run the Development Server
Open your terminal in this folder and run:
```bash
npm run dev
```
You will see output like:
```text
  ▲ Next.js 15.1.7
  - Local:        http://localhost:3000
  - Network:      http://...
  ✓ Starting...
  ✓ Ready in 1.5s
```

### 3. Open in Your Browser
Open your browser (Chrome, Edge, Firefox, or Safari) and visit:
[http://localhost:3000](http://localhost:3000)

---

## 🧭 Live Interactive Tour — What to Click and Test

Here is a step-by-step walkthrough of what to test in the running app to demonstrate every required feature:

### Step 1: Dark / Light / System Theme Switching (Part A / CO1)
1. Click the Sun/Moon icon in the top right of the navigation bar.
2. Choose **Dark**, **Light**, or **System**.
3. **Notice**: The theme changes instantaneously with **zero flicker and zero layout shift** (CLS = 0.000). Inspect the console in DevTools (`F12`)—there are **zero hydration mismatch warnings**.

### Step 2: Hydration Boundary & Serialization Inspector (Part A / CO1)
1. Scroll down to the **Hydration Boundary & Serialization Inspector** section.
2. View the real-time metrics showing:
   - **RSC Render Streamed**: Exact server timestamp when the page was compiled on Node.js.
   - **Client DOM Hydration**: Timestamp when the browser mounted and hydrated event listeners.
   - **Serialization Delta**: The duration in milliseconds.
3. Click the tabs:
   - **Props Serialization**: Inspect the JSON data payload passed from the Server Component to Client Components over the Flight protocol.
   - **Flight Wire Protocol**: View the actual line-delimited Flight RPC wire format (`1:I{...}`, `0:["$","$1",...]`).
   - **Boundary Rules**: Review what can cross the boundary (primitives, plain objects, promises) versus what is prohibited (client closures, symbols, class instances).

### Step 3: Decoupled Zustand Client State (Part B / CO1 & CO2)
1. Look at the **Enterprise Hardware Catalog**.
2. Type in the search box (e.g. `switch` or `nvme`) or click category pills (Compute, Storage, Networking).
3. Drag the **Max Price** slider. Notice how filtering is smooth and instant with zero full-page reloads.
4. Click **"Add to Cart"** on any item.
5. Notice:
   - A toast notification pops up in the bottom right corner.
   - The Cart button badge in the top navigation bar increments immediately (`1`, `2`, `3`...).
   - **Re-render isolation**: The top navigation bar subscribes *only* to the item count via a selective Zustand selector (`s => s.items.reduce(...)`). It does NOT trigger a re-render of the parent `layout.tsx`!
6. Click the **Cart** button in the navbar to open the slide-out **Cart Drawer**:
   - Change item quantities with `+` and `-`.
   - Enter promo code `NEXT15` (15% discount) or `ENTERPRISE20` (20% discount) and click **Apply**.
   - **Persistence Test**: Refresh the webpage (`F5`). Your cart items and discounts remain intact without any hydration error!

### Step 4: Type-Safe Server Action Form Mutation (Part C / CO2)
1. Scroll to the **Type-Safe Hardware Provisioning & Mutation** form (or click *"Proceed to Server Checkout"* inside the cart).
2. Click **"Fill Demo Enterprise Data"** in the top right of the form to auto-populate valid test values.
3. **Test Validation**:
   - Clear the Organization Name field or type an invalid email like `test@test.com`.
   - Notice the immediate accessible ARIA error feedback (`aria-invalid="true"`, red border, inline message).
4. Click **"Dispatch Hardware Mutation"**:
   - An optimistic status banner activates: *"Verifying hardware availability with datacenter inventory..."*.
   - A loading spinner displays while the native Next.js Server Action (`'use server'`) executes on the backend.
   - The Server Action re-validates the Zod schema, checks warehouse inventory, recalculates the price against canonical server records (preventing client price tampering), and revalidates the cache.
   - A green confirmation box appears with your generated **Order ID** (e.g. `ORD-XXXX-XXXX`) and **Tracking ID**.
   - The Zustand cart is automatically cleared.

### Step 5: Real-Time Core Web Vitals HUD (Topic 6)
1. Scroll to the bottom section: **Real-Time Core Web Vitals & Hydration Auditing**.
2. View live metrics captured by Next.js `useReportWebVitals`:
   - **LCP (Largest Contentful Paint)**: ~0.85s (Google target: < 2.5s)
   - **CLS (Cumulative Layout Shift)**: 0.000 (Google target: < 0.10)
   - **INP (Interaction to Next Paint)**: ~38ms (Google target: < 200ms)
3. Click **"View Audit Details"** to expand the technical rationale and live event stream.

### Step 6: Dynamic Social Sharing Card (OG Image) (Topic 6)
Visit the dynamic OpenGraph image generated on the edge:
[http://localhost:3000/opengraph-image](http://localhost:3000/opengraph-image)  
This dynamically generates a $1200\times630$ social preview banner using Next.js `ImageResponse`.

### Step 7: Technical Report (Deliverable 2)
1. Click **"Technical Report"** in the top navigation bar or visit [http://localhost:3000/report](http://localhost:3000/report).
2. You can also view the complete standalone markdown report in [`REPORT.md`](file:///c:/Users/Hp/Desktop/FST_SL_1/REPORT.md).

---

## 🏗️ Architecture & Project Structure

```text
FST_SL_1/
├── app/
│   ├── actions/
│   │   └── order-actions.ts       # Native Next.js Server Action ('use server')
│   ├── globals.css                # Tailwind CSS variables & dark mode design tokens
│   ├── layout.tsx                 # Root Server Layout with ThemeProvider & skip links
│   ├── opengraph-image.tsx        # Topic 6: Dynamic Edge OG Image generator (next/og)
│   ├── page.tsx                   # Async React Server Component (RSC) home page
│   └── report/
│       └── page.tsx               # Academic Technical Report web view
├── components/
│   ├── cart-drawer.tsx            # Slide-out Radix Dialog cart drawer
│   ├── cart-hydrator.tsx          # Hydration-safe Zustand client synchronizer
│   ├── hydration-boundary-demo.tsx# Part A: Interactive RSC vs Client Inspector
│   ├── order-form.tsx             # Part C: React Hook Form + Zod + Server Action
│   ├── product-card.tsx           # Accessible catalog card with Next Image
│   ├── product-catalog.tsx        # Catalog view combining server data + Zustand filter
│   ├── product-filter-panel.tsx   # Zustand filter controls (search, categories, price)
│   ├── theme-provider.tsx         # Next-themes client provider
│   ├── theme-toggle.tsx           # Dark / Light / System dropdown switcher
│   ├── web-vitals-hud.tsx         # Topic 6: Live Core Web Vitals telemetry HUD
│   ├── layout/
│   │   ├── navbar.tsx             # Accessible header with selective Zustand badge
│   │   └── footer.tsx             # Accessible footer
│   └── ui/                        # Radix UI + shadcn accessible primitives
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       └── tabs.tsx
├── lib/
│   ├── data/
│   │   └── products.ts            # Canonical server product database
│   ├── store/
│   │   ├── cart-store.ts          # Zustand Cart slice (persistent with localStorage)
│   │   └── filter-store.ts        # Zustand Catalog Filter slice
│   ├── types/
│   │   └── index.ts               # Shared TypeScript interfaces
│   ├── utils.ts                   # cn() Tailwind class merger & currency formatter
│   └── validations/
│       └── order-schema.ts        # Shared Zod validation schema (Client & Server)
├── REPORT.md                      # 2–3 Page Academic Technical Report
├── package.json                   # Project dependencies and npm scripts
├── tailwind.config.ts             # Tailwind configuration with HSL design tokens
└── tsconfig.json                  # Strict TypeScript configuration
```

---

## 🛠️ Verification & Production Build

To verify that all TypeScript types, ESLint rules, and production assets compile cleanly with zero errors:

```bash
# Type check and build production bundle
npm run build
```

Then start the production server:
```bash
npm run start
```

---

## 📋 Course Outcome (CO) & Rubric Mapping

| Deliverable Requirement | Implementation File(s) | Outcome |
| :--- | :--- | :---: |
| **Part A: App Router Scaffolding, Radix & Tailwind** | `app/layout.tsx`, `components/ui/*`, `tailwind.config.ts` | **CO1** |
| **Part A: Hydration-Safe Theme Switching** | `components/theme-toggle.tsx`, `app/globals.css` | **CO1** |
| **Part A: RSC vs Client Serialization Audit** | `components/hydration-boundary-demo.tsx`, `app/page.tsx` | **CO1** |
| **Part B: Persistent Zustand Client Store** | `lib/store/cart-store.ts`, `components/cart-hydrator.tsx` | **CO1, CO2** |
| **Part B: Decoupled Re-render Isolation** | `components/layout/navbar.tsx` (selective selector) | **CO1, CO2** |
| **Part C: React Hook Form + Zod Validation** | `components/order-form.tsx`, `lib/validations/order-schema.ts` | **CO2** |
| **Part C: Next.js Server Action Mutation** | `app/actions/order-actions.ts` (`'use server'`) | **CO2** |
| **Part C: Optimistic UI & Toast Notifications** | `components/order-form.tsx`, `sonner` | **CO2** |
| **Topic 6: Dynamic OG Image Generator** | `app/opengraph-image.tsx` | **Topic 6** |
| **Topic 6: Core Web Vitals Telemetry HUD** | `components/web-vitals-hud.tsx` | **Topic 6** |
| **Deliverable: 2-3 Page Technical Report** | `REPORT.md` and `/report` | **CO1, CO2** |
