# 🥤 DrinKit — World's drinks, at your door in minutes

A premium, **3D-hero drinks-delivery web app** — duniya bhar ki drinks (alcohol + non-alcohol), Blinkit-style commerce (add-to-cart, location, phone-OTP login, order history), payments, order-to-email, aur live (simulated) rider tracking. Dark "liquid-neon" look — deliberately **not** a Blinkit clone.

> **Live:** <https://drinkit-app.vercel.app/>

## ✨ Features

- **3D animated hero** (Three.js / react-three-fiber) with floating bottles + particles.
- **Full catalog** — Whisky, Beer, Wine, Vodka, Rum, Tequila, Gin + Soft drinks, Juices, Energy, Coffee/Tea, Water, Mixers. Each product has image, price/MRP, volume, ABV, origin, rating.
- **Age gate (21+)** for alcohol only.
- **Cart + checkout** — quantity steppers, savings, delivery/handling fees, free-delivery threshold.
- **Phone-number OTP login** (Firebase, with demo fallback).
- **Location picker** — draggable map pin + geolocation + saved address book (Google Maps, with SVG fallback).
- **Payments** — Razorpay (UPI / Card / COD), with a demo payment sheet fallback.
- **Order → your email** (EmailJS), with console-log fallback.
- **Order history + reorder + live tracking** — rider marker moves store→home, ETA countdown, status timeline.
- **Works with ZERO keys** — every integration gracefully degrades to a fully-working demo mode.

## 🧱 Stack

React 18 · Vite 6 · TypeScript · Tailwind CSS 3 · React Router 6 · Zustand (persisted) · Framer Motion · Three.js (@react-three/fiber + drei) · Firebase Auth · Google Maps · Razorpay · EmailJS · lucide-react

## 🚀 Local dev

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. Sab kuch demo mode mein chalega (OTP `123456`, SVG map, demo payment). Real keys ke liye 👉 **[SETUP.md](SETUP.md)**.

```bash
npm run build     # type-check + production build → dist/
npm run preview   # serve the built app locally
```

## 🔑 Configuration

Copy `.env.example` → `.env` and fill whatever you have. **Every key is optional** — missing keys just keep that feature in demo mode. Full step-by-step (Firebase / Google Maps / Razorpay / EmailJS / Vercel / Docker) is in **[SETUP.md](SETUP.md)**.

## 📦 Deploy

- **Vercel** — auto-detected Vite build; add `VITE_*` in Project → Settings → Environment Variables and redeploy (Vite inlines them at build time). SPA routing via `vercel.json`.
- **Docker** — multi-stage build (`node:20-alpine` → `nginx:alpine` serving `dist/`):

  ```bash
  docker build -t drinkit-app .
  docker run -p 8080:80 drinkit-app
  ```

  Real keys → pass `--build-arg VITE_...=...` (see SETUP.md). CI via existing `Jenkinsfile` → DockerHub `imvishalbhargav/drinkit-app`.

## 🍾 CI/CD pipeline (Project 3)

DrinKit started life as a DevOps project: a full-stack CI/CD pipeline that automates a booze-delivery app — because your deployment should be faster than the delivery itself. 😄 It began as a plain Nginx static site and is now a **premium 3D React/Vite storefront** that the pipeline compiles and ships automatically.

**What's automated**

- ✅ **DrinKit app** — a 3D React/Vite frontend, compiled to an optimized static bundle and served via **Nginx** (multi-stage Docker build).
- ✅ **Git workflow** — proper branching strategy (main ≠ chaos).
- ✅ **Jenkins pipeline** — auto-triggered on every push (push code, sleep peacefully 😴).
- ✅ **Docker** — multi-stage image built automatically: `npm ci` → type-check + `vite build` → Nginx serves `dist/` (no "works on my machine" excuses).
- ✅ **Docker Hub registry** — image published for the world (or at least DockerHub).

**How it works**

```text
1️⃣  Git push            → triggers the Jenkins webhook
2️⃣  Jenkins clones repo → builds inside Docker (tsc type-check + vite build)
3️⃣  Docker builds image → multi-stage: node build ➜ nginx serve, tagged with a version
4️⃣  Auto-push           → image pushed to Docker Hub registry
5️⃣  Ready to deploy     → Vercel (frontend) or `docker run` on any server ✨

GitHub → Jenkins → Docker → Docker Hub → Production Ready
```

**Tech stack**

🔧 React · Vite · TypeScript · Tailwind · Three.js | GitHub · Jenkins · Docker · Docker Hub · Nginx · RHEL server

**Result:** zero manual work, full automation, maximum sleep. Every push = automatic build + deploy. No waiting, no "I forgot to push the image" moments.

- 📦 Docker Hub: <https://hub.docker.com/r/imvishalbhargav/drinkit-app>
- 💻 GitHub: <https://github.com/imvishalbhargav/drinkit-app>

## ⚠️ Honest limits

- Product images are representative **free stock** (Unsplash), not brand bottle shots.
- Rider tracking is a realistic **simulation**, not real driver GPS.
- Payments use a client-side Razorpay Key Id (no server verify) — fine for personal/demo use.
- Selling alcohol for real requires a **licensed business + age/ID verification + local law compliance**. Use Razorpay **Test** keys until your business is ready.

## 📁 Structure

```
src/
  data/catalog.ts        # categories + products
  store/                 # zustand: cart, auth, addresses, orders, ui
  lib/                   # config, firebase, razorpay, email, geo, format
  components/            # layout, common, product, three, location, checkout, tracking
  pages/                 # Home, Category, ProductDetail, Cart, Checkout, Orders, OrderTracking, Account
```
