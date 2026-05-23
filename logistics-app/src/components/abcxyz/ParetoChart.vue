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

const barColors = computed(() =>
  store.enriched.map(p =>
    p.abc === 'A' ? 'rgba(251,113,133,0.8)' :
    p.abc === 'B' ? 'rgba(251,191,36,0.8)'  :
                    'rgba(148,163,184,0.6)',
  )
)

function buildChart() {
  if (!canvas.value) return
  if (chartInstance) chartInstance.destroy()

  const labels    = store.enriched.map(p => p.name.split(' ')[0])
  const barValues = store.enriched.map(p => p.totalValue)
  const lineVals  = store.enriched.map(p => p.cumPct)

  chartInstance = new Chart(canvas.value, {
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Verbrauchswert (€)',
          data: barValues,
          backgroundColor: barColors.value,
          borderRadius: 6,
          yAxisID: 'y',
          order: 2,
        },
        {
          type: 'line',
          label: 'Kumulierter Anteil (%)',
          data: lineVals,
          borderColor: 'rgba(56,189,248,1)',
          backgroundColor: 'rgba(56,189,248,0.1)',
          borderWidth: 2.5,
          pointBackgroundColor: 'rgba(56,189,248,1)',
          pointRadius: 4,
          fill: false,
          tension: 0.3,
          yAxisID: 'y1',
          order: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { size: 12 } },
        },
        tooltip: {
          backgroundColor: 'rgba(15,23,42,0.95)',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#f1f5f9',
          bodyColor: '#94a3b8',
          padding: 12,
          callbacks: {
            label(ctx) {
              if (ctx.datasetIndex === 0)
                return ` ${new Intl.NumberFormat('de-DE').format(ctx.raw)} €`
              return ` ${ctx.raw.toFixed(1)} %`
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b', font: { size: 11 }, maxRotation: 45 },
          grid:  { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          position: 'left',
          ticks: {
            color: '#64748b', font: { size: 11 },
            callback: v => new Intl.NumberFormat('de-DE', { notation: 'compact' }).format(v),
          },
          grid: { color: 'rgba(255,255,255,0.04)' },
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
  <div class="glass rounded-2xl border border-white/10 overflow-hidden">
    <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
      <div>
        <h3 class="text-white font-semibold">Pareto-Diagramm · ABC-Klassifikation</h3>
        <p class="text-slate-500 text-xs mt-0.5">Aktualisiert sich automatisch bei Tabellenänderungen</p>
      </div>
      <div class="flex items-center gap-4 text-xs">
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-rose-400/80 inline-block"></span>A-Artikel</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-amber-400/80 inline-block"></span>B-Artikel</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded bg-slate-400/60 inline-block"></span>C-Artikel</span>
        <span class="flex items-center gap-1.5"><span class="w-3 h-0.5 rounded bg-accent-400 inline-block"></span>Kum. %</span>
      </div>
    </div>
    <div class="p-6" style="height: 380px;">
      <canvas ref="canvas"></canvas>
    </div>
  </div>
</template>
