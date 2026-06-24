<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import BOMKPICards from '../components/stueckliste/BOMKPICards.vue'
import BOMTree from '../components/stueckliste/BOMTree.vue'
import BOMTable from '../components/stueckliste/BOMTable.vue'
import BOMTheory from '../components/stueckliste/BOMTheory.vue'

const activeTab = ref('analyse')
const tabs = [
  { id: 'analyse', label: 'Analyse & BOM-Tabelle' },
  { id: 'struktur', label: 'Produktstruktur' },
  { id: 'theorie', label: 'Theorie' },
]
</script>

<template>
  <div class="min-h-screen bg-surface-900">
    <Navbar />

    <div class="relative pt-24 pb-12 px-6 overflow-hidden">
      <div class="orb w-72 h-72 bg-violet-600/15 -top-20 -right-20 animate-pulse-slow pointer-events-none"></div>
      <div class="orb w-48 h-48 bg-purple-700/10 top-32 left-10 animate-float pointer-events-none" style="animation-delay:1.5s"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <RouterLink to="/" class="hover:text-slate-300 transition-colors">Startseite</RouterLink>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M9 18l6-6-6-6" /></svg>
          <span class="text-slate-300">Stücklistenanalyse</span>
        </div>

        <div class="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-white mb-2">Stücklistenanalyse</h1>
            <p class="text-slate-400 max-w-2xl">
              Mehrstufige Stückliste (Bill of Materials) für den
              <span class="text-white font-medium">Autonomen Lagerroboter AR-200</span>.
              Visualisierung der Produktstruktur, Kostenauflösung und Lieferantenübersicht.
            </p>
          </div>
          <span class="px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 self-start">
            ✓ Verfügbar
          </span>
        </div>

        <div class="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-violet-400">📋</span> Mehrstufige Stückliste (BOM Level 2)
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-accent-400">💡</span> Kostenauflösung von oben nach unten
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-emerald-400">🔄</span> Live-Kalkulation bei Eingaben
          </div>
        </div>

        <div class="flex gap-1 mt-6 bg-surface-800/60 rounded-xl p-1 w-fit flex-wrap">
          <button
            v-for="t in tabs"
            :key="t.id"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === t.id
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                : 'text-slate-400 hover:text-white',
            ]"
            @click="activeTab = t.id"
          >{{ t.label }}</button>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 pb-20 space-y-8">
      <BOMKPICards />

      <template v-if="activeTab === 'analyse'">
        <BOMTable />
      </template>

      <template v-else-if="activeTab === 'struktur'">
        <BOMTree />
      </template>

      <template v-else>
        <BOMTheory />
      </template>
    </main>

    <Footer />
  </div>
</template>
