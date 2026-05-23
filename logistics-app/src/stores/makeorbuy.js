import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// ── Scenario: Elektrische Antriebseinheit EA-300 ──────────────────────────
// Company: LogiTech Fertigungs GmbH  |  Supplier: Siemens AG Industrial Drive

const INITIAL_CRITERIA = [
  { id: 1, label: 'Kosteneffizienz',       description: 'Gesamtkosten bei Planmenge',     weight: 25, makeScore: 6, buyScore: 8 },
  { id: 2, label: 'Qualitätskontrolle',    description: 'Einfluss auf Produktqualität',    weight: 20, makeScore: 9, buyScore: 6 },
  { id: 3, label: 'Flexibilität',          description: 'Reaktion auf Bedarfsänderungen',  weight: 15, makeScore: 8, buyScore: 5 },
  { id: 4, label: 'Lieferzeit',            description: 'Durchlaufzeit bis Verfügbarkeit', weight: 15, makeScore: 7, buyScore: 8 },
  { id: 5, label: 'Strategische Bedeutung',description: 'Know-how & Kernkompetenz',        weight: 10, makeScore: 9, buyScore: 4 },
  { id: 6, label: 'Skalierbarkeit',        description: 'Hochlauf bei steigender Menge',   weight: 10, makeScore: 5, buyScore: 9 },
  { id: 7, label: 'Lieferantenrisiko',     description: 'Abhängigkeit & Ausfallrisiko',    weight:  5, makeScore: 9, buyScore: 4 },
]

export const useMakeOrBuyStore = defineStore('makeorbuy', () => {

  // ── Editable parameters ──────────────────────────────────────────────────
  const params = ref({
    fixedCosts:          180_000,   // € Einmalig: Maschinen, Werkzeuge, Setup
    materialCostPerUnit:  58,        // € Materialkosten/Stück
    laborCostPerUnit:     48,        // € Arbeitskosten/Stück
    machineCostPerUnit:   39,        // € Maschinenkosten/Stück
    supplierPrice:        210,       // € Lieferantenpreis/Stück (Siemens AG)
    quantity:           2_000,       // Stück/Jahr Planmenge
    supplierRisk:          62,       // Risiko-Score 0–100 (höher = riskanter)
    capacityUsage:         78,       // % aktuelle Kapazitätsauslastung
  })

  const criteria = ref(INITIAL_CRITERIA.map(c => ({ ...c })))

  // ── Derived financial computations ───────────────────────────────────────
  const variableCostPerUnit = computed(() =>
    params.value.materialCostPerUnit +
    params.value.laborCostPerUnit +
    params.value.machineCostPerUnit
  )

  const makeTotalCost = computed(() =>
    params.value.fixedCosts + variableCostPerUnit.value * params.value.quantity
  )

  const buyTotalCost = computed(() =>
    params.value.supplierPrice * params.value.quantity
  )

  const costDiff = computed(() => buyTotalCost.value - makeTotalCost.value)   // positive → Make cheaper

  const breakEvenQty = computed(() => {
    const diff = params.value.supplierPrice - variableCostPerUnit.value
    return diff > 0 ? Math.ceil(params.value.fixedCosts / diff) : null
  })

  const costWinner = computed(() => makeTotalCost.value <= buyTotalCost.value ? 'make' : 'buy')

  // ── Criteria weighting ───────────────────────────────────────────────────
  const totalWeight = computed(() => criteria.value.reduce((s, c) => s + c.weight, 0))

  const weightedMakeScore = computed(() =>
    +(criteria.value.reduce((s, c) => s + (c.makeScore * c.weight), 0) / totalWeight.value).toFixed(2)
  )
  const weightedBuyScore = computed(() =>
    +(criteria.value.reduce((s, c) => s + (c.buyScore  * c.weight), 0) / totalWeight.value).toFixed(2)
  )
  const qualityWinner = computed(() =>
    weightedMakeScore.value >= weightedBuyScore.value ? 'make' : 'buy'
  )

  // ── Overall recommendation (cost 60% + quality 40%) ─────────────────────
  const overallRecommendation = computed(() => {
    const costScore  = costWinner.value   === 'make' ? 1 : 0
    const qualScore  = qualityWinner.value === 'make' ? 1 : 0
    const combined   = costScore * 0.6 + qualScore * 0.4
    if (combined >= 0.5) return 'make'
    if (combined <= 0.4) return 'buy'
    return 'neutral'
  })

  const confidence = computed(() => {
    const costGap  = Math.abs(costDiff.value) / Math.max(makeTotalCost.value, buyTotalCost.value) * 100
    const qualGap  = Math.abs(weightedMakeScore.value - weightedBuyScore.value) / 10 * 100
    return Math.min(95, Math.round((costGap * 0.5 + qualGap * 0.5)))
  })

  // ── Break-even chart series (0 … 2× planmenge or 5 000) ─────────────────
  const breakevenSeries = computed(() => {
    const max    = Math.max(params.value.quantity * 2, 5000)
    const steps  = 20
    const step   = Math.round(max / steps)
    return Array.from({ length: steps + 1 }, (_, i) => {
      const qty = i * step
      return {
        qty,
        make: params.value.fixedCosts + variableCostPerUnit.value * qty,
        buy:  params.value.supplierPrice * qty,
      }
    })
  })

  // ── Grouped comparison at key quantities ─────────────────────────────────
  const comparisonLevels = computed(() => {
    const levels = [500, 1000, 1500, 2000, 3000, 4000, 5000]
    return levels.map(qty => ({
      qty,
      make: params.value.fixedCosts + variableCostPerUnit.value * qty,
      buy:  params.value.supplierPrice * qty,
    }))
  })

  // ── Mutations ────────────────────────────────────────────────────────────
  function setParam(key, val) {
    params.value[key] = +val || 0
  }
  function setCriteria(id, field, val) {
    const c = criteria.value.find(c => c.id === id)
    if (c) c[field] = field === 'label' || field === 'description' ? val : +val || 0
  }

  return {
    params, criteria,
    variableCostPerUnit, makeTotalCost, buyTotalCost, costDiff, breakEvenQty,
    costWinner, weightedMakeScore, weightedBuyScore, qualityWinner,
    overallRecommendation, confidence, totalWeight,
    breakevenSeries, comparisonLevels,
    setParam, setCriteria,
  }
})
