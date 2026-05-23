<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStuecklisteStore } from '../../stores/stueckliste'

const store = useStuecklisteStore()

function fmt(n) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n)
}

// Animated counter
const displayTotal = ref(0)
function animateTotal(target) {
  const steps = 50
  const delta = (target - displayTotal.value) / steps
  let i = 0
  const t = setInterval(() => {
    i++
    displayTotal.value = Math.round(displayTotal.value + delta)
    if (i >= steps) { displayTotal.value = target; clearInterval(t) }
  }, 20)
}
onMounted(() => animateTotal(store.totalCost))
watch(() => store.totalCost, v => animateTotal(v))

const stockColors = {
  in_stock:     'text-emerald-400',
  low_stock:    'text-amber-400',
  out_of_stock: 'text-rose-400',
}
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">

    <!-- Total Cost -->
    <div class="lg:col-span-2 glass rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/15 to-purple-700/10 p-5 flex items-center gap-4">
      <div class="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-violet-400">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      </div>
      <div>
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">Gesamtkosten</p>
        <p class="text-2xl font-black text-white">{{ fmt(displayTotal) }} <span class="text-lg text-violet-400">€</span></p>
        <p class="text-slate-500 text-xs mt-0.5">{{ store.items.length }} Positionen</p>
      </div>
    </div>

    <!-- Most expensive -->
    <div class="glass rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-600/15 to-pink-700/10 p-5">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-rose-400">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Teuerste Komponente</span>
      </div>
      <p class="text-lg font-bold text-white leading-tight">{{ store.mostExpensive?.name }}</p>
      <p class="text-rose-400 font-semibold text-sm mt-1">{{ fmt(store.mostExpensive?.totalCost) }} €</p>
    </div>

    <!-- Avg Lead Time -->
    <div class="glass rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-600/15 to-orange-700/10 p-5">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-amber-400">
            <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
          </svg>
        </div>
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Ø Lieferzeit</span>
      </div>
      <p class="text-2xl font-black text-white">{{ store.avgLeadTime }} <span class="text-sm text-amber-400 font-medium">Tage</span></p>
      <p class="text-slate-500 text-xs mt-1">Über alle Lieferanten</p>
    </div>

    <!-- Supplier + Stock -->
    <div class="glass rounded-2xl border border-accent-500/25 bg-gradient-to-br from-accent-600/15 to-blue-700/10 p-5">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-7 h-7 rounded-lg bg-accent-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-accent-400">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Lieferanten</span>
      </div>
      <p class="text-2xl font-black text-white mb-2">{{ store.supplierCount }}</p>
      <div class="space-y-1">
        <div class="flex justify-between text-xs">
          <span class="text-emerald-400">✓ Verfügbar</span>
          <span class="text-emerald-400 font-semibold">{{ store.stockSummary.in_stock }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-amber-400">⚠ Niedrig</span>
          <span class="text-amber-400 font-semibold">{{ store.stockSummary.low_stock }}</span>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-rose-400">✗ Nicht vorrätig</span>
          <span class="text-rose-400 font-semibold">{{ store.stockSummary.out_of_stock }}</span>
        </div>
      </div>
    </div>

  </div>
</template>
