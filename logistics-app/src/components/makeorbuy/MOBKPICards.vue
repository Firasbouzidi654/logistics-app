<script setup>
import { ref, watch, onMounted } from 'vue'
import { useMakeOrBuyStore } from '../../stores/makeorbuy'

const store = useMakeOrBuyStore()

function fmt(n) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0 }).format(Math.round(n))
}

// Animated counter for make/buy costs
const dispMake = ref(0)
const dispBuy  = ref(0)

function animateTo(dispRef, target) {
  const steps = 45
  const start = dispRef.value
  const delta = (target - start) / steps
  let i = 0
  const t = setInterval(() => {
    i++
    dispRef.value = Math.round(start + delta * i)
    if (i >= steps) { dispRef.value = target; clearInterval(t) }
  }, 18)
}

onMounted(() => {
  animateTo(dispMake, store.makeTotalCost)
  animateTo(dispBuy,  store.buyTotalCost)
})
watch(() => store.makeTotalCost, v => animateTo(dispMake, v))
watch(() => store.buyTotalCost,  v => animateTo(dispBuy,  v))
</script>

<template>
  <div class="grid grid-cols-2 lg:grid-cols-6 gap-4">

    <!-- Make Cost -->
    <div class="lg:col-span-2 glass rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-600/15 to-teal-700/10 p-5 flex items-center gap-4">
      <div class="w-11 h-11 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-emerald-400">
          <path d="M2 20h20M4 20V8l5 4V8l5 4V8l5 4V20"/>
        </svg>
      </div>
      <div>
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wider">Make — Gesamtkosten</p>
        <p class="text-xl font-black text-white mt-0.5">{{ fmt(dispMake) }} <span class="text-emerald-400 text-base">€</span></p>
        <p class="text-slate-500 text-xs mt-0.5">
          {{ fmt(store.params.fixedCosts) }} fix + {{ fmt(store.variableCostPerUnit) }} €/Stk var.
        </p>
      </div>
    </div>

    <!-- Buy Cost -->
    <div class="lg:col-span-2 glass rounded-2xl border border-accent-500/25 bg-gradient-to-br from-accent-600/15 to-blue-700/10 p-5 flex items-center gap-4">
      <div class="w-11 h-11 rounded-xl bg-accent-500/20 flex items-center justify-center flex-shrink-0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-accent-400">
          <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      </div>
      <div>
        <p class="text-slate-400 text-xs font-medium uppercase tracking-wider">Buy — Gesamtkosten</p>
        <p class="text-xl font-black text-white mt-0.5">{{ fmt(dispBuy) }} <span class="text-accent-400 text-base">€</span></p>
        <p class="text-slate-500 text-xs mt-0.5">
          {{ store.params.supplierPrice }} €/Stk × {{ fmt(store.params.quantity) }} Stück
        </p>
      </div>
    </div>

    <!-- Savings / Difference -->
    <div class="glass rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/15 to-purple-700/10 p-5">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-7 h-7 rounded-lg bg-violet-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-violet-400">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
          </svg>
        </div>
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Differenz</span>
      </div>
      <p class="text-xl font-black" :class="store.costDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'">
        {{ store.costDiff >= 0 ? '+' : '–' }}{{ fmt(Math.abs(store.costDiff)) }} €
      </p>
      <p class="text-slate-500 text-xs mt-1">{{ store.costDiff >= 0 ? 'Make günstiger' : 'Buy günstiger' }}</p>
    </div>

    <!-- Break-even -->
    <div class="glass rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-600/15 to-orange-700/10 p-5">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-amber-400">
            <line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83"/>
          </svg>
        </div>
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Break-even</span>
      </div>
      <p class="text-xl font-black text-amber-400">
        {{ store.breakEvenQty ? store.breakEvenQty.toLocaleString('de-DE') : '∞' }}
      </p>
      <p class="text-slate-500 text-xs mt-1">Stück/Jahr</p>
    </div>

    <!-- Risk + Capacity -->
    <div class="glass rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-600/15 to-pink-700/10 p-5">
      <div class="flex items-center gap-2 mb-3">
        <div class="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-rose-400">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">Risiko / Kap.</span>
      </div>
      <div class="space-y-2">
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-400">Lieferantenrisiko</span>
            <span class="text-rose-400 font-bold">{{ store.params.supplierRisk }}%</span>
          </div>
          <div class="h-1.5 rounded-full bg-surface-700 overflow-hidden">
            <div class="h-full rounded-full bg-rose-400 transition-all duration-500" :style="{ width: store.params.supplierRisk + '%' }"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between text-xs mb-1">
            <span class="text-slate-400">Kap.-Auslastung</span>
            <span class="text-amber-400 font-bold">{{ store.params.capacityUsage }}%</span>
          </div>
          <div class="h-1.5 rounded-full bg-surface-700 overflow-hidden">
            <div class="h-full rounded-full bg-amber-400 transition-all duration-500" :style="{ width: store.params.capacityUsage + '%' }"></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
