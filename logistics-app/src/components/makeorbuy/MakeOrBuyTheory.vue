<script setup>
const makeAdvantages = [
  'Höhere Qualitätskontrolle',
  'Schutz von Know-how und Technologien',
  'Unabhängigkeit von Lieferanten',
  'Langfristig geringere Stückkosten bei hohen Produktionsmengen',
]

const buyAdvantages = [
  'Geringere Anfangsinvestitionen',
  'Nutzung von Lieferanten-Know-how',
  'Höhere Flexibilität',
  'Schnellere Beschaffung',
  'Reduzierung interner Produktionsrisiken',
]

const criteria = [
  ['Kosten', 'Vergleich von Herstell- und Einkaufskosten'],
  ['Qualität', 'Qualitätsanforderungen des Produkts'],
  ['Kapazität', 'Verfügbare Produktionsressourcen'],
  ['Flexibilität', 'Reaktionsfähigkeit auf Nachfrageschwankungen'],
  ['Risiko', 'Lieferanten- und Produktionsrisiken'],
  ['Know-how', 'Schutz von technischem Wissen'],
]
</script>

<template>
  <div class="space-y-6">
    <section class="glass rounded-2xl border border-white/10 p-6 bg-gradient-to-r from-rose-500/[0.08] to-transparent">
      <p class="text-xs uppercase tracking-[0.16em] text-rose-300 font-semibold">Theorie</p>
      <h2 class="text-2xl md:text-3xl font-black text-white mt-2">Make-or-Buy Strategie</h2>
      <div class="mt-4 max-w-4xl space-y-3 text-slate-300 leading-relaxed">
        <p>Die Make-or-Buy-Entscheidung ist eine zentrale strategische Entscheidung im Beschaffungs- und Produktionsmanagement.</p>
        <p>Unternehmen müssen entscheiden, ob Produkte oder Komponenten intern hergestellt (Make) oder von externen Lieferanten bezogen (Buy) werden sollen.</p>
      </div>
    </section>

    <div class="grid lg:grid-cols-2 gap-6">
      <section class="glass rounded-2xl border border-emerald-500/25 p-6 bg-gradient-to-br from-emerald-500/[0.09] to-transparent">
        <div class="flex items-center gap-3 mb-5">
          <span class="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-lg">✓</span>
          <h3 class="text-xl font-bold text-white">Vorteile von Make</h3>
        </div>
        <ul class="space-y-3">
          <li v-for="advantage in makeAdvantages" :key="advantage" class="flex gap-3 text-slate-300 text-sm leading-relaxed">
            <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-none"></span>
            <span>{{ advantage }}</span>
          </li>
        </ul>
      </section>

      <section class="glass rounded-2xl border border-accent-500/25 p-6 bg-gradient-to-br from-accent-500/[0.09] to-transparent">
        <div class="flex items-center gap-3 mb-5">
          <span class="w-10 h-10 rounded-xl bg-accent-500/15 text-accent-400 flex items-center justify-center text-lg">↗</span>
          <h3 class="text-xl font-bold text-white">Vorteile von Buy</h3>
        </div>
        <ul class="space-y-3">
          <li v-for="advantage in buyAdvantages" :key="advantage" class="flex gap-3 text-slate-300 text-sm leading-relaxed">
            <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-400 flex-none"></span>
            <span>{{ advantage }}</span>
          </li>
        </ul>
      </section>
    </div>

    <section class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="px-6 py-5 border-b border-white/10">
        <h3 class="text-xl font-bold text-white">Entscheidungskriterien</h3>
        <p class="text-sm text-slate-400 mt-1">Wichtige Faktoren für eine fundierte Make-or-Buy-Entscheidung.</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[580px] text-sm">
          <thead class="bg-white/[0.03] text-slate-400 text-xs uppercase tracking-wider">
            <tr>
              <th class="text-left px-6 py-4 font-semibold">Kriterium</th>
              <th class="text-left px-6 py-4 font-semibold">Bedeutung</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="criterion in criteria" :key="criterion[0]" class="border-t border-white/[0.06]">
              <td class="px-6 py-4 text-rose-300 font-semibold">{{ criterion[0] }}</td>
              <td class="px-6 py-4 text-slate-300">{{ criterion[1] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="glass rounded-2xl border border-white/10 p-6">
      <h3 class="text-xl font-bold text-white">🎥 Erklärvideo zur Make-or-Buy-Strategie</h3>
      <p class="text-sm text-slate-400 mt-2 mb-5">Das folgende Video erläutert die Grundlagen der Make-or-Buy-Entscheidung und zeigt typische Anwendungsfälle in der Praxis.</p>
      <video controls preload="metadata" class="w-full rounded-xl border border-white/10 bg-black" aria-label="Erklärvideo zur Make-or-Buy-Strategie">
        <source src="/Make_or_Buy_Strategie.mp4" type="video/mp4">
        Dein Browser unterstützt das Videoformat nicht.
      </video>
    </section>
  </div>
</template>
