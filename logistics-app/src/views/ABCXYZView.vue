<script setup>
import { ref } from 'vue'
import Navbar            from '../components/layout/Navbar.vue'
import Footer            from '../components/layout/Footer.vue'
import ABCIntro          from '../components/abcxyz/ABCIntro.vue'
import ProductTable      from '../components/abcxyz/ProductTable.vue'
import ParetoChart       from '../components/abcxyz/ParetoChart.vue'
import CalculationExplanation from '../components/abcxyz/CalculationExplanation.vue'
import ExportPanel       from '../components/shared/ExportPanel.vue'
import { useABCXYZStore }    from '../stores/abcxyz'

const store = useABCXYZStore()

const activeTab = ref('analyse')
const tabs = [
  { id: 'analyse',        label: 'Analyse & Tabelle',  icon: '📊' },
  { id: 'theorie',        label: 'Theorie',             icon: '📖' },
]

function fmt(n) {
  return new Intl.NumberFormat('de-DE').format(n)
}

// Live KPI counts derived from store
const kpis = [
  { label: 'A-Artikel', labelSub: 'Wichtig', color: 'text-rose-400', getValue: () => store.enriched.filter(p => p.abc === 'A').length },
  { label: 'B-Artikel', labelSub: 'Mittel', color: 'text-amber-400', getValue: () => store.enriched.filter(p => p.abc === 'B').length },
  { label: 'C-Artikel', labelSub: 'Gering', color: 'text-slate-400', getValue: () => store.enriched.filter(p => p.abc === 'C').length },
  { label: 'Gesamtwert', labelSub: 'Jahresverbrauchswert', color: 'text-accent-400', currency: true, getValue: () => store.totalValue },
]
</script>

<template>
  <div class="min-h-screen bg-surface-900">
    <Navbar />

    <!-- Page header -->
    <div class="relative pt-24 pb-10 px-6 overflow-hidden">
      <div class="orb w-72 h-72 bg-accent-600/15 -top-20 -right-20 animate-pulse-slow pointer-events-none"></div>
      <div class="orb w-48 h-48 bg-blue-700/8 top-32 left-8 animate-float pointer-events-none" style="animation-delay:1.5s"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <RouterLink to="/" class="hover:text-slate-300 transition-colors">Startseite</RouterLink>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>
          <span class="text-slate-300">ABC-Analyse</span>
        </div>

        <!-- Title row + Export -->
        <div class="flex items-start justify-between flex-wrap gap-4 mb-2">
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-white mb-2">ABC-Analyse</h1>
            <p class="text-slate-400 max-w-2xl">
              Klassifikation von Lagerartikeln nach ihrem Jahresverbrauchswert (ABC).
              Bearbeite die Tabelle — Diagramm und Klassifikation aktualisieren sich live.
            </p>
          </div>
          <div class="flex flex-col items-end gap-3">
            <span class="px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              ✓ Verfügbar
            </span>
            <!-- Export buttons (only on Analyse tab) -->
            <div v-if="activeTab === 'analyse'" class="flex items-center gap-2">
              <span class="text-xs text-slate-500 hidden sm:inline">Export:</span>
              <ExportPanel type="abc" />
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 mt-5 bg-surface-800/60 rounded-xl p-1 w-fit flex-wrap">
          <button
            v-for="t in tabs"
            :key="t.id"
            :class="[
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === t.id
                ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5',
            ]"
            @click="activeTab = t.id"
          >
            <span>{{ t.icon }}</span>{{ t.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main content with tab transitions -->
    <main class="max-w-7xl mx-auto px-6 pb-20">
      <Transition name="tab-slide" mode="out-in">

        <!-- Analyse tab -->
        <div v-if="activeTab === 'analyse'" key="analyse" class="space-y-8">

          <!-- KPI Cards -->
          <section>
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 mb-3">ABC-Klassifikation</p>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="kpi in kpis"
                :key="kpi.label"
                class="glass rounded-xl p-4 border border-white/10 text-center card-lift"
              >
                <p class="text-2xl font-black" :class="kpi.color">
                  {{ fmt(kpi.getValue()) }}<span v-if="kpi.currency" class="text-base ml-1">€</span>
                </p>
                <p class="text-sm font-semibold text-white mt-1">{{ kpi.label }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ kpi.labelSub }}</p>
              </div>
            </div>
          </section>

          <!-- Total value indicator -->
          <div class="glass rounded-xl border border-accent-500/20 bg-gradient-to-r from-accent-600/8 to-transparent p-4 flex items-center gap-4">
            <div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-accent-400">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-slate-500 uppercase tracking-widest font-semibold">Gesamtverbrauchswert</p>
              <p class="text-xl font-black text-white">{{ fmt(store.totalValue) }} <span class="text-accent-400">€</span></p>
            </div>
            <div class="ml-auto text-xs text-slate-500 hidden md:block">
              {{ store.enriched.length }} Artikel · automatisch sortiert nach Verbrauchswert
            </div>
          </div>

          <ParetoChart />
          <CalculationExplanation />
          <ProductTable />
        </div>

        <!-- Theorie tab -->
        <div v-else key="theorie">
          <ABCIntro />
        </div>

      </Transition>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.tab-slide-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.tab-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
