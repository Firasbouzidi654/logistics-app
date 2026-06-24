<script setup>
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
        <div class="mt-7 pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
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
