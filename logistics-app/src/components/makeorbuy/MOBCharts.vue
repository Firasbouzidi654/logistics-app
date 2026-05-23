<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  Chart, LineElement, BarElement, PointElement,
  LineController, BarController,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
} from 'chart.js'
import { useMakeOrBuyStore } from '../../stores/makeorbuy'

Chart.register(
  LineElement, BarElement, PointElement,
  LineController, BarController,
  CategoryScale, LinearScale,
  Tooltip, Legend, Filler,
)

const store = useMakeOrBuyStore()
const beRef  = ref(null)   // break-even
const cmpRef = ref(null)   // grouped comparison
let beChart  = null
let cmpChart = null

const TIP = {
  backgroundColor: 'rgba(15,23,42,0.95)',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  titleColor: '#f1f5f9',
  bodyColor: '#94a3b8',
  padding: 12,
}

function fmtK(v) {
  return new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
}

function buildBreakeven() {
  if (!beRef.value) return
  if (beChart) beChart.destroy()

  const series = store.breakevenSeries
  const labels = series.map(p => p.qty.toLocaleString('de-DE'))

  beChart = new Chart(beRef.value, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Make — Gesamtkosten',
          data: series.map(p => p.make),
          borderColor: 'rgba(16,185,129,1)',
          backgroundColor: 'rgba(16,185,129,0.08)',
          borderWidth: 2.5, pointRadius: 3, fill: false, tension: 0,
        },
        {
          label: 'Buy — Gesamtkosten',
          data: series.map(p => p.buy),
          borderColor: 'rgba(14,165,233,1)',
          backgroundColor: 'rgba(14,165,233,0.08)',
          borderWidth: 2.5, pointRadius: 3, fill: false, tension: 0,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
        tooltip: {
          ...TIP,
          callbacks: {
            title: ctx => `Menge: ${ctx[0].label} Stk`,
            label: ctx => ` ${ctx.dataset.label.split('—')[0].trim()}: ${new Intl.NumberFormat('de-DE').format(ctx.raw)} €`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 8 },
          grid:  { color: 'rgba(255,255,255,0.04)' },
          title: { display: true, text: 'Produktionsmenge (Stk/Jahr)', color: '#64748b', font: { size: 11 } },
        },
        y: {
          ticks: { color: '#64748b', font: { size: 11 }, callback: v => fmtK(v) + ' €' },
          grid:  { color: 'rgba(255,255,255,0.04)' },
          title: { display: true, text: 'Gesamtkosten (€)', color: '#64748b', font: { size: 11 } },
        },
      },
    },
  })
}

function buildComparison() {
  if (!cmpRef.value) return
  if (cmpChart) cmpChart.destroy()

  const levels = store.comparisonLevels
  const labels = levels.map(l => l.qty.toLocaleString('de-DE') + ' Stk')

  cmpChart = new Chart(cmpRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Make',
          data: levels.map(l => l.make),
          backgroundColor: 'rgba(16,185,129,0.7)',
          borderColor: 'rgba(16,185,129,1)',
          borderWidth: 2, borderRadius: 5,
        },
        {
          label: 'Buy',
          data: levels.map(l => l.buy),
          backgroundColor: 'rgba(14,165,233,0.7)',
          borderColor: 'rgba(14,165,233,1)',
          borderWidth: 2, borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { labels: { color: '#94a3b8', font: { size: 12 } } },
        tooltip: {
          ...TIP,
          callbacks: { label: ctx => ` ${ctx.dataset.label}: ${new Intl.NumberFormat('de-DE').format(ctx.raw)} €` },
        },
      },
      scales: {
        x: { ticks: { color: '#64748b', font: { size: 10 } }, grid: { display: false } },
        y: {
          ticks: { color: '#64748b', font: { size: 11 }, callback: v => fmtK(v) + ' €' },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
      },
    },
  })
}

onMounted(() => { buildBreakeven(); buildComparison() })
watch(() => store.breakevenSeries,   buildBreakeven,  { deep: true })
watch(() => store.comparisonLevels,  buildComparison, { deep: true })
</script>

<template>
  <div class="space-y-6">

    <!-- Break-even chart -->
    <div class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 class="text-white font-semibold">Break-even-Analyse</h3>
          <p class="text-slate-500 text-xs mt-0.5">Schnittpunkt: Make und Buy haben gleiche Gesamtkosten</p>
        </div>
        <div class="flex items-center gap-4 text-xs">
          <span class="flex items-center gap-1.5">
            <span class="w-6 h-0.5 rounded bg-emerald-400 inline-block"></span>
            Make (Fixkosten + var. Kosten)
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-6 h-0.5 rounded bg-accent-400 inline-block"></span>
            Buy (Lieferantenpreis × Menge)
          </span>
          <div v-if="store.breakEvenQty" class="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/25 text-amber-400 font-semibold">
            Break-even: {{ store.breakEvenQty.toLocaleString('de-DE') }} Stk
          </div>
        </div>
      </div>
      <div class="p-6" style="height: 340px">
        <canvas ref="beRef"></canvas>
      </div>
    </div>

    <!-- Grouped bar: Make vs Buy at key quantities -->
    <div class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="px-6 py-4 border-b border-white/10">
        <h3 class="text-white font-semibold">Kostenvergleich nach Produktionsmenge</h3>
        <p class="text-slate-500 text-xs mt-0.5">Make vs. Buy bei verschiedenen Szenarien — aktualisiert bei Parameteränderungen</p>
      </div>
      <div class="p-6" style="height: 300px">
        <canvas ref="cmpRef"></canvas>
      </div>
    </div>

    <!-- Interpretation card -->
    <div class="glass rounded-2xl border border-white/10 p-6">
      <h4 class="text-white font-semibold mb-4">Interpretation der Kostenanalyse</h4>
      <div class="grid md:grid-cols-3 gap-4 text-sm">
        <div class="rounded-xl bg-surface-800/40 border border-white/5 p-4">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Unter Break-even</p>
          <p class="text-slate-300 leading-relaxed">
            Bei Mengen <strong class="text-accent-400">unter {{ store.breakEvenQty?.toLocaleString('de-DE') ?? '—' }} Stk</strong>
            ist der Fremdbezug günstiger, da die hohen Fixkosten der Eigenfertigung nicht amortisiert werden.
          </p>
        </div>
        <div class="rounded-xl bg-surface-800/40 border border-white/5 p-4">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Am Break-even</p>
          <p class="text-slate-300 leading-relaxed">
            Bei exakt <strong class="text-amber-400">{{ store.breakEvenQty?.toLocaleString('de-DE') ?? '—' }} Stk</strong>
            sind Make- und Buy-Kosten identisch. Qualitative Kriterien geben hier den Ausschlag.
          </p>
        </div>
        <div class="rounded-xl bg-surface-800/40 border border-white/5 p-4">
          <p class="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Über Break-even</p>
          <p class="text-slate-300 leading-relaxed">
            Ab <strong class="text-emerald-400">mehr als {{ store.breakEvenQty?.toLocaleString('de-DE') ?? '—' }} Stk</strong>
            ist die Eigenfertigung wirtschaftlich vorteilhaft — Fixkostendegression greift.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
