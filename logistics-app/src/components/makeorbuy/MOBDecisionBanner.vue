<script setup>
import { computed } from 'vue'
import { useMakeOrBuyStore } from '../../stores/makeorbuy'

const store = useMakeOrBuyStore()

const cfg = computed(() => {
  const r = store.overallRecommendation
  if (r === 'make') return {
    label:    'EIGENFERTIGUNG EMPFOHLEN',
    sub:      'Make',
    text:     'Auf Basis der gewichteten Kriterienanalyse und Kostenrechnung wird die Eigenfertigung empfohlen. Qualitätskontrolle und strategisches Know-how überwiegen den Kostenvorteil des Fremdbezugs.',
    gradient: 'from-emerald-600/25 to-teal-700/15',
    border:   'border-emerald-500/40',
    accent:   'text-emerald-400',
    glow:     'shadow-[0_0_32px_rgba(16,185,129,0.2)]',
    dot:      'bg-emerald-400',
    icon:     'make',
  }
  if (r === 'buy') return {
    label:    'FREMDBEZUG EMPFOHLEN',
    sub:      'Buy',
    text:     'Die Kostenanalyse zeigt einen klaren Vorteil beim Fremdbezug bei der aktuellen Planmenge. Eine Erhöhung der Produktionsmenge über den Break-even-Punkt würde die Entscheidung umkehren.',
    gradient: 'from-accent-600/25 to-blue-700/15',
    border:   'border-accent-500/40',
    accent:   'text-accent-400',
    glow:     'shadow-[0_0_32px_rgba(14,165,233,0.2)]',
    dot:      'bg-accent-400',
    icon:     'buy',
  }
  return {
    label:    'NEUTRALE AUSGANGSLAGE',
    sub:      'Unentschieden',
    text:     'Kosten- und Kriterienanalyse liefern kein eindeutiges Ergebnis. Strategische Prioritäten des Unternehmens sollten den Ausschlag geben.',
    gradient: 'from-amber-600/25 to-orange-700/15',
    border:   'border-amber-500/40',
    accent:   'text-amber-400',
    glow:     'shadow-[0_0_32px_rgba(245,158,11,0.2)]',
    dot:      'bg-amber-400',
    icon:     'neutral',
  }
})

function fmt(n) {
  return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 0 }).format(Math.abs(n))
}
</script>

<template>
  <div :class="['relative overflow-hidden rounded-2xl border p-6 md:p-8 transition-all duration-500 glass', cfg.gradient, cfg.border, cfg.glow]">
    <!-- Background glow orb -->
    <div :class="['orb w-64 h-64 -top-20 -right-10 pointer-events-none opacity-30', cfg.dot]" style="filter:blur(80px)"></div>

    <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">

      <!-- Icon -->
      <div :class="['w-16 h-16 rounded-2xl border flex items-center justify-center flex-shrink-0', cfg.gradient, cfg.border]">
        <!-- Factory (make) -->
        <svg v-if="cfg.icon === 'make'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="['w-8 h-8', cfg.accent]">
          <path d="M2 20h20M4 20V8l5 4V8l5 4V8l5 4V20"/><path d="M8 20v-4h3v4M13 20v-4h3v4"/>
        </svg>
        <!-- Truck (buy) -->
        <svg v-else-if="cfg.icon === 'buy'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="['w-8 h-8', cfg.accent]">
          <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
        <!-- Scale (neutral) -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="['w-8 h-8', cfg.accent]">
          <path d="M12 3v18M3 9l9-6 9 6"/><path d="M6 12l-3 6h6l-3-6zM18 12l-3 6h6l-3-6z"/>
        </svg>
      </div>

      <!-- Text -->
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-1">
          <span :class="['w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0', cfg.dot]"></span>
          <span :class="['text-xs font-black uppercase tracking-widest', cfg.accent]">{{ cfg.label }}</span>
        </div>
        <p class="text-white text-lg font-bold mb-2">
          Empfehlung: <span :class="cfg.accent">{{ cfg.sub }}</span>
          <span class="text-slate-400 font-normal text-sm ml-2">(Konfidenz {{ store.confidence }}%)</span>
        </p>
        <p class="text-slate-300 text-sm leading-relaxed max-w-2xl">{{ cfg.text }}</p>
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-2 gap-3 flex-shrink-0 w-full md:w-auto">
        <div class="rounded-xl bg-black/20 border border-white/8 p-3 text-center min-w-[110px]">
          <p class="text-xs text-slate-400 mb-1">Kostenvorteil</p>
          <p :class="['text-lg font-black', cfg.accent]">
            {{ store.costDiff >= 0 ? '+' : '–' }}{{ fmt(store.costDiff) }} €
          </p>
          <p class="text-xs text-slate-500">{{ store.costDiff >= 0 ? 'Make günstiger' : 'Buy günstiger' }}</p>
        </div>
        <div class="rounded-xl bg-black/20 border border-white/8 p-3 text-center min-w-[110px]">
          <p class="text-xs text-slate-400 mb-1">Break-even</p>
          <p :class="['text-lg font-black', cfg.accent]">
            {{ store.breakEvenQty ? store.breakEvenQty.toLocaleString('de-DE') : '—' }}
          </p>
          <p class="text-xs text-slate-500">Stück/Jahr</p>
        </div>
      </div>

    </div>
  </div>
</template>
