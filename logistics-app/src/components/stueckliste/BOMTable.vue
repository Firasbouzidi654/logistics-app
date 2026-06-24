<script setup>
import { ref, computed } from 'vue'
import { useStuecklisteStore } from '../../stores/stueckliste'
import { exportBOMAnalysisPDF } from '../../composables/useBOMExport'

const store = useStuecklisteStore()
const filterGroup = ref('Alle')
const exporting = ref(false)

const groups = computed(() => ['Alle', ...new Set(store.items.map(i => i.group))])
const filtered = computed(() =>
  filterGroup.value === 'Alle'
    ? store.enriched
    : store.enriched.filter(i => i.group === filterGroup.value)
)

function fmt(n) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

const stockMeta = {
  in_stock:     { label: 'Verfügbar',     cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  low_stock:    { label: 'Niedrig',       cls: 'bg-amber-500/15  text-amber-400  border-amber-500/25'  },
  out_of_stock: { label: 'Nicht vorrätig',cls: 'bg-rose-500/15   text-rose-400   border-rose-500/25'   },
}
const groupColors = {
  Antrieb:   'bg-accent-500/15  text-accent-400  border-accent-500/25',
  Sensorik:  'bg-violet-500/15  text-violet-400  border-violet-500/25',
  Steuerung: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  Energie:   'bg-amber-500/15   text-amber-400   border-amber-500/25',
  Mechanik:  'bg-rose-500/15    text-rose-400    border-rose-500/25',
}

async function exportPDF() {
  exporting.value = true
  try {
    await exportBOMAnalysisPDF(filtered.value)
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="glass rounded-2xl border border-white/10 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-white font-semibold">BOM-Tabelle · Verbrauchsmaterialien</h3>
        <p class="text-slate-500 text-xs mt-0.5">Mengen, Kosten und Lagerstatus editierbar · Summen aktualisieren sich live</p>
      </div>
      <!-- Group filter -->
      <div class="flex flex-wrap items-center justify-end gap-1.5">
        <button
          class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-rose-500/25 bg-rose-500/10 text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
          :disabled="exporting"
          @click="exportPDF"
        >{{ exporting ? 'PDF wird erstellt…' : '📄 Export BOM Analysis PDF' }}</button>
        <span
          v-if="store.criticalComponents > 1"
          class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/25"
        >⚠ Lieferengpass möglich</span>
        <button
          v-for="g in groups"
          :key="g"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-medium transition-all duration-150',
            filterGroup === g
              ? 'bg-violet-500/25 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 border border-white/10 hover:text-white hover:bg-white/8',
          ]"
          @click="filterGroup = g"
        >{{ g }}</button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full data-table min-w-[860px]">
        <thead>
          <tr class="bg-surface-800/60">
            <th>Pos-Nr.</th>
            <th>Komponentenname</th>
            <th class="text-center">Gruppe</th>
            <th class="text-right">Menge</th>
            <th class="text-right">Einzelpreis (€)</th>
            <th class="text-right">Gesamtpreis (€)</th>
            <th class="text-center">Lieferant</th>
            <th class="text-center">Lagerbestand</th>
            <th class="text-right">Lieferzeit</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td class="text-slate-500 font-mono text-xs">{{ item.id }}</td>

            <td class="font-medium text-white">{{ item.name }}</td>

            <td class="text-center">
              <span :class="['inline-flex px-2 py-0.5 rounded-lg text-xs font-medium border', groupColors[item.group] || 'bg-white/5 text-slate-400 border-white/10']">
                {{ item.group }}
              </span>
            </td>

            <td class="text-right">
              <input
                type="number" min="1" :value="item.qty"
                class="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-right text-white
                       focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-colors"
                @change="store.updateItem(item.id, 'qty', $event.target.value)"
              />
            </td>

            <td class="text-right">
              <input
                type="number" min="0" step="0.01" :value="item.unitCost"
                class="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-right text-white
                       focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-colors"
                @change="store.updateItem(item.id, 'unitCost', $event.target.value)"
              />
            </td>

            <td class="text-right font-semibold text-white">{{ fmt(item.totalCost) }}</td>

            <td class="text-center text-slate-400 text-xs">{{ item.supplier }}</td>

            <td class="text-center">
              <div class="flex flex-col items-center gap-1.5">
                <select
                  :value="item.stock"
                  :class="['rounded-full border px-2 py-1 text-xs font-medium outline-none cursor-pointer bg-surface-800', stockMeta[item.stock]?.cls]"
                  @change="store.updateItem(item.id, 'stock', $event.target.value)"
                >
                  <option value="in_stock">Verfügbar</option>
                  <option value="low_stock">Niedrig</option>
                  <option value="out_of_stock">Nicht vorrätig</option>
                </select>
                <span
                  v-if="item.stock === 'low_stock' || item.stock === 'out_of_stock'"
                  class="text-[11px] font-medium text-amber-300 whitespace-nowrap"
                >⚠ Nachbestellung empfohlen</span>
              </div>
            </td>

            <td class="text-right">
              <input
                type="number" min="1" :value="item.leadTime"
                class="w-16 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm text-right text-white
                       focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-colors"
                @change="store.updateItem(item.id, 'leadTime', $event.target.value)"
              /> <span class="text-slate-500 text-xs">T</span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t-2 border-white/10 bg-surface-800/40">
            <td colspan="5" class="px-4 py-3 text-sm font-semibold text-slate-300">
              Summe ({{ filtered.length }} Positionen)
            </td>
            <td class="px-4 py-3 text-right font-black text-white text-base">
              {{ fmt(filtered.reduce((s, i) => s + i.totalCost, 0)) }}
            </td>
            <td colspan="3"></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>
