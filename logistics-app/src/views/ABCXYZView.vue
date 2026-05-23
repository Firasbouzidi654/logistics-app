<script setup>
import { ref } from 'vue'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import ABCIntro from '../components/abcxyz/ABCIntro.vue'
import ProductTable from '../components/abcxyz/ProductTable.vue'
import ParetoChart from '../components/abcxyz/ParetoChart.vue'

const activeTab = ref('analyse')
const tabs = [
  { id: 'analyse', label: 'Analyse & Tabelle' },
  { id: 'theorie', label: 'Theorie' },
]
</script>

<template>
  <div class="min-h-screen bg-surface-900">
    <Navbar />

    <!-- Page header -->
    <div class="relative pt-24 pb-12 px-6 overflow-hidden">
      <div class="orb w-72 h-72 bg-accent-600/15 -top-20 -right-20 animate-pulse-slow pointer-events-none"></div>
      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <RouterLink to="/" class="hover:text-slate-300 transition-colors">Startseite</RouterLink>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>
          <span class="text-slate-300">ABC/XYZ Analyse</span>
        </div>
        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-white mb-2">ABC/XYZ-Analyse</h1>
            <p class="text-slate-400 max-w-2xl">
              Klassifikation von Lagerartikeln nach Jahresverbrauchswert (ABC) und Bedarfsschwankung (XYZ).
              Bearbeite die Tabelle — Pareto-Diagramm und Klassifikation aktualisieren sich live.
            </p>
          </div>
          <span class="px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 self-start">
            ✓ Verfügbar
          </span>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 mt-6 bg-surface-800/60 rounded-xl p-1 w-fit">
          <button
            v-for="t in tabs"
            :key="t.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === t.id
                ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                : 'text-slate-400 hover:text-white',
            ]"
            @click="activeTab = t.id"
          >
            {{ t.label }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 pb-16 space-y-8">
      <template v-if="activeTab === 'theorie'">
        <ABCIntro />
      </template>

      <template v-else>
        <!-- Stats row -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="glass rounded-xl p-4 border border-white/10 text-center">
            <p class="text-2xl font-black text-rose-400">A</p>
            <p class="text-xs text-slate-400 mt-1">Hochwertige Artikel</p>
          </div>
          <div class="glass rounded-xl p-4 border border-white/10 text-center">
            <p class="text-2xl font-black text-amber-400">B</p>
            <p class="text-xs text-slate-400 mt-1">Mittelwertige Artikel</p>
          </div>
          <div class="glass rounded-xl p-4 border border-white/10 text-center">
            <p class="text-2xl font-black text-slate-400">C</p>
            <p class="text-xs text-slate-400 mt-1">Niedrigwertige Artikel</p>
          </div>
          <div class="glass rounded-xl p-4 border border-white/10 text-center">
            <p class="text-2xl font-black gradient-text">80/20</p>
            <p class="text-xs text-slate-400 mt-1">Pareto-Prinzip</p>
          </div>
        </div>

        <ParetoChart />
        <ProductTable />
      </template>
    </main>

    <Footer />
  </div>
</template>
