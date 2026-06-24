<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import ProcurementDecision from '../components/makeorbuy/ProcurementDecision.vue'
import SupplierComparison from '../components/makeorbuy/SupplierComparison.vue'
import MakeOrBuyTheory from '../components/makeorbuy/MakeOrBuyTheory.vue'

const activeTab = ref('procurement')
const tabs = [
  { id: 'procurement', label: 'Procurement Decision', icon: '📦' },
  { id: 'suppliers', label: 'Supplier Comparison', icon: '🤝' },
  { id: 'theorie', label: 'Theorie', icon: '📚' },
]
</script>

<template>
  <div class="min-h-screen bg-surface-900">
    <Navbar />

    <div class="relative pt-24 pb-10 px-6 overflow-hidden">
      <div class="orb w-96 h-96 bg-rose-600/12 -top-24 -right-24 animate-pulse-slow pointer-events-none"></div>
      <div class="orb w-56 h-56 bg-pink-700/10 top-40 left-5 animate-float pointer-events-none" style="animation-delay:2s"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <RouterLink to="/" class="hover:text-slate-300 transition-colors">Home</RouterLink>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M9 18l6-6-6-6" /></svg>
          <span class="text-slate-300">Make-or-Buy</span>
        </div>

        <div class="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <p class="text-rose-400 text-sm font-semibold uppercase tracking-[0.2em] mb-2">Logistics decision support</p>
            <h1 class="text-3xl md:text-4xl font-black text-white mb-2">Make-or-Buy Dashboard</h1>
            <p class="text-slate-400 max-w-2xl">
              A clear overview for purchasing decisions and supplier selection.
            </p>
          </div>
          <span class="px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 self-start">
            ● Ready for planning
          </span>
        </div>

        <div class="flex gap-1 bg-surface-800/60 rounded-xl p-1 w-fit flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white hover:bg-white/5',
            ]"
            @click="activeTab = tab.id"
          >
            <span>{{ tab.icon }}</span>{{ tab.label }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 pb-20">
      <Transition name="tab-slide" mode="out-in">
        <ProcurementDecision v-if="activeTab === 'procurement'" key="procurement" />
        <SupplierComparison v-else-if="activeTab === 'suppliers'" key="suppliers" />
        <MakeOrBuyTheory v-else key="theorie" />
      </Transition>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.tab-slide-enter-active,
.tab-slide-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.tab-slide-enter-from { opacity: 0; transform: translateY(14px); }
.tab-slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
