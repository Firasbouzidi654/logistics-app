<script setup>
import { ref } from 'vue'
import { useMakeOrBuyStore } from '../../stores/makeorbuy'
import { exportSupplierComparisonPDF } from '../../composables/useSupplierComparisonExport'

const store = useMakeOrBuyStore()
const exporting = ref(false)
const currency = value => new Intl.NumberFormat('en-GB', {
  style: 'currency', currency: 'EUR', maximumFractionDigits: 0,
}).format(value)

async function exportPDF() {
  exporting.value = true
  try {
    await exportSupplierComparisonPDF()
  } finally {
    exporting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <section class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="p-6 border-b border-white/10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-white">Supplier comparison</h2>
          <p class="text-sm text-slate-400 mt-1">A concise comparison of price, delivery time, and quality.</p>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-2">
          <div class="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm">
            <span class="text-slate-400">Recommended Supplier:</span>
            <span class="text-emerald-400 font-bold ml-1">{{ store.recommendedSupplier.name }}</span>
          </div>
          <button
            class="px-3 py-2 rounded-xl border border-rose-500/25 bg-rose-500/10 text-rose-300 text-sm font-semibold transition hover:bg-rose-500/20 disabled:opacity-60"
            :disabled="exporting"
            @click="exportPDF"
          >{{ exporting ? 'PDF wird erstellt…' : '📄 Export Supplier Comparison PDF' }}</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[600px] text-sm">
          <thead class="bg-white/[0.03] text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th class="text-left font-semibold px-6 py-4">Supplier</th>
              <th class="text-right font-semibold px-6 py-4">Price</th>
              <th class="text-right font-semibold px-6 py-4">Delivery Time</th>
              <th class="text-right font-semibold px-6 py-4">Quality</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="supplier in store.suppliers"
              :key="supplier.id"
              :class="supplier.id === store.recommendedSupplier.id ? 'bg-emerald-500/[0.07]' : 'border-t border-white/[0.06]'"
            >
              <td class="px-6 py-5 text-white font-semibold">{{ supplier.name }}</td>
              <td class="px-6 py-5 text-right text-white">{{ currency(supplier.price) }}</td>
              <td class="px-6 py-5 text-right text-slate-300">{{ supplier.leadTime }} days</td>
              <td class="px-6 py-5 text-right">
                <span class="inline-flex min-w-14 justify-center px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 font-bold">{{ supplier.quality }}/10</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="grid md:grid-cols-3 gap-4">
      <div class="glass rounded-xl border border-white/10 p-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Fastest Delivery</p>
        <p class="text-white font-bold mt-2">{{ store.fastestSupplier.name }}</p>
        <p class="text-accent-400 text-sm mt-1">{{ store.fastestSupplier.leadTime }} days</p>
      </div>
      <div class="glass rounded-xl border border-white/10 p-5">
        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Lowest Price</p>
        <p class="text-white font-bold mt-2">{{ store.bestPriceSupplier.name }}</p>
        <p class="text-emerald-400 text-sm mt-1">{{ currency(store.bestPriceSupplier.price) }}</p>
      </div>
      <div class="glass rounded-xl border border-emerald-500/20 p-5 bg-emerald-500/[0.05]">
        <p class="text-xs font-semibold uppercase tracking-wider text-emerald-400">Best Overall Supplier</p>
        <p class="text-white font-bold mt-2">{{ store.recommendedSupplier.name }}</p>
        <p class="text-slate-400 text-sm leading-relaxed mt-1">Good balance of price, delivery reliability and quality.</p>
      </div>
    </div>
  </div>
</template>
