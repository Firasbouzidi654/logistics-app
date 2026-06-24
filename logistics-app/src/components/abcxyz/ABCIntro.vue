<script setup>
const cards = [
  {
    label: 'A-Artikel',
    color: 'from-rose-500/25 to-rose-600/15',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    points: ['Hohe Bedeutung', 'Hoher Verbrauchswert', 'Regelmäßige Kontrolle'],
  },
  {
    label: 'B-Artikel',
    color: 'from-amber-500/25 to-amber-600/15',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    points: ['Mittlere Bedeutung', 'Mittlerer Verbrauchswert', 'Normale Kontrolle'],
  },
  {
    label: 'C-Artikel',
    color: 'from-slate-500/25 to-slate-600/15',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    points: ['Geringe Bedeutung', 'Niedriger Verbrauchswert', 'Einfache Verwaltung'],
  },
]
</script>

<template>
  <div class="space-y-8">
    <div class="glass rounded-2xl p-6 border border-white/10">
      <h2 class="text-2xl font-bold text-white mb-3">Was ist die ABC-Analyse?</h2>
      <p class="text-slate-300 leading-relaxed">
        Die ABC-Analyse klassifiziert Lagerartikel nach ihrem Jahresverbrauchswert.
      </p>

      <div class="mt-5 p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 text-center">
        <p class="text-sm uppercase tracking-wider font-semibold text-accent-400">Verbrauchswert</p>
        <p class="text-lg text-white font-bold mt-2">= Stückpreis × Jahresverbrauchsmenge</p>
      </div>

      <p class="text-slate-300 leading-relaxed mt-5">
        Die Artikel werden nach ihrem Verbrauchswert sortiert und anschließend in A-, B- und C-Klassen eingeteilt.
      </p>
      <div class="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
        <span class="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20">A = Wichtig</span>
        <span class="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20">B = Mittel</span>
        <span class="px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-300 border border-slate-500/20">C = Gering</span>
      </div>
      <p class="text-slate-400 text-sm leading-relaxed mt-4">So lassen sich wichtige Artikel leichter erkennen und verwalten.</p>
      <div class="mt-4 rounded-xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm">
        <span class="font-semibold text-accent-400">Ziel:</span>
        <span class="text-slate-300 ml-1">Wichtige Lagerartikel schneller identifizieren und gezielt überwachen.</span>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-4">
      <div
        v-for="card in cards"
        :key="card.label"
        :class="['glass rounded-2xl p-5 border bg-gradient-to-br', card.color, card.border]"
      >
        <div class="flex items-center gap-2 mb-4">
          <div :class="['w-3 h-3 rounded-full', card.dot]"></div>
          <span :class="['font-bold text-lg', card.text]">{{ card.label }}</span>
        </div>
        <ul class="space-y-2 border-t border-white/5 pt-3">
          <li v-for="point in card.points" :key="point" class="flex gap-2 text-sm text-slate-200 leading-relaxed">
            <span :class="['mt-1.5 w-1.5 h-1.5 rounded-full flex-none', card.dot]"></span>
            <span>{{ point }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
