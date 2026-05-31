<script setup>
import { ref, onMounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'

const el = ref(null)
const cardsRef = ref([])
const visible = ref(false)

useIntersectionObserver(el, ([{ isIntersecting }]) => {
  if (isIntersecting && !visible.value) {
    visible.value = true
    gsap.fromTo(
      cardsRef.value,
      { opacity: 0, y: 48, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.14,
      }
    )
  }
}, { threshold: 0.15 })

const modules = [
  {
    title: 'ABC/XYZ Analyse',
    subtitle: 'Bestandsklassifikation',
    description:
      'Klassifikation von Artikeln nach Wertanteil (ABC) und Bedarfsschwankung (XYZ). Automatische Pareto-Auswertung mit interaktivem Diagramm.',
    icon: 'chart-bar',
    color: 'from-accent-600/30 to-blue-700/20',
    border: 'border-accent-500/30',
    badge: 'Verfügbar',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    to: '/abc-xyz',
    features: ['Pareto-Diagramm', 'Live-Kalkulation', 'Praxisbeispiel Augsburg'],
  },
  {
    title: 'Stücklistenanalyse',
    subtitle: 'Materialstruktur',
    description:
      'Analyse mehrstufiger Stücklisten zur Ermittlung von Gesamtbedarfen, Fertigungskosten und Beschaffungsstrategien.',
    icon: 'list',
    color: 'from-violet-600/30 to-purple-700/20',
    border: 'border-violet-500/30',
    badge: 'Verfügbar',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    to: '/stueckliste',
    features: ['Mehrstufige BoM', 'Kostenauflösung', 'Live-Kalkulation'],
  },
  {
    title: 'Make-or-Buy Analyse',
    subtitle: 'Entscheidungsmodell',
    description:
      'Strukturierter Vergleich zwischen Eigenfertigung und Fremdbezug unter Berücksichtigung von Kosten, Qualität und strategischen Faktoren.',
    icon: 'scale',
    color: 'from-rose-600/30 to-pink-700/20',
    border: 'border-rose-500/30',
    badge: 'Verfügbar',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    to: '/make-or-buy',
    features: ['Nutzwertanalyse', 'Break-even Analyse', 'BMW · Apple · Boeing'],
  },
]
</script>

<template>
  <section id="modules" ref="el" class="py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <div :class="['text-center mb-12 transition-all duration-600', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/25 text-accent-400 text-sm font-medium mb-4">
          Module
        </div>
        <h2 class="section-heading">Analyse-Module</h2>
        <p class="section-sub">Drei praxiserprobte Methoden zur logistischen Entscheidungsunterstützung</p>
      </div>

      <div class="grid md:grid-cols-3 gap-6">
        <component
          :is="m.disabled ? 'div' : RouterLink"
          v-for="(m, idx) in modules"
          :key="m.title"
          :ref="el => { if (el) cardsRef[idx] = el.$el ?? el }"
          v-bind="m.disabled ? {} : { to: m.to }"
          :class="[
            'group relative rounded-2xl p-6 border transition-all duration-500 overflow-hidden',
            `bg-gradient-to-br ${m.color} ${m.border}`,
            m.disabled ? 'cursor-default opacity-70' : 'module-card cursor-pointer',
          ]"
          style="opacity: 0;"
        >
          <!-- Shimmer sweep on hover -->
          <div v-if="!m.disabled" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>

          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-white/15">
              <svg v-if="m.icon === 'chart-bar'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-white">
                <path d="M3 3v18h18"/><path d="M7 16v-4M12 16V8M17 16v-8"/>
              </svg>
              <svg v-else-if="m.icon === 'list'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-white">
                <path d="M3 6h18M3 12h18M3 18h18"/><circle cx="3" cy="6" r="1" fill="currentColor"/><circle cx="3" cy="12" r="1" fill="currentColor"/><circle cx="3" cy="18" r="1" fill="currentColor"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-white">
                <path d="M12 3v18M3 9l9-6 9 6"/><path d="M6 12l-3 6h6l-3-6zM18 12l-3 6h6l-3-6z"/>
              </svg>
            </div>
            <span :class="['text-xs font-semibold px-2.5 py-1 rounded-full border', m.badgeColor]">
              {{ m.badge }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-white mb-1">{{ m.title }}</h3>
          <p class="text-xs text-slate-400 font-medium uppercase tracking-wider mb-3">{{ m.subtitle }}</p>
          <p class="text-slate-300 text-sm leading-relaxed mb-5">{{ m.description }}</p>

          <ul class="space-y-2">
            <li v-for="f in m.features" :key="f" class="flex items-center gap-2 text-xs text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="w-3.5 h-3.5 text-accent-400 flex-shrink-0">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {{ f }}
            </li>
          </ul>

          <div v-if="!m.disabled" class="mt-5 flex items-center gap-2 text-accent-400 text-sm font-medium">
            Jetzt starten
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </component>
      </div>
    </div>
  </section>
</template>
