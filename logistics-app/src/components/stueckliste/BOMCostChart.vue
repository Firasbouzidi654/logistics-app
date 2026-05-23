<script setup>
import { ref, onMounted, watch } from 'vue'
import {
  Chart, DoughnutController, BarController,
  ArcElement, BarElement,
  CategoryScale, LinearScale,
  Tooltip, Legend,
} from 'chart.js'
import { useStuecklisteStore } from '../../stores/stueckliste'

Chart.register(DoughnutController, BarController, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const store = useStuecklisteStore()
const donutRef = ref(null)
const barRef   = ref(null)
let donutChart = null
let barChart   = null

const PALETTE = {
  Antrieb:   { fill: 'rgba(14,165,233,0.8)',  border: 'rgba(14,165,233,1)'  },
  Sensorik:  { fill: 'rgba(139,92,246,0.8)',  border: 'rgba(139,92,246,1)'  },
  Steuerung: { fill: 'rgba(16,185,129,0.8)',  border: 'rgba(16,185,129,1)'  },
  Energie:   { fill: 'rgba(245,158,11,0.8)',  border: 'rgba(245,158,11,1)'  },
  Mechanik:  { fill: 'rgba(244,63,94,0.8)',   border: 'rgba(244,63,94,1)'   },
}

const tooltipDefaults = {
  backgroundColor: 'rgba(15,23,42,0.95)',
  borderColor: 'rgba(255,255,255,0.1)',
  borderWidth: 1,
  titleColor: '#f1f5f9',
  bodyColor: '#94a3b8',
  padding: 12,
}

function buildDonut() {
  if (!donutRef.value) return
  if (donutChart) donutChart.destroy()
  const groups = Object.keys(store.costByGroup)
  donutChart = new Chart(donutRef.value, {
    type: 'doughnut',
    data: {
      labels: groups,
      datasets: [{
        data: groups.map(g => store.costByGroup[g]),
        backgroundColor: groups.map(g => PALETTE[g]?.fill || 'rgba(148,163,184,0.7)'),
        borderColor:     groups.map(g => PALETTE[g]?.border || 'rgba(148,163,184,1)'),
        borderWidth: 2,
        hoverOffset: 8,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: { position: 'bottom', labels: { color: '#94a3b8', font: { size: 12 }, padding: 16 } },
        tooltip: {
          ...tooltipDefaults,
          callbacks: {
            label(ctx) {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
              const pct   = ((ctx.raw / total) * 100).toFixed(1)
              return ` ${new Intl.NumberFormat('de-DE').format(ctx.raw)} € (${pct}%)`
            },
          },
        },
      },
    },
  })
}

function buildBar() {
  if (!barRef.value) return
  if (barChart) barChart.destroy()
  const sorted = [...store.enriched].sort((a, b) => b.totalCost - a.totalCost).slice(0, 8)
  barChart = new Chart(barRef.value, {
    type: 'bar',
    data: {
      labels: sorted.map(i => i.name.split(' ').slice(0, 2).join(' ')),
      datasets: [{
        label: 'Gesamtkosten (€)',
        data: sorted.map(i => i.totalCost),
        backgroundColor: sorted.map(i => PALETTE[i.group]?.fill || 'rgba(148,163,184,0.7)'),
        borderColor:     sorted.map(i => PALETTE[i.group]?.border || 'rgba(148,163,184,1)'),
        borderWidth: 2,
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, indexAxis: 'y',
      plugins: {
        legend: { display: false },
        tooltip: {
          ...tooltipDefaults,
          callbacks: { label: ctx => ` ${new Intl.NumberFormat('de-DE').format(ctx.raw)} €` },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 11 }, callback: v => new Intl.NumberFormat('de-DE', { notation: 'compact' }).format(v) + ' €' },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: { ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { display: false } },
      },
    },
  })
}

onMounted(() => { buildDonut(); buildBar() })
watch(() => store.costByGroup, buildDonut, { deep: true })
watch(() => store.enriched,   buildBar,   { deep: true })
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <!-- Donut -->
    <div class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="px-6 py-4 border-b border-white/10">
        <h3 class="text-white font-semibold">Kostenverteilung nach Baugruppe</h3>
        <p class="text-slate-500 text-xs mt-0.5">Anteil jeder Gruppe an den Gesamtkosten</p>
      </div>
      <div class="p-6" style="height:320px">
        <canvas ref="donutRef"></canvas>
      </div>
    </div>

    <!-- Horizontal bar: top components -->
    <div class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="px-6 py-4 border-b border-white/10">
        <h3 class="text-white font-semibold">Top 8 Komponenten nach Gesamtkosten</h3>
        <p class="text-slate-500 text-xs mt-0.5">Aktualisiert bei Tabellenänderungen</p>
      </div>
      <div class="p-6" style="height:320px">
        <canvas ref="barRef"></canvas>
      </div>
    </div>
  </div>
</template>
