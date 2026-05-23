<script setup>
import { useMakeOrBuyStore } from '../../stores/makeorbuy'

const store = useMakeOrBuyStore()

function fmt(n) {
  return new Intl.NumberFormat('de-DE').format(Math.round(n))
}

const makeInputs = [
  { key: 'fixedCosts',          label: 'Fixkosten (Maschinen, Setup)',    unit: '€',       min: 0,    step: 5000   },
  { key: 'materialCostPerUnit', label: 'Materialkosten / Stück',          unit: '€/Stk',   min: 0,    step: 1      },
  { key: 'laborCostPerUnit',    label: 'Arbeitskosten / Stück',           unit: '€/Stk',   min: 0,    step: 1      },
  { key: 'machineCostPerUnit',  label: 'Maschinenkosten / Stück',         unit: '€/Stk',   min: 0,    step: 1      },
]
const scenarioInputs = [
  { key: 'supplierPrice',  label: 'Lieferantenpreis / Stück (Siemens AG)', unit: '€/Stk', min: 1,  step: 5  },
  { key: 'quantity',       label: 'Planmenge / Jahr',                       unit: 'Stk',   min: 100,step: 100},
  { key: 'supplierRisk',   label: 'Lieferantenrisiko-Score',                unit: '%',     min: 0,  step: 1, max: 100 },
  { key: 'capacityUsage',  label: 'Kapazitätsauslastung (aktuell)',          unit: '%',     min: 0,  step: 1, max: 100 },
]
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">

    <!-- Make parameters -->
    <div class="glass rounded-2xl border border-emerald-500/20 overflow-hidden">
      <div class="px-5 py-4 border-b border-white/8 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-emerald-400">
            <path d="M2 20h20M4 20V8l5 4V8l5 4V8l5 4V20"/>
          </svg>
        </div>
        <div>
          <h4 class="text-white font-semibold text-sm">Eigenfertigung (Make)</h4>
          <p class="text-slate-500 text-xs">Interne Produktionsparameter</p>
        </div>
        <div class="ml-auto text-right">
          <p class="text-xs text-slate-500">Var. Kosten/Stk</p>
          <p class="text-emerald-400 font-bold text-sm">{{ fmt(store.variableCostPerUnit) }} €</p>
        </div>
      </div>
      <div class="p-5 space-y-4">
        <div v-for="inp in makeInputs" :key="inp.key">
          <div class="flex justify-between mb-1.5">
            <label class="text-slate-300 text-xs font-medium">{{ inp.label }}</label>
            <span class="text-white font-semibold text-xs">
              {{ fmt(store.params[inp.key]) }} {{ inp.unit }}
            </span>
          </div>
          <input
            type="range"
            :min="inp.min ?? 0"
            :max="inp.max ?? (inp.key === 'fixedCosts' ? 500000 : inp.key === 'quantity' ? 10000 : 300)"
            :step="inp.step"
            :value="store.params[inp.key]"
            @input="store.setParam(inp.key, $event.target.value)"
            class="mob-slider emerald w-full"
          />
          <div class="flex justify-between text-xs text-slate-600 mt-0.5">
            <span>{{ fmt(inp.min ?? 0) }}</span>
            <span>{{ fmt(inp.max ?? (inp.key === 'fixedCosts' ? 500000 : 300)) }}</span>
          </div>
        </div>
        <!-- Cost breakdown mini-bar -->
        <div class="pt-2 border-t border-white/5">
          <p class="text-xs text-slate-500 mb-2">Kostenstruktur / Stück</p>
          <div class="flex rounded-lg overflow-hidden h-5 text-xs">
            <div
              class="bg-emerald-500/70 flex items-center justify-center text-white font-medium transition-all duration-300"
              :style="{ width: (store.params.materialCostPerUnit / store.variableCostPerUnit * 100) + '%' }"
            >M</div>
            <div
              class="bg-teal-500/70 flex items-center justify-center text-white font-medium transition-all duration-300"
              :style="{ width: (store.params.laborCostPerUnit / store.variableCostPerUnit * 100) + '%' }"
            >A</div>
            <div
              class="bg-cyan-500/70 flex items-center justify-center text-white font-medium transition-all duration-300"
              :style="{ width: (store.params.machineCostPerUnit / store.variableCostPerUnit * 100) + '%' }"
            >Ma</div>
          </div>
          <div class="flex gap-3 mt-1.5 text-xs text-slate-500">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-emerald-500/70"></span>Material</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-teal-500/70"></span>Arbeit</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-cyan-500/70"></span>Maschine</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scenario parameters -->
    <div class="glass rounded-2xl border border-accent-500/20 overflow-hidden">
      <div class="px-5 py-4 border-b border-white/8 flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 text-accent-400">
            <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div>
          <h4 class="text-white font-semibold text-sm">Szenario-Parameter</h4>
          <p class="text-slate-500 text-xs">Fremdbezug & Planmenge</p>
        </div>
      </div>
      <div class="p-5 space-y-4">
        <div v-for="inp in scenarioInputs" :key="inp.key">
          <div class="flex justify-between mb-1.5">
            <label class="text-slate-300 text-xs font-medium">{{ inp.label }}</label>
            <span class="text-white font-semibold text-xs">
              {{ fmt(store.params[inp.key]) }} {{ inp.unit }}
            </span>
          </div>
          <input
            type="range"
            :min="inp.min ?? 0"
            :max="inp.max ?? (inp.key === 'supplierPrice' ? 500 : inp.key === 'quantity' ? 10000 : 100)"
            :step="inp.step"
            :value="store.params[inp.key]"
            @input="store.setParam(inp.key, $event.target.value)"
            class="mob-slider accent w-full"
          />
          <div class="flex justify-between text-xs text-slate-600 mt-0.5">
            <span>{{ fmt(inp.min ?? 0) }}</span>
            <span>{{ fmt(inp.max ?? 500) }}</span>
          </div>
        </div>

        <!-- Current plan indicator -->
        <div class="pt-2 border-t border-white/5">
          <p class="text-xs text-slate-500 mb-2">Aktuelle Planmenge vs. Break-even</p>
          <div class="relative h-5 rounded-lg bg-surface-700 overflow-hidden">
            <div
              v-if="store.breakEvenQty"
              class="absolute h-full bg-accent-500/30 transition-all duration-500"
              :style="{ width: Math.min((store.params.quantity / (store.breakEvenQty * 1.5)) * 100, 100) + '%' }"
            ></div>
            <div
              v-if="store.breakEvenQty"
              class="absolute top-0 bottom-0 w-0.5 bg-amber-400/80"
              :style="{ left: Math.min((store.breakEvenQty / (store.breakEvenQty * 1.5)) * 100, 100) + '%' }"
            ></div>
            <div class="absolute inset-0 flex items-center px-2 text-xs text-white font-medium">
              <span v-if="store.params.quantity < (store.breakEvenQty ?? Infinity)" class="text-accent-400">
                Buy Zone — {{ (store.breakEvenQty - store.params.quantity).toLocaleString('de-DE') }} Stk bis Break-even
              </span>
              <span v-else class="text-emerald-400">
                Make Zone — {{ (store.params.quantity - store.breakEvenQty).toLocaleString('de-DE') }} Stk über Break-even
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.mob-slider {
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  transition: height 0.15s;
}
.mob-slider:hover { height: 6px; }
.mob-slider.emerald { background: linear-gradient(to right, #10b981 0%, #10b981 var(--val, 50%), #334155 var(--val, 50%)); }
.mob-slider.accent  { background: linear-gradient(to right, #0ea5e9 0%, #0ea5e9 var(--val, 50%), #334155 var(--val, 50%)); }
.mob-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: #f1f5f9;
  border: 2px solid rgba(255,255,255,0.3);
  box-shadow: 0 0 8px rgba(0,0,0,0.4);
}
.mob-slider.emerald::-webkit-slider-thumb { background: #10b981; }
.mob-slider.accent::-webkit-slider-thumb  { background: #0ea5e9; }
</style>
