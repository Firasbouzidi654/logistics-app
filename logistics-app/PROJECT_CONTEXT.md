# PROJECT_CONTEXT.md
> AI continuation file — Sommersemester 2026

## Student
- **Name:** Firas Bouzidi · Matrikelnummer 594251
- **Studiengang:** Wirtschaftsinformatik (B.Sc.) · HTW Berlin · SS 2026
- **Titel:** Interaktive Analyse logistischer Entscheidungsverfahren

---

## Tech Stack
| Layer | Tool |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Build | Vite |
| Styling | TailwindCSS v3 (custom `brand`, `accent`, `surface` palette) |
| Charts | Chart.js (direct instantiation, no wrapper) |
| State | Pinia |
| Routing | Vue Router 4 |
| Icons | Inline SVG |
| Utils | @vueuse/core (useIntersectionObserver) |

---

## Folder Structure
```
src/
  components/
    layout/       Navbar.vue  Footer.vue
    home/         HeroSection.vue  ProfileSection.vue
                  ZielkonfliktSection.vue  ModuleCards.vue
    abcxyz/       ABCIntro.vue  ProductTable.vue  ParetoChart.vue
    stueckliste/  BOMKPICards.vue  BOMTree.vue  BOMTable.vue  BOMCostChart.vue
  views/          HomeView.vue  ABCXYZView.vue  StuecklisteView.vue
  stores/         abcxyz.js  stueckliste.js
  router/         index.js
  assets/         firas-profile.jpeg
  style.css       App.vue  main.js
```

---

## Design System
- **Background:** `#0f172a` (surface-900)
- **Glass cards:** `bg-white/5 backdrop-blur-md border border-white/10`
- **Accent:** `#0ea5e9` sky-500
- **Animations:** CSS keyframes + IntersectionObserver scroll reveals
- **Typography:** Inter (Google Fonts)
- **Module color coding:** ABC=accent-blue · BOM=violet-purple · MoB=rose-pink

---

## Completed — Step 1 (Homepage + ABC/XYZ)
- [x] Scaffold, TailwindCSS design tokens, router, Pinia
- [x] Navbar (scroll-aware frosted glass, mobile hamburger)
- [x] Hero + KPI animated counters + Zielkonflikt + ModuleCards
- [x] ProfileSection — photo, bio (Wirtschaftsinformatik B.Sc.), DRÄXLMAIER Werkstudent badge
- [x] ABCXYZView — tabs: Theorie / Analyse & Tabelle
- [x] ProductTable (10 items, editable, live ABC badge + cum. bar)
- [x] ParetoChart (Chart.js combo bar+line, reactive)
- [x] Store `abcxyz.js` — cumPct ≤ 70% → A | ≤ 90% → B | > 90% → C

## Completed — Step 2 (Stücklistenanalyse)
- [x] Store `stueckliste.js` — 14 BOM items, groups, computed KPIs, stockSummary, costByGroup
- [x] `BOMKPICards.vue` — Gesamtkosten (animated), teuerste Komponente, Ø Lieferzeit, Lieferanten + stock split
- [x] `BOMTree.vue` — 2-level expandable tree (product → assembly → component), group color coding
- [x] `BOMTable.vue` — editable qty/price/leadTime, group filter, live footer sum, stock badges
- [x] `BOMCostChart.vue` — doughnut (cost by group) + horizontal bar (top 8 components), both reactive
- [x] `StuecklisteView.vue` — 3 tabs: Analyse & Tabelle / Produktstruktur / Kostenanalyse
- [x] Route `/stueckliste` active, Navbar + ModuleCards unlocked

---

## Routes
| Path | View | Status |
|---|---|---|
| `/` | HomeView | ✅ Done |
| `/abc-xyz` | ABCXYZView | ✅ Done |
| `/stueckliste` | StuecklisteView | ✅ Done |
| `/make-or-buy` | — | 🔜 Step 3 |

---

## BOM Data (stueckliste.js)
- Product: **Autonomer Lagerroboter AR-200** (FG-001)
- 4 assemblies: Antriebseinheit · Sensorik & Steuerung · Energieversorgung · Gehäuse & Mechanik
- 14 components, total cost **3.310 €**, 14 unique suppliers
- Stock: 11 in_stock · 2 low_stock · 1 out_of_stock (LiFePO4 Akku — critical)

---

## Next Steps — Step 3 (Make-or-Buy Analyse)
1. Store `makeorbuy.js` — criteria, weights, alternatives, scoring
2. `MOBScoringMatrix.vue` — editable weight/score grid per criterion
3. `MOBBreakevenChart.vue` — break-even line chart (fixed + variable cost vs. volume)
4. `MOBResult.vue` — decision summary card with recommendation
5. Route `/make-or-buy` + nav unlock

---

## Run
```bash
cd logistics-app
npm run dev    # http://localhost:5173
npm run build  # production build
```
