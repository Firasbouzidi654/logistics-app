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
| Charts | Chart.js (direct instantiation — no wrapper lib) |
| State | Pinia |
| Routing | Vue Router 4 |
| Icons | Inline SVG |
| Utils | @vueuse/core |

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
    makeorbuy/    MOBDecisionBanner.vue  MOBKPICards.vue
                  MOBInputPanel.vue  MOBCriteriaTable.vue  MOBCharts.vue
  views/          HomeView.vue  ABCXYZView.vue
                  StuecklisteView.vue  MakeOrBuyView.vue
  stores/         abcxyz.js  stueckliste.js  makeorbuy.js
  router/         index.js
  assets/         firas-profile.jpeg
  style.css       App.vue  main.js
```

---

## Design System
- **Background:** `#0f172a` (surface-900)
- **Glass cards:** `bg-white/5 backdrop-blur-md border border-white/10`
- **Module colors:** ABC=accent-blue · Stückliste=violet · Make-or-Buy=rose/pink
- **Animations:** CSS keyframes + IntersectionObserver scroll reveals
- **Typography:** Inter (Google Fonts)

---

## All Routes — COMPLETE
| Path | View | Status |
|---|---|---|
| `/` | HomeView | ✅ Done |
| `/abc-xyz` | ABCXYZView | ✅ Done |
| `/stueckliste` | StuecklisteView | ✅ Done |
| `/make-or-buy` | MakeOrBuyView | ✅ Done |

---

## Completed — Step 1 (Homepage + ABC/XYZ)
- [x] Scaffold, TailwindCSS, router, Pinia, Chart.js
- [x] Navbar (scroll-aware frosted glass, mobile hamburger)
- [x] Hero + KPI animated counters + Zielkonflikt + ModuleCards
- [x] ProfileSection — photo, Wirtschaftsinformatik B.Sc., DRÄXLMAIER Werkstudent badge
- [x] ABCXYZView — 2 tabs: Theorie / Analyse & Tabelle
- [x] ProductTable: 10 items editable, live ABC badge + cumulative bar
- [x] ParetoChart: Chart.js combo bar+line, reactive via Pinia

## Completed — Step 2 (Stücklistenanalyse)
- [x] Store `stueckliste.js` — 14 BOM items, Autonomer Lagerroboter AR-200
- [x] BOMKPICards — animated total, most expensive, Ø lead time, stock split
- [x] BOMTree — 2-level expandable (product → assembly → component)
- [x] BOMTable — editable qty/price/leadTime, group filter, live footer
- [x] BOMCostChart — doughnut (by group) + horizontal bar (top 8)
- [x] 3 tabs: Analyse & Tabelle / Produktstruktur / Kostenanalyse

## Completed — Step 3 (Make-or-Buy Analyse)
- [x] Store `makeorbuy.js` — scenario: EA-300, LogiTech GmbH vs. Siemens AG
  - Editable: fixedCosts, materialCost, laborCost, machineCost, supplierPrice, quantity, risk, capacity
  - Computed: makeTotalCost, buyTotalCost, costDiff, breakEvenQty
  - Computed: weightedMakeScore, weightedBuyScore (Nutzwertanalyse)
  - Computed: overallRecommendation (cost 60% + quality 40%), confidence %
  - Series: breakevenSeries (20 points), comparisonLevels (7 qty levels)
- [x] MOBKPICards — 6 cards: Make cost (animated), Buy cost (animated), Diff, Break-even, Risk/Capacity
- [x] MOBDecisionBanner — dynamic "Make/Buy/Neutral" recommendation with confidence, glow effect
- [x] MOBInputPanel — dual-panel sliders for Make params + scenario params, mini cost breakdown bar
- [x] MOBCriteriaTable — 7-row Nutzwertanalyse, all editable (weight + scores), visual bar comparison
- [x] MOBCharts — break-even line chart + grouped bar (Make vs Buy at 7 quantities) + interpretation cards
- [x] MakeOrBuyView — 3 tabs: Kalkulation / Kriterienbewertung / Kostenanalyse + full cost detail table

---

## Store Logic Summary

### abcxyz.js
- cumPct ≤ 70% → A | ≤ 90% → B | > 90% → C

### stueckliste.js
- 14 items across 5 groups: Antrieb · Sensorik · Steuerung · Energie · Mechanik
- Total: 3.310 € | 14 suppliers | 1 out-of-stock (LiFePO4 Akku)

### makeorbuy.js
- variableCostPerUnit = material + labor + machine
- makeTotalCost = fixedCosts + variableCostPerUnit × quantity
- buyTotalCost = supplierPrice × quantity
- breakEvenQty = fixedCosts ÷ (supplierPrice − variableCostPerUnit)
- overallRecommendation: costWinner(60%) + qualityWinner(40%)
- Default: 2.000 Stk → Buy cheaper by 50.000 € | Break-even at ~2.770 Stk

---

## Potential Future Enhancements
1. XYZ classification (CV = σ/μ) + ABC×XYZ 3×3 strategy matrix
2. Export to CSV / PDF for all three modules
3. Scenario comparison (save and compare multiple Make-or-Buy setups)
4. Summary / Abschlussseite with all three analyses combined
5. Dark/light theme toggle

---

## Run
```bash
cd logistics-app
npm run dev    # http://localhost:5173
npm run build  # production build
```
