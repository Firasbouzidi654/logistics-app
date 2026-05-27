<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  Chart,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import { useABCXYZStore } from '../../stores/abcxyz'

Chart.register(
  BarElement, LineElement, PointElement,
  BarController, LineController,
  CategoryScale, LinearScale,
  Tooltip, Legend,
)

const store = useABCXYZStore()
const canvas = ref(null)
let chartInstance = null
let isFirstRender = true

const barColors = computed(() =>
  store.enriched.map(p =>
    p.abc === 'A' ? 'rgba(251,113,133,0.85)' :
    p.abc === 'B' ? 'rgba(251,191,36,0.85)'  :
                    'rgba(148,163,184,0.65)',
  )
)

const barBorders = computed(() =>
  store.enriched.map(p =>
    p.abc === 'A' ? 'rgba(251,113,133,1)' :
    p.abc === 'B' ? 'rgba(251,191,36,1)'  :
                    'rgba(148,163,184,0.9)',
  )
)

function buildChart() {
  if (!canvas.value) return
  if (chartInstance) chartInstance.destroy()

  const labels    = store.enriched.map(p => p.name.split(' ')[0])
  const barValues = store.enriched.map(p => p.totalValue)
  const lineVals  = store.enriched.map(p => p.cumPct)

  // Animate on first render only — subsequent updates are instant (live editing)
  const animDuration = isFirstRender ? 900 : 0
  isFirstRender = false

  chartInstance = new Chart(canvas.value, {
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Verbrauchswert (€)',
          data: barValues,
          backgroundColor: barColors.value,
          borderColor: barBorders.value,
          borderWidth: 1,
          borderRadius: 7,
          borderSkipped: 'bottom',
          yAxisID: 'y',
          order: 2,
        },
        {
          type: 'line',
          label: 'Kumulierter Anteil (%)',
          data: lineVals,
          borderColor: 'rgba(56,189,248,1)',
          backgroundColor: 'rgba(56,189,248,0.08)',
          borderWidth: 2.5,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(56,189,248,1)',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
          tension: 0.35,
          yAxisID: 'y1',
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: animDuration,
        easing: 'easeOutQuart',
        // Bars rise from bottom
        y: { from: 0 },
      },
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 12, family: 'Inter, system-ui' }, boxWidth: 14 },
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.97)',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          padding: 14,
          cornerRadius: 10,
          callbacks: {
            label(ctx) {
              if (ctx.datasetIndex === 0)
                return `  ${new Intl.NumberFormat('de-DE').format(ctx.raw)} €`
              return `  ${ctx.raw.toFixed(1)} %`
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 11 }, maxRotation: 40 },
          grid:  { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          position: 'left',
          ticks: {
            color: '#64748b', font: { size: 11 },
            callback: v => new Intl.NumberFormat('de-DE', { notation: 'compact' }).format(v) + ' €',
          },
          grid: { color: 'rgba(255,255,255,0.05)' },
        },
        y1: {
          position: 'right',
          min: 0, max: 100,
          ticks: { color: '#64748b', font: { size: 11 }, callback: v => v + '%' },
          grid: { drawOnChartArea: false },
        },
      },
    },
  })
}

onMounted(buildChart)
watch(() => store.enriched, buildChart, { deep: true })
</script>

<template>
  <div class="glass rounded-2xl border border-white/10 overflow-hidden card-lift">
    <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
      <div>
        <h3 class="text-white font-semibold">Pareto-Diagramm · ABC-Klassifikation</h3>
        <p class="text-slate-500 text-xs mt-0.5">Aktualisiert sich automatisch bei Tabellenänderungen</p>
      </div>
      <div class="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-rose-400/80 inline-block ring-1 ring-rose-400/40"></span>A-Artikel
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-amber-400/80 inline-block ring-1 ring-amber-400/40"></span>B-Artikel
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-3 h-3 rounded bg-slate-400/60 inline-block ring-1 ring-slate-400/30"></span>C-Artikel
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-5 h-0.5 rounded-full bg-accent-400 inline-block"></span>Kum. %
        </span>
      </div>
    </div>

    <!-- Zone markers -->
    <div class="relative px-6 pt-3 pb-1 flex gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
        A-Zone · ~70%
      </span>
      <span class="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
        B-Zone · 70–90%
      </span>
      <span class="px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 font-medium">
        C-Zone · 90–100%
      </span>
    </div>

    <div class="px-6 pb-6" style="height: 360px;">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>
