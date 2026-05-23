<script setup>
import { computed } from 'vue'
import { useMakeOrBuyStore } from '../../stores/makeorbuy'

const store = useMakeOrBuyStore()

const scoreColor = (s) =>
  s >= 8 ? 'text-emerald-400' : s >= 6 ? 'text-accent-400' : s >= 4 ? 'text-amber-400' : 'text-rose-400'

const winner = (make, buy) => {
  if (make > buy) return 'make'
  if (buy > make) return 'buy'
  return 'tie'
}

const rowWeightedMake = (c) => +(c.makeScore * c.weight / 100).toFixed(2)
const rowWeightedBuy  = (c) => +(c.buyScore  * c.weight / 100).toFixed(2)
</script>

<template>
  <div class="space-y-6">
    <!-- Table -->
    <div class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 class="text-white font-semibold">Nutzwertanalyse — Kriterienbewertung</h3>
          <p class="text-slate-500 text-xs mt-0.5">
            Gewichte und Scores editierbar · Gesamtgewicht: {{ store.totalWeight }}%
            <span v-if="store.totalWeight !== 100" class="text-amber-400 ml-1">(sollte 100% ergeben)</span>
          </p>
        </div>
        <!-- Summary badges -->
        <div class="flex items-center gap-3">
          <div class="text-center px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p class="text-emerald-400 font-black text-lg leading-none">{{ store.weightedMakeScore.toFixed(1) }}</p>
            <p class="text-slate-500 text-xs mt-0.5">Make Ø</p>
          </div>
          <div class="text-slate-500 font-bold">vs</div>
          <div class="text-center px-4 py-2 rounded-xl bg-accent-500/10 border border-accent-500/20">
            <p class="text-accent-400 font-black text-lg leading-none">{{ store.weightedBuyScore.toFixed(1) }}</p>
            <p class="text-slate-500 text-xs mt-0.5">Buy Ø</p>
          </div>
          <div :class="[
            'px-3 py-2 rounded-xl border text-xs font-bold',
            store.qualityWinner === 'make'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-accent-500/15 border-accent-500/30 text-accent-400',
          ]">
            {{ store.qualityWinner === 'make' ? '↑ MAKE' : '↑ BUY' }}
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full data-table min-w-[700px]">
          <thead>
            <tr class="bg-surface-800/60">
              <th>Kriterium</th>
              <th class="text-slate-400 text-xs">Beschreibung</th>
              <th class="text-center">Gewicht %</th>
              <th class="text-center">Make (1–10)</th>
              <th class="text-center">Buy (1–10)</th>
              <th class="text-center">Gew. Make</th>
              <th class="text-center">Gew. Buy</th>
              <th class="text-center">Sieger</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in store.criteria" :key="c.id">
              <td class="font-medium text-white">{{ c.label }}</td>
              <td class="text-slate-500 text-xs">{{ c.description }}</td>

              <!-- Weight -->
              <td class="text-center">
                <input
                  type="number" min="0" max="100" :value="c.weight"
                  class="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-center text-white
                         focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-colors"
                  @change="store.setCriteria(c.id, 'weight', $event.target.value)"
                />
              </td>

              <!-- Make score -->
              <td class="text-center">
                <input
                  type="number" min="1" max="10" :value="c.makeScore"
                  :class="['w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-center font-semibold',
                           'focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-colors',
                           scoreColor(c.makeScore)]"
                  @change="store.setCriteria(c.id, 'makeScore', $event.target.value)"
                />
              </td>

              <!-- Buy score -->
              <td class="text-center">
                <input
                  type="number" min="1" max="10" :value="c.buyScore"
                  :class="['w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-center font-semibold',
                           'focus:outline-none focus:border-accent-500/50 focus:bg-white/10 transition-colors',
                           scoreColor(c.buyScore)]"
                  @change="store.setCriteria(c.id, 'buyScore', $event.target.value)"
                />
              </td>

              <!-- Weighted scores -->
              <td class="text-center text-emerald-400 font-semibold text-sm">{{ rowWeightedMake(c).toFixed(2) }}</td>
              <td class="text-center text-accent-400 font-semibold text-sm">{{ rowWeightedBuy(c).toFixed(2) }}</td>

              <!-- Winner badge -->
              <td class="text-center">
                <span v-if="winner(c.makeScore, c.buyScore) === 'make'"
                  class="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                  Make ↑
                </span>
                <span v-else-if="winner(c.makeScore, c.buyScore) === 'buy'"
                  class="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-accent-500/15 text-accent-400 border border-accent-500/25">
                  Buy ↑
                </span>
                <span v-else class="text-slate-500 text-xs">—</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="border-t-2 border-white/10 bg-surface-800/40">
              <td colspan="2" class="px-4 py-3 text-sm font-semibold text-slate-300">Gewichteter Gesamtscore</td>
              <td class="px-4 py-3 text-center text-sm text-slate-400">{{ store.totalWeight }}%</td>
              <td colspan="2"></td>
              <td class="px-4 py-3 text-center font-black text-emerald-400 text-base">{{ store.weightedMakeScore.toFixed(2) }}</td>
              <td class="px-4 py-3 text-center font-black text-accent-400 text-base">{{ store.weightedBuyScore.toFixed(2) }}</td>
              <td class="px-4 py-3 text-center">
                <span :class="[
                  'inline-flex px-3 py-1 rounded-full text-xs font-black border',
                  store.qualityWinner === 'make'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-accent-500/20 text-accent-400 border-accent-500/30'
                ]">
                  {{ store.qualityWinner === 'make' ? 'MAKE' : 'BUY' }}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Criteria bar comparison -->
    <div class="glass rounded-2xl border border-white/10 p-6">
      <h4 class="text-white font-semibold mb-5">Score-Vergleich nach Kriterium</h4>
      <div class="space-y-4">
        <div v-for="c in store.criteria" :key="c.id">
          <div class="flex justify-between text-xs text-slate-400 mb-1.5">
            <span class="font-medium text-slate-300">{{ c.label }}</span>
            <span class="text-slate-500">Gewicht: {{ c.weight }}%</span>
          </div>
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <span class="text-xs text-emerald-400 w-10 text-right">{{ c.makeScore }}/10</span>
              <div class="flex-1 h-2.5 rounded-full bg-surface-700 overflow-hidden">
                <div class="h-full rounded-full bg-emerald-500/70 transition-all duration-400"
                     :style="{ width: (c.makeScore / 10 * 100) + '%' }"></div>
              </div>
              <span class="text-xs text-slate-500 w-8">Make</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-accent-400 w-10 text-right">{{ c.buyScore }}/10</span>
              <div class="flex-1 h-2.5 rounded-full bg-surface-700 overflow-hidden">
                <div class="h-full rounded-full bg-accent-500/70 transition-all duration-400"
                     :style="{ width: (c.buyScore / 10 * 100) + '%' }"></div>
              </div>
              <span class="text-xs text-slate-500 w-8">Buy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
