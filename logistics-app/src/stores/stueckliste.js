import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const INITIAL_ITEMS = [
  { id: 'BOM-001', name: 'Elektromotor DC 48V',       group: 'Antrieb',   qty: 2, unitCost: 185,  supplier: 'Maxon Motor AG',    stock: 'in_stock',    leadTime: 14 },
  { id: 'BOM-002', name: 'Motorsteuerung MCU-32',      group: 'Antrieb',   qty: 2, unitCost: 120,  supplier: 'Texas Instruments', stock: 'in_stock',    leadTime: 21 },
  { id: 'BOM-003', name: 'Antriebsriemen GT2',         group: 'Antrieb',   qty: 4, unitCost: 12,   supplier: 'Gates Rubber Co.',  stock: 'in_stock',    leadTime: 7  },
  { id: 'BOM-004', name: 'LiDAR-Sensor 360°',          group: 'Sensorik',  qty: 1, unitCost: 890,  supplier: 'SICK AG',           stock: 'low_stock',   leadTime: 35 },
  { id: 'BOM-005', name: 'Ultraschall-Sensor HC-SR04', group: 'Sensorik',  qty: 4, unitCost: 8,    supplier: 'SparkFun Electronics', stock: 'in_stock', leadTime: 5  },
  { id: 'BOM-006', name: 'Compute Module CM4',         group: 'Steuerung', qty: 1, unitCost: 250,  supplier: 'Raspberry Pi Ltd.', stock: 'low_stock',   leadTime: 28 },
  { id: 'BOM-007', name: 'IMU-Modul MPU-6050',         group: 'Steuerung', qty: 1, unitCost: 18,   supplier: 'InvenSense',        stock: 'in_stock',    leadTime: 10 },
  { id: 'BOM-008', name: 'LiFePO4-Akku 48V/30Ah',     group: 'Energie',   qty: 1, unitCost: 620,  supplier: 'CATL Europe GmbH',  stock: 'out_of_stock',leadTime: 45 },
  { id: 'BOM-009', name: 'BMS-Laderegler 48V',         group: 'Energie',   qty: 1, unitCost: 95,   supplier: 'Daly Electronics',  stock: 'in_stock',    leadTime: 14 },
  { id: 'BOM-010', name: 'DC/DC-Wandler 48V→5V',       group: 'Energie',   qty: 2, unitCost: 35,   supplier: 'Mean Well',         stock: 'in_stock',    leadTime: 7  },
  { id: 'BOM-011', name: 'Aluminiumrahmen 6061-T6',    group: 'Mechanik',  qty: 1, unitCost: 320,  supplier: 'Bosch Rexroth AG',  stock: 'in_stock',    leadTime: 21 },
  { id: 'BOM-012', name: 'Kunststoffverkleidung ABS',  group: 'Mechanik',  qty: 1, unitCost: 145,  supplier: 'igus GmbH',         stock: 'in_stock',    leadTime: 14 },
  { id: 'BOM-013', name: 'Laufrollen Ø100mm',          group: 'Mechanik',  qty: 4, unitCost: 42,   supplier: 'Blickle GmbH',      stock: 'in_stock',    leadTime: 10 },
  { id: 'BOM-014', name: 'Kugellager 6202-2RS',        group: 'Mechanik',  qty: 8, unitCost: 5.5,  supplier: 'SKF Group',         stock: 'in_stock',    leadTime: 5  },
]

export const TREE = {
  id: 'FG-001', name: 'Autonomer Lagerroboter AR-200', qty: 1, type: 'product',
  children: [
    { id: 'SA-001', name: 'Antriebseinheit',      qty: 1, type: 'assembly', group: 'Antrieb',
      children: [
        { id: 'BOM-001', name: 'Elektromotor DC 48V',  qty: 2, type: 'component' },
        { id: 'BOM-002', name: 'Motorsteuerung MCU-32',qty: 2, type: 'component' },
        { id: 'BOM-003', name: 'Antriebsriemen GT2',   qty: 4, type: 'component' },
      ]},
    { id: 'SA-002', name: 'Sensorik & Steuerung', qty: 1, type: 'assembly', group: 'Sensorik',
      children: [
        { id: 'BOM-004', name: 'LiDAR-Sensor 360°',         qty: 1, type: 'component' },
        { id: 'BOM-005', name: 'Ultraschall-Sensor HC-SR04', qty: 4, type: 'component' },
        { id: 'BOM-006', name: 'Compute Module CM4',         qty: 1, type: 'component' },
        { id: 'BOM-007', name: 'IMU-Modul MPU-6050',         qty: 1, type: 'component' },
      ]},
    { id: 'SA-003', name: 'Energieversorgung',    qty: 1, type: 'assembly', group: 'Energie',
      children: [
        { id: 'BOM-008', name: 'LiFePO4-Akku 48V/30Ah', qty: 1, type: 'component' },
        { id: 'BOM-009', name: 'BMS-Laderegler 48V',     qty: 1, type: 'component' },
        { id: 'BOM-010', name: 'DC/DC-Wandler 48V→5V',   qty: 2, type: 'component' },
      ]},
    { id: 'SA-004', name: 'Gehäuse & Mechanik',   qty: 1, type: 'assembly', group: 'Mechanik',
      children: [
        { id: 'BOM-011', name: 'Aluminiumrahmen 6061-T6',   qty: 1, type: 'component' },
        { id: 'BOM-012', name: 'Kunststoffverkleidung ABS', qty: 1, type: 'component' },
        { id: 'BOM-013', name: 'Laufrollen Ø100mm',         qty: 4, type: 'component' },
        { id: 'BOM-014', name: 'Kugellager 6202-2RS',       qty: 8, type: 'component' },
      ]},
  ],
}

export const useStuecklisteStore = defineStore('stueckliste', () => {
  const items = ref(INITIAL_ITEMS.map(i => ({ ...i })))

  const enriched = computed(() =>
    items.value.map(i => ({ ...i, totalCost: +(i.qty * i.unitCost).toFixed(2) }))
  )

  const totalCost = computed(() =>
    enriched.value.reduce((s, i) => s + i.totalCost, 0)
  )

  const mostExpensive = computed(() =>
    enriched.value.reduce((a, b) => (b.totalCost > a.totalCost ? b : a), enriched.value[0])
  )

  const avgLeadTime = computed(() => {
    const avg = items.value.reduce((s, i) => s + i.leadTime, 0) / items.value.length
    return Math.round(avg)
  })

  const supplierCount = computed(() =>
    new Set(items.value.map(i => i.supplier)).size
  )

  const costByGroup = computed(() => {
    const map = {}
    enriched.value.forEach(i => { map[i.group] = (map[i.group] || 0) + i.totalCost })
    return map
  })

  const stockSummary = computed(() => ({
    in_stock:     items.value.filter(i => i.stock === 'in_stock').length,
    low_stock:    items.value.filter(i => i.stock === 'low_stock').length,
    out_of_stock: items.value.filter(i => i.stock === 'out_of_stock').length,
  }))

  const criticalComponents = computed(() =>
    stockSummary.value.low_stock + stockSummary.value.out_of_stock
  )

  const riskLevel = computed(() => {
    if (criticalComponents.value === 0) {
      return { label: 'Niedriges Risiko', tone: 'text-emerald-400', background: 'bg-emerald-500/10 border-emerald-500/25' }
    }
    if (criticalComponents.value <= 2) {
      return { label: 'Mittleres Risiko', tone: 'text-amber-400', background: 'bg-amber-500/10 border-amber-500/25' }
    }
    return { label: 'Hohes Risiko', tone: 'text-rose-400', background: 'bg-rose-500/10 border-rose-500/25' }
  })

  function updateItem(id, field, val) {
    const item = items.value.find(i => i.id === id)
    if (item) item[field] = field === 'qty' || field === 'unitCost' || field === 'leadTime'
      ? +val || 0
      : val
  }

  return {
    items, enriched, totalCost, mostExpensive, avgLeadTime, supplierCount, costByGroup,
    stockSummary, criticalComponents, riskLevel, updateItem,
  }
})
