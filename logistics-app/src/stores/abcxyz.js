import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const RAW_PRODUCTS = [
  { id: 1, name: 'Hydraulikpumpe H-200',       value: 48500, demand: 12 },
  { id: 2, name: 'Steuerventil SV-40',          value: 32800, demand: 8  },
  { id: 3, name: 'Lagergehäuse LG-110',         value: 21200, demand: 45 },
  { id: 4, name: 'Antriebswelle AW-88',         value: 18700, demand: 31 },
  { id: 5, name: 'Dichtungsset DS-04',          value: 9200,  demand: 120},
  { id: 6, name: 'Flanschverbindung FV-22',     value: 7400,  demand: 67 },
  { id: 7, name: 'Kühlkörper KK-55',            value: 5800,  demand: 89 },
  { id: 8, name: 'Keilriemen KB-14',            value: 2300,  demand: 210},
  { id: 9, name: 'Schraubensatz SC-99',         value: 1100,  demand: 380},
  { id: 10,'name': 'Schmiermittel SM-05',       value: 800,   demand: 500},
]

export const useABCXYZStore = defineStore('abcxyz', () => {
  const products = ref(RAW_PRODUCTS.map(p => ({ ...p })))

  const totalValue = computed(() =>
    products.value.reduce((sum, p) => sum + p.value * p.demand, 0)
  )

  const enriched = computed(() => {
    const sorted = [...products.value]
      .map(p => ({ ...p, totalValue: p.value * p.demand }))
      .sort((a, b) => b.totalValue - a.totalValue)

    let cumulative = 0
    return sorted.map(p => {
      cumulative += p.totalValue
      const pct = (p.totalValue / totalValue.value) * 100
      const cumPct = (cumulative / totalValue.value) * 100
      const abc = cumPct <= 70 ? 'A' : cumPct <= 90 ? 'B' : 'C'
      return { ...p, pct: +pct.toFixed(2), cumPct: +cumPct.toFixed(2), abc }
    })
  })

  function updateProduct(id, field, val) {
    const p = products.value.find(x => x.id === id)
    if (p) p[field] = +val || 0
  }

  return { products, enriched, totalValue, updateProduct }
})
