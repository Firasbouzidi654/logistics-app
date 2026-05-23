<script setup>
import { useABCXYZStore } from '../../stores/abcxyz'

const store = useABCXYZStore()

const badgeClass = {
  A: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
  B: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  C: 'bg-slate-500/20 text-slate-400 border border-slate-500/30',
}

function fmt(n) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0 }).format(n)
}
</script>

<template>
  <div class="glass rounded-2xl border border-white/10 overflow-hidden">
    <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
      <div>
        <h3 class="text-white font-semibold">Artikelliste — Verbrauchswertanalyse</h3>
        <p class="text-slate-500 text-xs mt-0.5">Werte editierbar · Klassifikation wird automatisch berechnet</p>
      </div>
      <div class="text-right">
        <p class="text-xs text-slate-500">Gesamtwert</p>
        <p class="text-accent-400 font-bold">{{ fmt(store.totalValue) }} €</p>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full data-table">
        <thead>
          <tr class="bg-surface-800/50">
            <th>Rang</th>
            <th>Artikel</th>
            <th class="text-right">Stückpreis (€)</th>
            <th class="text-right">Menge/Jahr</th>
            <th class="text-right">Verbrauchswert (€)</th>
            <th class="text-right">Anteil %</th>
            <th class="text-right">Kum. %</th>
            <th class="text-center">Klasse</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in store.enriched" :key="p.id">
            <td class="text-slate-500 font-mono text-xs">{{ i + 1 }}</td>
            <td class="font-medium text-white">{{ p.name }}</td>
            <td class="text-right">
              <input
                type="number"
                :value="p.value"
                min="0"
                class="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-right text-white focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-colors"
                @change="store.updateProduct(p.id, 'value', $event.target.value)"
              />
            </td>
            <td class="text-right">
              <input
                type="number"
                :value="p.demand"
                min="0"
                class="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-right text-white focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-colors"
                @change="store.updateProduct(p.id, 'demand', $event.target.value)"
              />
            </td>
            <td class="text-right font-medium text-white">{{ fmt(p.totalValue) }}</td>
            <td class="text-right text-slate-300">{{ p.pct.toFixed(1) }}%</td>
            <td class="text-right">
              <div class="flex items-center justify-end gap-2">
                <div class="flex-1 max-w-16 h-1.5 rounded-full bg-surface-700 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :class="p.abc === 'A' ? 'bg-rose-400' : p.abc === 'B' ? 'bg-amber-400' : 'bg-slate-400'"
                    :style="{ width: Math.min(p.cumPct, 100) + '%' }"
                  ></div>
                </div>
                <span class="text-sm text-slate-300 w-12 text-right">{{ p.cumPct.toFixed(1) }}%</span>
              </div>
            </td>
            <td class="text-center">
              <span :class="['inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold', badgeClass[p.abc]]">
                {{ p.abc }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
