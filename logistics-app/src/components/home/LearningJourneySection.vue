<script setup>
const learningGoals = [
  { icon: '✓', text: 'ABC-Klassifizierung verstehen' },
  { icon: '⌘', text: 'Produktstrukturen analysieren' },
  { icon: '↔', text: 'Make-or-Buy Entscheidungen treffen' },
  { icon: '◈', text: 'Kosten und Flexibilität bewerten' },
  { icon: '◌', text: 'Logistische Kennzahlen interpretieren' },
]

const processSteps = [
  'Daten erfassen',
  'Analyse durchführen',
  'Ergebnisse bewerten',
  'Entscheidung treffen',
  'Umsetzung planen',
]

const kpis = [
  { value: '3', label: 'Analyseverfahren', color: 'text-accent-400' },
  { value: '100%', label: 'Interaktiv', color: 'text-emerald-400' },
  { value: 'HTW', label: 'SS 2026', color: 'text-violet-300' },
  { value: 'Praxisnah', label: 'Industriebezug', color: 'text-rose-300' },
]

function scrollToAnalyses() {
  document.getElementById('project-overview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section class="py-20 px-6 relative overflow-hidden">
    <div class="orb w-72 h-72 bg-accent-600/10 -top-20 -right-20 pointer-events-none"></div>
    <div class="max-w-7xl mx-auto relative z-10 space-y-16">
      <section>
        <div class="text-center mb-8">
          <p class="text-xs uppercase tracking-[0.16em] text-accent-400 font-semibold">Kompetenzen</p>
          <h2 class="section-heading mt-2">Lernziele</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div v-for="goal in learningGoals" :key="goal.text" class="glass rounded-2xl border border-white/10 p-5 text-center hover:bg-white/[0.07] hover:-translate-y-1 transition-all duration-300">
            <span class="w-10 h-10 mx-auto rounded-xl bg-accent-500/15 border border-accent-500/25 text-accent-400 flex items-center justify-center text-lg font-bold">{{ goal.icon }}</span>
            <p class="text-slate-200 text-sm leading-relaxed mt-4">{{ goal.text }}</p>
          </div>
        </div>
      </section>

      <section class="glass rounded-3xl border border-white/10 p-6 md:p-9">
        <div class="text-center mb-10">
          <p class="text-xs uppercase tracking-[0.16em] text-violet-300 font-semibold">Workflow</p>
          <h2 class="text-2xl md:text-3xl font-black text-white mt-2">Logistischer Entscheidungsprozess</h2>
        </div>
        <div class="relative">
          <div class="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-gradient-to-r from-accent-500/20 via-violet-400/50 to-rose-500/20"></div>
          <div class="grid md:grid-cols-5 gap-6 md:gap-3">
            <div v-for="(step, index) in processSteps" :key="step" class="relative text-center">
              <span class="relative z-10 w-11 h-11 mx-auto rounded-full bg-surface-800 border border-violet-400/35 text-violet-300 flex items-center justify-center font-black">{{ index + 1 }}</span>
              <p class="text-slate-200 text-sm font-medium mt-3">{{ step }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="kpi in kpis" :key="kpi.label" class="glass rounded-2xl border border-white/10 p-6 text-center">
          <p :class="['text-2xl md:text-3xl font-black', kpi.color]">{{ kpi.value }}</p>
          <p class="text-slate-400 text-sm mt-2">{{ kpi.label }}</p>
        </div>
      </section>

      <section class="rounded-3xl border border-accent-500/25 bg-gradient-to-r from-accent-600/15 via-violet-600/10 to-rose-600/10 p-8 md:p-10 text-center">
        <h2 class="text-2xl md:text-3xl font-black text-white">Starten Sie Ihre Analyse</h2>
        <p class="text-slate-300 max-w-2xl mx-auto leading-relaxed mt-4">
          Wählen Sie eines der Analyseverfahren aus, um die Anwendung zu erkunden und logistische Entscheidungsprozesse interaktiv zu analysieren.
        </p>
        <button class="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent-500 text-white font-semibold shadow-lg shadow-accent-500/20 hover:bg-accent-400 hover:-translate-y-0.5 transition-all" @click="scrollToAnalyses">
          Analyse starten
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </section>
    </div>
  </section>
</template>
