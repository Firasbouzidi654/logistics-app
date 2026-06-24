<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useIntersectionObserver } from '@vueuse/core'

const visible = ref(false)
const heroRef = ref(null)

useIntersectionObserver(heroRef, ([{ isIntersecting }]) => {
  if (isIntersecting) visible.value = true
}, { threshold: 0.1 })

const counters = ref([
  { label: 'Analysemethoden', target: 3,    suffix: '',  current: 0 },
  { label: 'Datenpunkte',     target: 1200, suffix: '+', current: 0 },
  { label: 'Einsparung',      target: 32,   suffix: '%', current: 0 },
  { label: 'KPI Metriken',    target: 18,   suffix: '',  current: 0 },
])

function animateCounters() {
  counters.value.forEach(c => {
    const duration = 1800
    const steps = 60
    const increment = c.target / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      c.current = Math.min(Math.round(increment * step), c.target)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
  })
}

onMounted(() => {
  setTimeout(animateCounters, 600)
})
</script>

<template>
  <section ref="heroRef" class="relative min-h-screen flex flex-col justify-center overflow-hidden">
    <!-- Background grid (reduced opacity) -->
    <div class="absolute inset-0 bg-grid opacity-80 pointer-events-none"></div>

    <!-- Glowing orbs -->
    <div class="orb w-96 h-96 bg-accent-600/20 top-10 -left-20 animate-pulse-slow"></div>
    <div class="orb w-80 h-80 bg-blue-700/15 bottom-20 right-0 animate-float" style="animation-delay:2s"></div>
    <div class="orb w-64 h-64 bg-brand-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

    <!-- Gradient overlay bottom -->
    <div class="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-surface-900 to-transparent pointer-events-none"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16">
      <!-- Badge -->
      <div
        :class="['flex justify-center mb-8 transition-all duration-700', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']"
      >
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent-500/30 text-sm">
          <span class="w-2 h-2 rounded-full bg-accent-400 animate-pulse"></span>
          <span class="text-accent-400 font-medium">Sommersemester 2026</span>
          <span class="text-slate-500">·</span>
          <span class="text-slate-400">HTW Berlin</span>
        </div>
      </div>

      <!-- Title -->
      <div
        :class="['text-center transition-all duration-700 delay-150', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
      >
        <!-- Animated gradient glow behind the title -->
        <div class="relative inline-block w-full">
          <div
            class="absolute inset-0 pointer-events-none flex items-center justify-center hero-title-glow"
            style="
              background: radial-gradient(ellipse 70% 55% at 50% 50%,
                rgba(14,165,233,0.18) 0%,
                rgba(56,189,248,0.10) 40%,
                transparent 70%);
              filter: blur(32px);
              z-index: 0;
            "
          ></div>

          <h1 class="relative z-10 text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6">
            Interaktive Analyse<br />
            <span class="gradient-text">logistischer</span><br />
            Entscheidungsverfahren
          </h1>
        </div>

        <p class="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-10">
          Praxisnahe Analyse von ABC-Klassifikation, Stücklistenanalyse und Make-or-Buy-Entscheidungen
          mit interaktiven Visualisierungen und dynamischen Kalkulationen.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-4">
          <RouterLink to="/abc-xyz" class="btn-primary flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            Analyse starten
          </RouterLink>
          <a href="#modules" class="btn-ghost flex items-center gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
            </svg>
            Mehr erfahren
          </a>
        </div>
      </div>

      <!-- KPI counters -->
      <div
        :class="['grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 transition-all duration-700 delay-300', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10']"
      >
        <div
          v-for="(c, i) in counters"
          :key="c.label"
          class="glass glass-hover rounded-2xl p-5 text-center kpi-card"
          :style="{ animationDelay: i * 80 + 'ms' }"
        >
          <div class="text-3xl font-black gradient-text mb-1">
            {{ c.current }}{{ c.suffix }}
          </div>
          <div class="text-slate-400 text-sm">{{ c.label }}</div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 inset-x-0 flex justify-center animate-bounce">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-6 h-6 text-slate-500">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  </section>
</template>
