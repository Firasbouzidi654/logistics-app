import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const PRODUCTS = [
  { id: 'motor', name: 'Drive Motor DM-200', sku: 'DM-200', internalCost: 110, setupCost: 100000 },
  { id: 'sensor', name: 'LiDAR Sensor LS-40', sku: 'LS-40', internalCost: 110, setupCost: 50000 },
  { id: 'battery', name: 'Battery Pack BP-24', sku: 'BP-24', internalCost: 52, setupCost: 20000 },
]

export const useMakeOrBuyStore = defineStore('makeorbuy', () => {
  const products = ref(PRODUCTS)
  const selectedProductId = ref('motor')
  const selectedSupplierId = ref('siemens')
  const quantity = ref(3000)
  const internalCost = ref(110)
  const productionSetupCost = ref(100000)

  const suppliers = ref([
    { id: 'siemens', name: 'Siemens', location: 'Munich, DE', price: 210, leadTime: 5, quality: 9 },
    { id: 'bosch', name: 'Bosch', location: 'Stuttgart, DE', price: 200, leadTime: 3, quality: 10 },
    { id: 'abb', name: 'ABB', location: 'Zurich, CH', price: 205, leadTime: 7, quality: 8 },
  ])

  const selectedProduct = computed(() =>
    products.value.find(product => product.id === selectedProductId.value) ?? products.value[0]
  )
  const selectedSupplier = computed(() =>
    suppliers.value.find(supplier => supplier.id === selectedSupplierId.value) ?? suppliers.value[0]
  )
  const supplierPrice = computed(() => selectedSupplier.value.price)
  const supplierTotal = computed(() => quantity.value * supplierPrice.value)
  const internalTotal = computed(() => productionSetupCost.value + quantity.value * internalCost.value)
  const recommendation = computed(() => {
    if (supplierTotal.value < internalTotal.value) return 'buy'
    if (internalTotal.value < supplierTotal.value) return 'make'
    return 'break-even'
  })
  const totalSavings = computed(() => Math.abs(supplierTotal.value - internalTotal.value))
  const savingsPercentage = computed(() => {
    const referenceCost = Math.max(supplierTotal.value, internalTotal.value)
    return referenceCost > 0 ? (totalSavings.value / referenceCost) * 100 : 0
  })

  function supplierScore(supplier) {
    const priceScore = supplier.price <= 150 ? 10 : supplier.price <= 155 ? 7 : 4
    const deliveryScore = supplier.leadTime <= 3 ? 10 : supplier.leadTime <= 5 ? 8 : 6
    return priceScore * 0.4 + deliveryScore * 0.3 + supplier.quality * 0.3
  }

  const recommendedSupplier = computed(() =>
    [...suppliers.value].sort((a, b) => supplierScore(b) - supplierScore(a))[0]
  )
  const bestPriceSupplier = computed(() =>
    [...suppliers.value].sort((a, b) => a.price - b.price)[0]
  )
  const fastestSupplier = computed(() =>
    [...suppliers.value].sort((a, b) => a.leadTime - b.leadTime)[0]
  )
  const breakEvenQuantity = computed(() => {
    const unitSaving = supplierPrice.value - internalCost.value
    return unitSaving > 0 ? Math.ceil(productionSetupCost.value / unitSaving) : null
  })
  const chartQuantities = computed(() => {
    const referenceQuantity = Math.max(quantity.value, breakEvenQuantity.value ?? 0)
    const maximum = Math.max(Math.ceil(referenceQuantity * 1.25 / 100) * 100, 100)
    return Array.from({ length: 7 }, (_, index) => Math.round((maximum / 6) * index))
  })

  function selectProduct(id) {
    const product = products.value.find(item => item.id === id)
    if (!product) return
    selectedProductId.value = id
    internalCost.value = product.internalCost
    productionSetupCost.value = product.setupCost
  }

  function selectSupplier(id) {
    if (suppliers.value.some(supplier => supplier.id === id)) {
      selectedSupplierId.value = id
    }
  }

  function setNumber(field, value) {
    const number = Math.max(0, Number(value) || 0)
    if (field === 'quantity') quantity.value = number
    if (field === 'internalCost') internalCost.value = number
    if (field === 'productionSetupCost') productionSetupCost.value = number
  }

  return {
    products,
    selectedProductId,
    selectedSupplierId,
    quantity,
    internalCost,
    productionSetupCost,
    suppliers,
    selectedProduct,
    selectedSupplier,
    supplierPrice,
    supplierTotal,
    internalTotal,
    recommendation,
    totalSavings,
    savingsPercentage,
    recommendedSupplier,
    bestPriceSupplier,
    fastestSupplier,
    chartQuantities,
    breakEvenQuantity,
    selectProduct,
    selectSupplier,
    setNumber,
  }
})
