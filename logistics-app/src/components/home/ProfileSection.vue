<script setup>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import profileImg from '../../assets/firas-profile.jpeg'

const el  = ref(null)
const vis = ref(false)
useIntersectionObserver(el, ([{ isIntersecting }]) => {
  if (isIntersecting) vis.value = true
}, { threshold: 0.15 })

const skills = [
  { label: 'Wirtschaftsinformatik', icon: '💻' },
  { label: 'Digitalisierung',       icon: '⚡' },
  { label: 'Datenanalyse',          icon: '📊' },
  { label: 'Business & IT',         icon: '🏢' },
  { label: 'Prozessautomatisierung', icon: '⚙️' },
  { label: 'Logistik & SCM-Tech',   icon: '🚚' },
]

const stats = [
  { value: '5.',   label: 'Semester' },
  { value: 'B.Sc.', label: 'Abschluss' },
  { value: 'HTW',  label: 'Berlin' },
]
</script>

<template>
  <section ref="el" class="py-24 px-6 relative overflow-hidden">
    <!-- Background decoration -->
    <div class="orb w-80 h-80 bg-brand-500/15 top-0 left-0 pointer-events-none"></div>
    <div class="orb w-64 h-64 bg-accent-600/10 bottom-0 right-10 pointer-events-none animate-float" style="animation-delay:3s"></div>

    <div class="max-w-7xl mx-auto relative z-10">
      <!-- Section label -->
      <div
        :class="['text-center mb-14 transition-all duration-700', vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8']"
      >
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-sm font-medium mb-4">
          Über mich
        </div>
        <h2 class="section-heading">Profil</h2>
      </div>

      <!-- Card -->
      <div
        :class="[
          'max-w-5xl mx-auto glass rounded-3xl border border-white/10 overflow-hidden',
          'shadow-card hover:shadow-glow transition-shadow duration-500',
          vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
          'transition-all duration-700 delay-150',
        ]"
      >
        <div class="grid md:grid-cols-5">

          <!-- ── Left: photo column ─────────────────────────── -->
          <div class="md:col-span-2 relative group">
            <div class="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-transparent to-transparent z-10 pointer-events-none"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface-900/40 z-10 pointer-events-none hidden md:block"></div>

            <img
              :src="profileImg"
              alt="Firas Bouzidi"
              class="w-full h-72 md:h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              style="min-height: 340px;"
            />

            <!-- Name overlay — mobile only -->
            <div class="absolute bottom-0 inset-x-0 p-5 z-20 md:hidden">
              <h3 class="text-2xl font-black text-white">Firas Bouzidi</h3>
              <p class="text-accent-400 text-sm font-medium">Wirtschaftsinformatik (B.Sc.) · HTW Berlin</p>
            </div>

            <div class="absolute -inset-px rounded-l-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style="background: linear-gradient(135deg, rgba(14,165,233,0.15) 0%, transparent 60%);">
            </div>
          </div>

          <!-- ── Right: content column ───────────────────────── -->
          <div class="md:col-span-3 p-8 md:p-10 flex flex-col justify-between gap-6">

            <!-- Name & title — desktop -->
            <div class="hidden md:block">
              <div class="flex items-start justify-between flex-wrap gap-3 mb-2">
                <div>
                  <h3 class="text-3xl font-black text-white tracking-tight">Firas Bouzidi</h3>
                  <div class="flex items-center gap-2 mt-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-slate-400 text-sm">Wirtschaftsinformatik (B.Sc.) · HTW Berlin</span>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold bg-accent-500/15 text-accent-400 border border-accent-500/25 self-start">
                  Matrikelnr. 594251
                </span>
              </div>
              <div class="h-px bg-gradient-to-r from-accent-500/40 via-white/10 to-transparent mt-4 mb-1"></div>
            </div>

            <!-- Bio -->
            <div class="space-y-3 text-slate-300 text-[0.95rem] leading-relaxed">
              <p>
                Im 5. Semester Wirtschaftsinformatik (B.Sc.) an der HTW Berlin —
                mit dem Fokus auf die Schnittstelle zwischen
                <span class="text-white font-medium">Betriebswirtschaft, IT-Systemen und digitaler Transformation</span>.
                Mich interessiert besonders, wie sich klassische Geschäftsprozesse durch Daten und Automatisierung
                neu gestalten lassen.
              </p>
              <p>
                Neben dem Studium sammle ich als
                <span class="text-accent-400 font-medium">Werkstudent bei der DRÄXLMAIER Group</span>
                praktische Erfahrung in den Bereichen
                <span class="text-white font-medium">Prozessautomatisierung und Data Analytics</span> —
                direkt im industriellen Umfeld eines internationalen Automobilzulieferers.
              </p>
              <p>
                Diese Plattform entstand im Rahmen des Moduls
                <span class="text-accent-400 font-medium">Produktionswirtschaft & Logistik</span> (SS 2026)
                und zeigt, wie sich Analysemethoden wie ABC/XYZ oder Make-or-Buy
                interaktiv und datengetrieben umsetzen lassen.
              </p>
            </div>

            <!-- Werkstudent badge -->
            <div class="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/4 border border-white/8 w-fit">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/30 to-orange-600/20 border border-amber-500/25 flex items-center justify-center flex-shrink-0 text-sm">
                🏭
              </div>
              <div>
                <p class="text-white text-xs font-semibold leading-tight">Werkstudent · DRÄXLMAIER Group</p>
                <p class="text-slate-500 text-xs mt-0.5">Prozessautomatisierung &amp; Data Analytics</p>
              </div>
            </div>

            <!-- Skills tags -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3">Schwerpunkte</p>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="s in skills"
                  :key="s.label"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium
                         bg-white/5 border border-white/10 text-slate-300
                         hover:bg-accent-500/15 hover:border-accent-500/30 hover:text-white
                         transition-all duration-200 cursor-default"
                >
                  <span>{{ s.icon }}</span>
                  {{ s.label }}
                </span>
              </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="s in stats"
                :key="s.label"
                class="rounded-2xl bg-white/4 border border-white/8 p-4 text-center
                       hover:bg-accent-500/10 hover:border-accent-500/25 transition-all duration-200"
              >
                <div class="text-2xl font-black gradient-text">{{ s.value }}</div>
                <div class="text-xs text-slate-500 mt-0.5">{{ s.label }}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>
