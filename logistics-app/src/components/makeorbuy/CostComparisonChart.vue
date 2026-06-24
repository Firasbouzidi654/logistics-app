<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Chart, Filler, Legend, LineController, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js'
import { useMakeOrBuyStore } from '../../stores/makeorbuy'

Chart.register(LineController, LineElement, LinearScale, PointElement, Filler, Legend, Title, Tooltip)

const store = useMakeOrBuyStore()
const canvas = ref(null)
let chart = null

const breakEvenMarker = {
  id: 'breakEvenMarker',
  afterDatasetsDraw(chartInstance, _args, options) {
    const quantity = options.quantity
    if (quantity === null || quantity === undefined) return

    const { ctx, chartArea, scales } = chartInstance
    const position = scales.x.getPixelForValue(quantity)
    if (position < chartArea.left || position > chartArea.right) return

    ctx.save()
    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 1.5
    ctx.setLineDash([6, 5])
    ctx.beginPath()
    ctx.moveTo(position, chartArea.top)
    ctx.lineTo(position, chartArea.bottom)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = '#fcd34d'
    ctx.font = '600 11px Inter, sans-serif'
    ctx.fillText(`Break-even: ${Math.round(quantity).toLocaleString('en-GB')}`, position + 7, chartArea.top + 16)
    ctx.restore()
  },
}

function buildChart() {
  if (!canvas.value) return
  chart?.destroy()

  const quantities = store.chartQuantities
  chart = new Chart(canvas.value, {
    type: 'line',
    plugins: [breakEvenMarker],
    data: {
      datasets: [
        {
          label: 'Buy Cost',
          data: quantities.map(quantity => ({ x: quantity, y: quantity * store.supplierPrice })),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.12)',
          pointBackgroundColor: '#38bdf8',
          borderWidth: 3,
          tension: 0,
          fill: true,
        },
        {
          label: 'Make Cost',
          data: quantities.map(quantity => ({ x: quantity, y: store.productionSetupCost + quantity * store.internalCost })),
          borderColor: '#34d399',
          backgroundColor: 'rgba(52, 211, 153, 0.06)',
          pointBackgroundColor: '#34d399',
          borderWidth: 3,
          tension: 0,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        breakEvenMarker: { quantity: store.breakEvenQuantity },
        legend: { labels: { color: '#cbd5e1', usePointStyle: true, padding: 20 } },
        tooltip: {
          backgroundColor: '#172033',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          callbacks: {
            title: items => `Quantity: ${Math.round(items[0].parsed.x).toLocaleString('en-GB')} units`,
            label: context => ` ${context.dataset.label}: €${Math.round(context.parsed.y).toLocaleString('en-GB')}`,
          },
        },
      },
      scales: {
        x: {
          type: 'linear',
          title: { display: true, text: 'Quantity (units)', color: '#94a3b8', font: { weight: '600' } },
          ticks: { color: '#94a3b8', callback: value => Number(value).toLocaleString('en-GB') },
          grid: { color: 'rgba(255,255,255,0.04)' },
        },
        y: {
          title: { display: true, text: 'Total Cost (€)', color: '#94a3b8', font: { weight: '600' } },
          ticks: { color: '#94a3b8', callback: value => `€${Number(value).toLocaleString('en-GB')}` },
          grid: { color: 'rgba(255,255,255,0.07)' },
          beginAtZero: true,
        },
      },
    },
  })
}

onMounted(buildChart)
onBeforeUnmount(() => chart?.destroy())
watch(
  [() => store.quantity, () => store.supplierPrice, () => store.internalCost, () => store.productionSetupCost],
  buildChart,
)
</script>

<template>
  <section class="glass rounded-2xl border border-white/10 overflow-hidden">
    <div class="px-6 py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-white">Cost Comparison by Quantity</h2>
        <p class="text-sm text-slate-400 mt-1">Total procurement cost compared with internal production cost.</p>
      </div>
      <span
        v-if="store.breakEvenQuantity !== null"
        class="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold"
      >
        Break-even: {{ store.breakEvenQuantity.toLocaleString('en-GB') }} units
      </span>
      <span v-else class="px-3 py-1.5 rounded-lg bg-slate-500/10 border border-white/10 text-slate-400 text-xs font-bold">
        No break-even point
      </span>
    </div>
    <div class="p-5 sm:p-6 h-[330px] sm:h-[380px]">
      <canvas ref="canvas"></canvas>
    </div>
  </section>
</template>
