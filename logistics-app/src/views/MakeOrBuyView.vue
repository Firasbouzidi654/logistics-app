<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import Navbar            from '../components/layout/Navbar.vue'
import Footer            from '../components/layout/Footer.vue'
import MOBDecisionBanner from '../components/makeorbuy/MOBDecisionBanner.vue'
import MOBKPICards       from '../components/makeorbuy/MOBKPICards.vue'
import MOBInputPanel     from '../components/makeorbuy/MOBInputPanel.vue'
import MOBCriteriaTable  from '../components/makeorbuy/MOBCriteriaTable.vue'
import MOBCharts         from '../components/makeorbuy/MOBCharts.vue'
import { useMakeOrBuyStore } from '../stores/makeorbuy'

const store = useMakeOrBuyStore()

const activeTab = ref('kalkulation')
const tabs = [
  { id: 'kalkulation',      label: 'Kalkulation',        icon: '⚙️' },
  { id: 'kriterien',        label: 'Kriterienbewertung', icon: '📋' },
  { id: 'kostenanalyse',    label: 'Kostenanalyse',      icon: '📊' },
]
</script>

<template>
  <div class="min-h-screen bg-surface-900">
    <Navbar />

    <!-- Page header -->
    <div class="relative pt-24 pb-12 px-6 overflow-hidden">
      <div class="orb w-96 h-96 bg-rose-600/12 -top-24 -right-24 animate-pulse-slow pointer-events-none"></div>
      <div class="orb w-56 h-56 bg-pink-700/10 top-40 left-5 animate-float pointer-events-none" style="animation-delay:2s"></div>

      <div class="max-w-7xl mx-auto relative z-10">
        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 text-sm text-slate-500 mb-4">
          <RouterLink to="/" class="hover:text-slate-300 transition-colors">Startseite</RouterLink>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M9 18l6-6-6-6"/></svg>
          <span class="text-slate-300">Make-or-Buy Analyse</span>
        </div>

        <!-- Title row -->
        <div class="flex items-start justify-between flex-wrap gap-4 mb-5">
          <div>
            <h1 class="text-3xl md:text-4xl font-black text-white mb-2">Make-or-Buy Analyse</h1>
            <p class="text-slate-400 max-w-2xl">
              Entscheidungsunterstützung für die Frage: Eigenfertigung oder Fremdbezug der
              <span class="text-white font-medium">Elektrischen Antriebseinheit EA-300</span>?
              Kostenrechnung, Nutzwertanalyse und Break-even-Simulation in Echtzeit.
            </p>
          </div>
          <span class="px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 self-start">
            ✓ Verfügbar
          </span>
        </div>

        <!-- Context pills -->
        <div class="flex flex-wrap gap-3 text-sm text-slate-400 mb-6">
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-rose-400">🏭</span>
            LogiTech Fertigungs GmbH vs. Siemens AG
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-accent-400">📦</span>
            Produkt: Elektrische Antriebseinheit EA-300
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-amber-400">🎯</span>
            Break-even-Analyse · Nutzwertanalyse · Kostenvergleich
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 bg-surface-800/60 rounded-xl p-1 w-fit flex-wrap">
          <button
            v-for="t in tabs"
            :key="t.id"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              activeTab === t.id
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white',
            ]"
            @click="activeTab = t.id"
          >
            <span>{{ t.icon }}</span>{{ t.label }}
          </button>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-6 pb-20 space-y-8">

      <!-- Always visible: KPI + Decision -->
      <MOBKPICards />
      <MOBDecisionBanner />

      <!-- Tab: Kalkulation -->
      <template v-if="activeTab === 'kalkulation'">
        <MOBInputPanel />

        <!-- Cost detail breakdown -->
        <div class="glass rounded-2xl border border-white/10 p-6">
          <h3 class="text-white font-semibold mb-5">Kostenaufstellung — Detailvergleich</h3>
          <div class="grid md:grid-cols-2 gap-8">

            <!-- Make breakdown -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>Eigenfertigung (Make)
              </p>
              <div class="space-y-0 text-sm">
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Fixkosten (Maschinen, Setup)</span>
                  <span class="text-white font-medium">{{ new Intl.NumberFormat('de-DE').format(store.params.fixedCosts) }} €</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Materialkosten ({{ store.params.quantity.toLocaleString('de-DE') }} × {{ store.params.materialCostPerUnit }} €)</span>
                  <span class="text-white font-medium">{{ new Intl.NumberFormat('de-DE').format(store.params.materialCostPerUnit * store.params.quantity) }} €</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Arbeitskosten ({{ store.params.quantity.toLocaleString('de-DE') }} × {{ store.params.laborCostPerUnit }} €)</span>
                  <span class="text-white font-medium">{{ new Intl.NumberFormat('de-DE').format(store.params.laborCostPerUnit * store.params.quantity) }} €</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Maschinenkosten ({{ store.params.quantity.toLocaleString('de-DE') }} × {{ store.params.machineCostPerUnit }} €)</span>
                  <span class="text-white font-medium">{{ new Intl.NumberFormat('de-DE').format(store.params.machineCostPerUnit * store.params.quantity) }} €</span>
                </div>
                <div class="flex justify-between py-3 font-bold">
                  <span class="text-emerald-400">Gesamtkosten Make</span>
                  <span class="text-emerald-400 text-base">{{ new Intl.NumberFormat('de-DE').format(store.makeTotalCost) }} €</span>
                </div>
              </div>
            </div>

            <!-- Buy breakdown -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-accent-400 mb-4 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-accent-400"></span>Fremdbezug (Buy) — Siemens AG
              </p>
              <div class="space-y-0 text-sm">
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Fixkosten</span>
                  <span class="text-slate-500">0 €</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Lieferantenpreis ({{ store.params.quantity.toLocaleString('de-DE') }} × {{ store.params.supplierPrice }} €)</span>
                  <span class="text-white font-medium">{{ new Intl.NumberFormat('de-DE').format(store.buyTotalCost) }} €</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Logistik & Handling (est.)</span>
                  <span class="text-slate-500">inkl.</span>
                </div>
                <div class="flex justify-between py-2.5 border-b border-white/5">
                  <span class="text-slate-400">Qualitätsprüfung (ext.)</span>
                  <span class="text-slate-500">inkl.</span>
                </div>
                <div class="flex justify-between py-3 font-bold">
                  <span class="text-accent-400">Gesamtkosten Buy</span>
                  <span class="text-accent-400 text-base">{{ new Intl.NumberFormat('de-DE').format(store.buyTotalCost) }} €</span>
                </div>
              </div>
              <!-- Savings highlight -->
              <div :class="[
                'mt-3 rounded-xl p-3 border text-sm font-semibold text-center',
                store.costDiff >= 0
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                  : 'bg-accent-500/10 border-accent-500/25 text-accent-400',
              ]">
                {{ store.costDiff >= 0 ? '↓ Make spart' : '↓ Buy spart' }}
                {{ new Intl.NumberFormat('de-DE').format(Math.abs(store.costDiff)) }} €
                bei {{ store.params.quantity.toLocaleString('de-DE') }} Stk/Jahr
              </div>
            </div>

          </div>
        </div>
      </template>

      <!-- Tab: Kriterienbewertung -->
      <template v-else-if="activeTab === 'kriterien'">
        <MOBCriteriaTable />
      </template>

      <!-- Tab: Kostenanalyse -->
      <template v-else-if="activeTab === 'kostenanalyse'">
        <MOBCharts />
      </template>

    </main>

    <Footer />
  </div>
</template>
