<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import gsap from 'gsap'

const el = ref(null)
const cardRefs = ref([])
const visible = ref(false)

useIntersectionObserver(el, ([{ isIntersecting }]) => {
  if (isIntersecting && !visible.value) {
    visible.value = true
    gsap.fromTo(
      cardRefs.value,
      { opacity: 0, y: 36, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out', stagger: 0.16 }
    )
  }
}, { threshold: 0.2 })

const points = [
  {
    side: 'cost',
    icon: '💰',
    title: 'Kostenfokus',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/30',
    accent: 'text-emerald-400',
    items: ['Geringe Lagerhaltungskosten', 'Kleine Bestellmengen', 'Just-in-Time Lieferung', 'Reduzierte Kapitalbindung'],
  },
  {
    side: 'flex',
    icon: '⚡',
    title: 'Flexibilität',
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/30',
    accent: 'text-amber-400',
    items: ['Hohe Lieferbereitschaft', 'Pufferlagerbestände', 'Schnelle Reaktionszeit', 'Variantenvielfalt'],
  },
]
</script>

<template>
  <section ref="el" class="py-20 px-6">
    <div class="max-w-7xl mx-auto">
      <div :class="['text-center mb-12 transition-all duration-600', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/25 text-rose-400 text-sm font-medium mb-4">
          Kernkonzept
        </div>
        <h2 class="section-heading">Zielkonflikt: Kosten vs. Flexibilität</h2>
        <p class="section-sub">
          Der zentrale Zielkonflikt in der Logistik: Kostenminimierung und Servicegrad stehen in direkter Spannung.
          Entscheidungsverfahren helfen, die optimale Balance zu finden.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto relative">
        <!-- VS indicator -->
        <div class="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 items-center z-10">
          <div class="w-10 h-10 rounded-full bg-surface-800 border border-white/20 flex items-center justify-center font-black text-slate-300 text-sm shadow-xl">
            VS
          </div>
        </div>

        <div
          v-for="(p, i) in points"
          :key="p.side"
          :ref="el => { if (el) cardRefs[i] = el }"
          :class="[
            'group glass rounded-2xl p-6 border card-lift',
            `bg-gradient-to-br ${p.color} ${p.border}`,
          ]"
          style="opacity: 0;"
        >
          <div class="flex items-center gap-3 mb-5">
            <span class="text-3xl transition-transform duration-300 group-hover:scale-110">{{ p.icon }}</span>
            <h3 :class="['text-xl font-bold', p.accent]">{{ p.title }}</h3>
          </div>
          <ul class="space-y-3">
            <li
              v-for="item in p.items"
              :key="item"
              class="flex items-center gap-3 text-slate-300 text-sm"
            >
              <div :class="['w-1.5 h-1.5 rounded-full flex-shrink-0', p.side === 'cost' ? 'bg-emerald-400' : 'bg-amber-400']"></div>
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Resolution note -->
      <div
        :class="['mt-8 max-w-2xl mx-auto text-center transition-all duration-700 delay-400', visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6']"
      >
        <div class="glass rounded-xl p-5 border border-accent-500/20 hover:border-accent-500/35 transition-colors duration-300">
          <p class="text-slate-300 text-sm leading-relaxed">
            <span class="text-accent-400 font-semibold">Lösung:</span>
            Analytische Verfahren wie die ABC/XYZ-Analyse ermöglichen eine differenzierte Betrachtung —
            nicht alle Artikel benötigen dieselbe Strategie.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
