# PROJECT_CONTEXT.md
> AI continuation file — Sommersemester 2026

## Student
- **Name:** Firas Bouzidi
- **Matrikelnummer:** 594251
- **Kurs:** Produktionswirtschaft & Logistik · HTW Berlin · SS 2026
- **Titel:** Interaktive Analyse logistischer Entscheidungsverfahren

---

## Tech Stack
| Layer | Tool |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Build | Vite |
| Styling | TailwindCSS v3 (custom `brand`, `accent`, `surface` palette) |
| Charts | Chart.js (via direct instantiation) |
| State | Pinia |
| Routing | Vue Router 4 |
| Icons | Inline SVG |
| Utils | @vueuse/core |

---

## Folder Structure
```
src/
  components/
    layout/   Navbar.vue  Footer.vue
    home/     HeroSection.vue  ZielkonfliktSection.vue  ModuleCards.vue
    abcxyz/   ABCIntro.vue  ProductTable.vue  ParetoChart.vue
  views/      HomeView.vue  ABCXYZView.vue
  stores/     abcxyz.js
  router/     index.js
  style.css   (Tailwind + custom utilities)
  App.vue     main.js
```

---

## Design System
- **Background:** `#0f172a` (surface-900)
- **Cards:** glassmorphism — `bg-white/5 backdrop-blur-md border border-white/10`
- **Accent:** `#0ea5e9` sky-500 (class `accent-*`)
- **Brand blue:** `#1a3a6b` (class `brand-500`)
- **Animations:** CSS keyframes (`float`, `slideUp`, `fadeIn`, `pulse-slow`) + IntersectionObserver scroll reveals
- **Typography:** Inter (Google Fonts)

---

## Completed in Step 1
- [x] Project scaffold (Vite + Vue 3)
- [x] TailwindCSS with custom design tokens
- [x] Navbar (transparent → frosted glass on scroll, mobile hamburger)
- [x] Footer
- [x] HomeView with animated hero, KPI counters, Zielkonflikt section, Module cards
- [x] ABCXYZView with tabs (Analyse / Theorie)
- [x] ABCIntro — class explanations (A/B/C cards)
- [x] ProductTable — 10 realistic products, editable price + demand, live ABC badge
- [x] ParetoChart — Chart.js combo bar+line, auto-updates with Pinia store
- [x] Pinia store `abcxyz.js` — computed ABC classification + reactive updates

---

## ABC Classification Logic (abcxyz.js)
```
Rang by descending totalValue = price × demand
cumPct ≤ 70% → A  |  ≤ 90% → B  |  > 90% → C
```

---

## Routes
| Path | View |
|---|---|
| `/` | HomeView |
| `/abc-xyz` | ABCXYZView |
| `/stueckliste` | *(Step 2 — not built)* |
| `/make-or-buy` | *(Step 3 — not built)* |

---

## Next Steps (Step 2)
1. **Complete ABC/XYZ module**
   - Add XYZ classification (CV = σ/μ of demand)
   - Combined ABC×XYZ matrix view (3×3 grid with strategy recommendations)
   - Export to CSV/PDF
   - Summary statistics panel
2. **Stücklistenanalyse module**
   - Multi-level BOM tree input
   - Total cost explosion
   - Gozinto chart visualization
3. **Make-or-Buy module**
   - Scoring matrix (cost, quality, strategy, capacity)
   - Break-even chart (fixed vs variable cost comparison)

---

## Run
```bash
cd logistics-app
npm run dev    # http://localhost:5173
npm run build  # production build
```
