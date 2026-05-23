<script setup>
const cards = [
  {
    label: 'A-Artikel',
    pct: '~70%',
    items: '~10–20%',
    color: 'from-rose-500/25 to-rose-600/15',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    desc: 'Hoher Wertanteil · Intensive Disposition · Genaue Bedarfsplanung',
  },
  {
    label: 'B-Artikel',
    pct: '~20%',
    items: '~30–40%',
    color: 'from-amber-500/25 to-amber-600/15',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    desc: 'Mittlerer Wertanteil · Periodische Überprüfung · Standarddisposition',
  },
  {
    label: 'C-Artikel',
    pct: '~10%',
    items: '~50–60%',
    color: 'from-slate-500/25 to-slate-600/15',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    desc: 'Geringer Wertanteil · Einfache Disposition · Sammelbestellungen',
  },
]
</script>

<template>
  <div class="space-y-8">
    <!-- Intro text -->
    <div class="glass rounded-2xl p-6 border border-white/10">
      <h2 class="text-2xl font-bold text-white mb-3">Was ist die ABC-Analyse?</h2>
      <p class="text-slate-300 leading-relaxed">
        Die <strong class="text-accent-400">ABC-Analyse</strong> ist eine Methode zur Klassifikation von Lagerartikeln nach ihrem
        kumulierten Wertanteil am Gesamtlagerbestand (Pareto-Prinzip: 20% der Artikel verursachen 80% des Wertes).
        Sie bildet die Grundlage für differenzierte Bestandssteuerungsstrategien.
      </p>
      <div class="mt-4 p-4 rounded-xl bg-accent-500/10 border border-accent-500/20">
        <p class="text-sm text-slate-300">
          <span class="font-semibold text-accent-400">Formel:</span>
          Jahresverbrauchswert = Stückpreis × Jahresverbrauchsmenge
          <span class="mx-2 text-slate-500">→</span>
          Rangfolge nach absteigendem Verbrauchswert
          <span class="mx-2 text-slate-500">→</span>
          Kumulierter Anteil bestimmt Klasse A / B / C
        </p>
      </div>
    </div>

    <!-- ABC class cards -->
    <div class="grid md:grid-cols-3 gap-4">
      <div
        v-for="c in cards"
        :key="c.label"
        :class="['glass rounded-2xl p-5 border bg-gradient-to-br', c.color, c.border]"
      >
        <div class="flex items-center gap-2 mb-4">
          <div :class="['w-3 h-3 rounded-full', c.dot]"></div>
          <span :class="['font-bold text-lg', c.text]">{{ c.label }}</span>
        </div>
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Wertanteil</span>
            <span class="text-white font-semibold">{{ c.pct }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-400">Artikelanteil</span>
            <span class="text-white font-semibold">{{ c.items }}</span>
          </div>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-3">{{ c.desc }}</p>
      </div>
    </div>
  </div>
</template>
