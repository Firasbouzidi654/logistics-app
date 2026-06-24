<script setup>
import { computed } from 'vue'
import { useMakeOrBuyStore } from '../../stores/makeorbuy'
import CostComparisonChart from './CostComparisonChart.vue'

const store = useMakeOrBuyStore()
const formatCurrency = value => new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
}).format(value)
const formatNumber = value => new Intl.NumberFormat('en-GB').format(value)
const recommendationLabel = value => ({ make: 'MAKE', buy: 'BUY', 'break-even': 'BREAK-EVEN' })[value]
const recommendationColor = value => ({
  make: 'text-emerald-400',
  buy: 'text-accent-400',
  'break-even': 'text-amber-400',
})[value]

const highestTotal = computed(() => Math.max(store.supplierTotal, store.internalTotal, 1))
const buyBarWidth = computed(() => (store.supplierTotal / highestTotal.value) * 100)
const makeBarWidth = computed(() => (store.internalTotal / highestTotal.value) * 100)
const riskLevel = computed(() =>
  store.selectedSupplier.quality >= 8 && store.selectedSupplier.leadTime <= 7 ? 'Low' : 'Medium',
)
const confidence = computed(() =>
  store.savingsPercentage >= 10 ? 'High' : store.savingsPercentage >= 3 ? 'Medium' : 'Low',
)
const breakEvenStatus = computed(() => {
  if (store.recommendation === 'break-even') return 'Both options have the same total cost.'
  if (store.recommendation === 'make') {
    return store.breakEvenQuantity !== null && store.quantity >= store.breakEvenQuantity
      ? 'Production volume justifies internal manufacturing.'
      : 'Internal manufacturing is currently cost-effective.'
  }
  return store.breakEvenQuantity !== null
    ? 'Current quantity is below the break-even point.'
    : 'Supplier procurement remains more cost-effective.'
})
const justification = computed(() => {
  if (store.recommendation === 'make') {
    return [
      'Lower total cost for the selected quantity',
      `Significant savings (${formatCurrency(store.totalSavings)})`,
      'Better long-term profitability',
      'Internal production is economically justified',
    ]
  }
  if (store.recommendation === 'buy') {
    return [
      'Lower total cost for the selected quantity',
      `Significant savings (${formatCurrency(store.totalSavings)})`,
      'No production setup investment is required',
      'Supplier procurement is economically justified',
    ]
  }
  return ['Both options have the same total cost', 'Additional qualitative criteria should guide the decision']
})
const procurementInsight = computed(() => {
  if (store.recommendation === 'make') {
    return 'For quantities above the current level, internal production remains the preferred option due to lower unit costs and higher cost efficiency.'
  }
  if (store.recommendation === 'buy') {
    return 'For quantities below the break-even point, supplier procurement remains the preferred option because it avoids setup costs.'
  }
  return 'At the break-even point, qualitative factors such as capacity, quality, and flexibility guide the decision.'
})
</script>

<template>
  <div class="space-y-6">
    <div class="grid lg:grid-cols-5 gap-6">
      <section class="lg:col-span-3 glass rounded-2xl border border-white/10 p-6">
        <div class="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 class="text-xl font-bold text-white">Procurement decision</h2>
            <p class="text-sm text-slate-400 mt-1">Compare the selected supplier quote with the internal production cost.</p>
          </div>
          <span class="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">Live calculation</span>
        </div>

        <div class="grid sm:grid-cols-2 gap-5">
          <label>
            <span class="block text-sm font-medium text-slate-300 mb-2">Product</span>
            <select :value="store.selectedProductId" class="dashboard-input" @change="store.selectProduct($event.target.value)">
              <option v-for="product in store.products" :key="product.id" :value="product.id">
                {{ product.name }} · {{ product.sku }}
              </option>
            </select>
          </label>

          <label>
            <span class="block text-sm font-medium text-slate-300 mb-2">Selected Supplier</span>
            <select :value="store.selectedSupplierId" class="dashboard-input" @change="store.selectSupplier($event.target.value)">
              <option v-for="supplier in store.suppliers" :key="supplier.id" :value="supplier.id">
                {{ supplier.name }} · {{ formatCurrency(supplier.price) }}/unit
              </option>
            </select>
          </label>

          <label>
            <span class="block text-sm font-medium text-slate-300 mb-2">Quantity</span>
            <div class="relative">
              <input :value="store.quantity" type="number" min="1" class="dashboard-input pr-14" @input="store.setNumber('quantity', $event.target.value)">
              <span class="input-unit">units</span>
            </div>
          </label>

          <div>
            <span class="block text-sm font-medium text-slate-300 mb-2">Supplier Price</span>
            <div class="dashboard-input flex items-center justify-between">
              <span class="text-white font-semibold">{{ formatCurrency(store.supplierPrice) }}</span>
              <span class="text-xs text-slate-500">from {{ store.selectedSupplier.name }}</span>
            </div>
          </div>

          <label class="sm:col-span-2">
            <span class="block text-sm font-medium text-slate-300 mb-2">Internal production cost per unit</span>
            <div class="relative">
              <input :value="store.internalCost" type="number" min="0" step="1" class="dashboard-input pr-12" @input="store.setNumber('internalCost', $event.target.value)">
              <span class="input-unit">€/unit</span>
            </div>
          </label>

          <label class="sm:col-span-2">
            <span class="block text-sm font-medium text-slate-300 mb-2">Production Setup Cost (€)</span>
            <div class="relative">
              <input :value="store.productionSetupCost" type="number" min="0" step="1000" class="dashboard-input pr-12" @input="store.setNumber('productionSetupCost', $event.target.value)">
              <span class="input-unit">€</span>
            </div>
            <span class="block text-xs text-slate-500 mt-2">One-time tooling, preparation, and production start-up cost.</span>
          </label>
        </div>

        <section class="mt-6 pt-5 border-t border-white/10">
          <div class="flex items-center justify-between gap-3 mb-4">
            <h3 class="text-sm font-semibold text-white">Calculation Breakdown</h3>
            <span class="text-xs text-slate-500">Based on current inputs</span>
          </div>
          <div class="grid md:grid-cols-3 gap-3">
            <article class="rounded-xl border border-accent-500/20 bg-accent-500/[0.06] p-3">
              <p class="text-xs font-semibold text-accent-300">Buy Cost Formula</p>
              <p class="text-slate-400 text-xs mt-2">Supplier Price × Quantity</p>
              <p class="text-slate-200 text-xs mt-2 leading-relaxed">
                {{ formatCurrency(store.supplierPrice) }} × {{ formatNumber(store.quantity) }} =
                <span class="font-bold text-white">{{ formatCurrency(store.supplierTotal) }}</span>
              </p>
            </article>

            <article class="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3">
              <p class="text-xs font-semibold text-emerald-300">Make Cost Formula</p>
              <p class="text-slate-400 text-xs mt-2">Internal Cost × Quantity + Setup Cost</p>
              <p class="text-slate-200 text-xs mt-2 leading-relaxed">
                {{ formatCurrency(store.internalCost) }} × {{ formatNumber(store.quantity) }} + {{ formatCurrency(store.productionSetupCost) }} =
                <span class="font-bold text-white">{{ formatCurrency(store.internalTotal) }}</span>
              </p>
            </article>

            <article class="rounded-xl border border-rose-500/20 bg-rose-500/[0.06] p-3">
              <p class="text-xs font-semibold text-rose-300">Savings Formula</p>
              <p class="text-slate-400 text-xs mt-2">
                {{ store.recommendation === 'buy' ? 'Make Cost − Buy Cost' : 'Buy Cost − Make Cost' }}
              </p>
              <p class="text-slate-200 text-xs mt-2 leading-relaxed">
                {{ store.recommendation === 'buy' ? formatCurrency(store.internalTotal) : formatCurrency(store.supplierTotal) }} −
                {{ store.recommendation === 'buy' ? formatCurrency(store.supplierTotal) : formatCurrency(store.internalTotal) }} =
                <span class="font-bold text-white">{{ formatCurrency(store.totalSavings) }}</span>
              </p>
            </article>
          </div>
          <p class="mt-4 text-xs text-slate-400 leading-relaxed">
            <span class="text-rose-300 font-semibold">Decision Logic:</span>
            If Make Cost is lower than Buy Cost, the dashboard recommends MAKE. Otherwise, it recommends BUY. Equal total costs result in BREAK-EVEN.
          </p>
        </section>
      </section>

      <aside
        :class="[
          'lg:col-span-2 rounded-2xl border p-6 flex flex-col justify-between',
          store.recommendation === 'make'
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : store.recommendation === 'buy'
              ? 'bg-accent-500/10 border-accent-500/30'
              : 'bg-amber-500/10 border-amber-500/30',
        ]"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Recommendation</p>
          <h2 :class="['text-3xl font-black mt-2', recommendationColor(store.recommendation)]">
            {{ recommendationLabel(store.recommendation) }}
          </h2>
          <p class="text-slate-300 text-sm leading-relaxed mt-3">
            <template v-if="store.recommendation === 'make'">
              MAKE is {{ store.savingsPercentage.toFixed(1) }}% cheaper than BUY for the selected quantity.
            </template>
            <template v-else-if="store.recommendation === 'buy'">
              BUY is {{ store.savingsPercentage.toFixed(1) }}% cheaper than MAKE for the selected quantity.
            </template>
            <template v-else>Both options have the same total cost.</template>
          </p>
          <p class="text-slate-400 text-xs mt-3">
            Compared against: <span class="text-white font-semibold">{{ store.selectedSupplier.name }} ({{ formatCurrency(store.supplierPrice) }}/unit)</span>
          </p>
        </div>
        <section class="mt-5 rounded-xl border border-white/10 bg-surface-900/25 p-4">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Decision Analysis</p>
          <div class="grid grid-cols-2 gap-x-4 gap-y-3 mt-3 text-xs">
            <div>
              <p class="text-slate-500">Quantity</p>
              <p class="text-white font-bold mt-1">{{ formatNumber(store.quantity) }} units</p>
            </div>
            <div>
              <p class="text-slate-500">Cost Difference</p>
              <p class="text-white font-bold mt-1">{{ formatCurrency(store.totalSavings) }}</p>
            </div>
            <div>
              <p class="text-slate-500">Cost Advantage</p>
              <p :class="['font-bold mt-1', recommendationColor(store.recommendation)]">{{ store.savingsPercentage.toFixed(1) }}%</p>
            </div>
            <div>
              <p class="text-slate-500">Risk Level</p>
              <p :class="['font-bold mt-1', riskLevel === 'Low' ? 'text-emerald-400' : 'text-amber-400']">{{ riskLevel }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-slate-500">Break-Even Status</p>
              <p class="text-slate-200 font-medium mt-1 leading-relaxed">{{ breakEvenStatus }}</p>
            </div>
            <div class="col-span-2">
              <p class="text-slate-500">Confidence</p>
              <p :class="['font-bold mt-1', confidence === 'High' ? 'text-emerald-400' : confidence === 'Medium' ? 'text-amber-400' : 'text-slate-300']">{{ confidence }}</p>
            </div>
          </div>
        </section>

        <section class="mt-4 space-y-3">
          <div>
            <div class="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span class="text-slate-300 font-medium">Buy Cost</span>
              <span class="text-accent-300 font-bold">{{ formatCurrency(store.supplierTotal) }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-surface-800 overflow-hidden">
              <div class="h-full rounded-full bg-accent-400 transition-all duration-500" :style="{ width: buyBarWidth + '%' }"></div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-between gap-3 text-xs mb-1.5">
              <span class="text-slate-300 font-medium">Make Cost</span>
              <span class="text-emerald-300 font-bold">{{ formatCurrency(store.internalTotal) }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-surface-800 overflow-hidden">
              <div class="h-full rounded-full bg-emerald-400 transition-all duration-500" :style="{ width: makeBarWidth + '%' }"></div>
            </div>
          </div>
        </section>

        <div class="mt-5 pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
          <div>
            <p class="text-slate-400 text-xs">Total Buy Cost</p>
            <p class="text-white font-bold mt-1">{{ formatCurrency(store.supplierTotal) }}</p>
          </div>
          <div>
            <p class="text-slate-400 text-xs">Total Make Cost</p>
            <p class="text-white font-bold mt-1">{{ formatCurrency(store.internalTotal) }}</p>
          </div>
          <div class="col-span-2 pt-3 border-t border-white/10">
            <p class="text-slate-400 text-xs">Estimated Savings</p>
            <p class="text-2xl text-white font-black mt-1">{{ formatCurrency(store.totalSavings) }}</p>
            <p class="text-slate-400 text-xs mt-1">Savings Percentage: {{ store.savingsPercentage.toFixed(1) }}%</p>
          </div>
        </div>

        <section :class="['mt-4 rounded-xl border p-4', store.recommendation === 'make' ? 'bg-emerald-500/[0.08] border-emerald-500/20' : store.recommendation === 'buy' ? 'bg-accent-500/[0.08] border-accent-500/20' : 'bg-amber-500/[0.08] border-amber-500/20']">
          <h3 :class="['font-bold text-sm', recommendationColor(store.recommendation)]">Why {{ recommendationLabel(store.recommendation) }}?</h3>
          <ul class="space-y-1.5 mt-3">
            <li v-for="reason in justification" :key="reason" class="flex gap-2 text-xs text-slate-200 leading-relaxed">
              <span :class="['mt-1.5 h-1.5 w-1.5 rounded-full flex-none', store.recommendation === 'make' ? 'bg-emerald-400' : store.recommendation === 'buy' ? 'bg-accent-400' : 'bg-amber-400']"></span>
              <span>{{ reason }}</span>
            </li>
          </ul>
        </section>

        <p class="mt-4 text-xs text-slate-400 leading-relaxed">
          <span class="text-rose-300 font-semibold">Procurement Insight:</span>
          {{ procurementInsight }}
        </p>
      </aside>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <div class="glass rounded-xl border border-white/10 p-5">
        <p class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Selected product</p>
        <p class="text-white font-bold mt-2">{{ store.selectedProduct.name }}</p>
        <p class="text-slate-500 text-sm mt-1">SKU: {{ store.selectedProduct.sku }}</p>
      </div>
      <div class="glass rounded-xl border border-white/10 p-5">
        <p class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Buy total</p>
        <p class="text-accent-400 text-2xl font-black mt-2">{{ formatCurrency(store.supplierTotal) }}</p>
        <p class="text-slate-500 text-sm mt-1">{{ formatNumber(store.quantity) }} units from {{ store.selectedSupplier.name }}</p>
      </div>
      <div class="glass rounded-xl border border-white/10 p-5">
        <p class="text-xs uppercase tracking-wider text-slate-500 font-semibold">Make total</p>
        <p class="text-emerald-400 text-2xl font-black mt-2">{{ formatCurrency(store.internalTotal) }}</p>
        <p class="text-slate-500 text-sm mt-1">{{ formatNumber(store.quantity) }} units produced internally</p>
      </div>
    </div>

    <CostComparisonChart />

    <section class="glass rounded-2xl border border-white/10 p-6 bg-gradient-to-r from-rose-500/[0.07] to-transparent">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-rose-300">Key Insight</p>
      <div class="grid md:grid-cols-3 gap-5 mt-4">
        <div>
          <p class="text-slate-500 text-sm">Current Quantity</p>
          <p class="text-white text-2xl font-black mt-1">{{ formatNumber(store.quantity) }} units</p>
        </div>
        <div>
          <p class="text-slate-500 text-sm">Decision</p>
          <p :class="['text-2xl font-black mt-1', recommendationColor(store.recommendation)]">
            <template v-if="store.recommendation === 'break-even'">Both options have the same total cost</template>
            <template v-else>{{ recommendationLabel(store.recommendation) }} is {{ store.savingsPercentage.toFixed(1) }}% cheaper</template>
          </p>
        </div>
        <div>
          <p class="text-slate-500 text-sm">Estimated Savings</p>
          <p class="text-white text-2xl font-black mt-1">{{ formatCurrency(store.totalSavings) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-input { @apply w-full rounded-xl border border-white/10 bg-surface-800/80 px-4 py-3 text-white outline-none transition focus:border-rose-400/60 focus:ring-2 focus:ring-rose-400/10; }
.input-unit { @apply absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500 pointer-events-none; }
</style>
