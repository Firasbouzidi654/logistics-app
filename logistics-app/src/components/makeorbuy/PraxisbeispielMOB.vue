<script setup>
import { ref } from 'vue'

const activeCase = ref(0)

const cases = [
  { label: 'Automotive',  icon: '🚗', color: 'accent' },
  { label: 'Elektronik',  icon: '💡', color: 'violet' },
  { label: 'Luftfahrt',   icon: '✈️',  color: 'rose' },
]
</script>

<template>
  <div class="space-y-8">

    <!-- Hero Banner -->
    <div class="relative glass rounded-2xl border border-white/10 overflow-hidden p-6 md:p-8">
      <div class="orb w-72 h-72 bg-rose-600/10 -top-12 -right-12 pointer-events-none"></div>
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-4 flex-wrap">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase tracking-widest">
            Praxisbeispiel
          </span>
          <span class="text-slate-500 text-sm">3 reale Make-or-Buy Entscheidungen aus der Industrie</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-white mb-3">
          Make-or-Buy in der Praxis<br>
          <span class="gradient-text">Wie Unternehmen entscheiden</span>
        </h2>
        <p class="text-slate-400 leading-relaxed max-w-3xl">
          Die Make-or-Buy-Entscheidung gehört zu den strategisch wichtigsten Weichenstellungen in der
          Produktion. Drei Industriebeispiele zeigen, welche Faktoren den Ausschlag geben —
          und welche Fehler teuer werden können.
        </p>
      </div>
    </div>

    <!-- Case Selector -->
    <div class="flex gap-2 flex-wrap">
      <button
        v-for="(c, i) in cases"
        :key="i"
        :class="[
          'flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200',
          activeCase === i
            ? 'bg-white/10 border-white/25 text-white'
            : 'bg-white/3 border-white/10 text-slate-400 hover:text-white hover:border-white/20',
        ]"
        @click="activeCase = i"
      >
        <span>{{ c.icon }}</span> {{ c.label }}
      </button>
    </div>

    <!-- Cases -->
    <Transition name="tab-fade" mode="out-in">

      <!-- Case 0: Automotive -->
      <div v-if="activeCase === 0" key="0" class="space-y-6">

        <!-- Header card -->
        <div class="glass rounded-2xl border border-accent-500/25 bg-gradient-to-br from-accent-600/12 to-blue-700/8 p-6">
          <div class="flex flex-wrap gap-4 items-start justify-between">
            <div>
              <h3 class="text-xl font-black text-white mb-1">🚗 BMW Group — Elektromotoren</h3>
              <p class="text-slate-400 text-sm">Entscheidung 2019: Eigenfertigung der E-Antriebe für BMW iX3</p>
            </div>
            <div class="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center">
              <p class="text-xs text-slate-400">Entscheidung</p>
              <p class="text-lg font-black text-emerald-400">MAKE ✓</p>
            </div>
          </div>
        </div>

        <!-- Content grid -->
        <div class="grid md:grid-cols-2 gap-6">

          <div class="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 class="text-white font-bold flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs">⚡</span>
              Ausgangslage & Argumente
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex gap-3 items-start">
                <span class="text-emerald-400 font-bold">Pro Make</span>
                <div class="space-y-2 text-slate-300">
                  <p>• Elektromotoren = strategische Kernkompetenz (Differenzierungsmerkmal)</p>
                  <p>• Abhängigkeit von asiatischen Lieferanten (Li-Ion-Technologie) vermeiden</p>
                  <p>• Langfristig: Eigenfertigung günstiger bei Stückzahl &gt; 500.000/Jahr</p>
                  <p>• Qualitätskontrolle & Geheimhaltung eigener Motorenarchitektur</p>
                </div>
              </div>
              <div class="flex gap-3 items-start">
                <span class="text-rose-400 font-bold">Pro Buy</span>
                <div class="space-y-2 text-slate-300">
                  <p>• Anfangsinvestition: € 740 Mio. für neue Fabrik Landshut</p>
                  <p>• Spezialisierte Lieferanten (Bosch, Magna) hätten günstigere Stückpreise</p>
                  <p>• Hochlaufrisiko: Anlaufverluste in den ersten 2 Jahren erwartet</p>
                </div>
              </div>
            </div>
          </div>

          <div class="glass rounded-2xl border border-white/10 p-6">
            <h4 class="text-white font-bold mb-4 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-accent-500/20 text-accent-400 flex items-center justify-center text-xs">📊</span>
              Kostenkalkulation (vereinfacht)
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Fixkosten Fabrik Landshut</span>
                <span class="text-white font-bold">€ 740 Mio.</span>
              </div>
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Variable Kosten/Motor (Make)</span>
                <span class="text-emerald-400 font-bold">€ 890</span>
              </div>
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Einkaufspreis/Motor (Buy)</span>
                <span class="text-accent-400 font-bold">€ 1.180</span>
              </div>
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Break-even</span>
                <span class="text-amber-400 font-bold">2,55 Mio. Stück</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-slate-400">Erreicht bei Planmenge 2025</span>
                <span class="text-emerald-400 font-bold">✓ Überschritten</span>
              </div>
            </div>
            <div class="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
              ✓ <strong>Ergebnis 2023:</strong> BMW spart € 290/Motor gegenüber Fremdbezug.
              Bei 800.000 Motoren/Jahr = € 232 Mio. Einsparung p.a.
            </div>
          </div>
        </div>

      </div>

      <!-- Case 1: Elektronik -->
      <div v-else-if="activeCase === 1" key="1" class="space-y-6">

        <div class="glass rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/12 to-purple-700/8 p-6">
          <div class="flex flex-wrap gap-4 items-start justify-between">
            <div>
              <h3 class="text-xl font-black text-white mb-1">💡 Apple Inc. — A-Series Chips</h3>
              <p class="text-slate-400 text-sm">Entscheidung 2010: Eigenentwicklung des A4-Prozessors (iPhone 4)</p>
            </div>
            <div class="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center">
              <p class="text-xs text-slate-400">Entscheidung</p>
              <p class="text-lg font-black text-emerald-400">MAKE ✓</p>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 class="text-white font-bold">Strategische Begründung</h4>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex gap-3">
                <span class="text-violet-400 font-bold flex-shrink-0">→</span>
                Intel/ARM-Prozessoren = nicht differenzierend; alle Wettbewerber (Samsung, HTC) nutzen identische Chips
              </li>
              <li class="flex gap-3">
                <span class="text-violet-400 font-bold flex-shrink-0">→</span>
                Eigenentwicklung ermöglicht Hardware-Software-Optimierung: iOS und Chip perfekt aufeinander abgestimmt
              </li>
              <li class="flex gap-3">
                <span class="text-violet-400 font-bold flex-shrink-0">→</span>
                Geheimhaltung proprietärer Architektur (Neural Engine, Secure Enclave)
              </li>
              <li class="flex gap-3">
                <span class="text-violet-400 font-bold flex-shrink-0">→</span>
                Stückzahlen (500+ Mio. iPhones/Jahr) machen Eigenfertigung wirtschaftlich
              </li>
            </ul>
          </div>

          <div class="glass rounded-2xl border border-white/10 p-6">
            <h4 class="text-white font-bold mb-4">Ergebnis (2010 → heute)</h4>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-slate-400">Leistungsvorsprung vs. Konkurrenz</span>
                  <span class="text-violet-400 font-bold">+40–70%</span>
                </div>
                <div class="h-2 bg-surface-700 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full" style="width:70%"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-slate-400">Energieeffizienz-Vorsprung</span>
                  <span class="text-violet-400 font-bold">+35%</span>
                </div>
                <div class="h-2 bg-surface-700 rounded-full overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full" style="width:35%"></div>
                </div>
              </div>
              <div class="mt-4 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
                ✓ Apple Silicon (M1/M2/M3) dominiert Benchmark-Tests. Börsenbewertung stieg von
                $300 Mrd. (2010) auf $3 Billionen (2024). Die Chip-Eigenentwicklung gilt als
                ein Schlüsselfaktor.
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Case 2: Luftfahrt -->
      <div v-else key="2" class="space-y-6">

        <div class="glass rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-600/12 to-pink-700/8 p-6">
          <div class="flex flex-wrap gap-4 items-start justify-between">
            <div>
              <h3 class="text-xl font-black text-white mb-1">✈️ Boeing 787 Dreamliner — Outsourcing-Debakel</h3>
              <p class="text-slate-400 text-sm">Fehlentscheidung 2004: 70% Outsourcing der Komponenten</p>
            </div>
            <div class="px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-center">
              <p class="text-xs text-slate-400">Entscheidung</p>
              <p class="text-lg font-black text-rose-400">BUY ✗</p>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="glass rounded-2xl border border-white/10 p-6 space-y-4">
            <h4 class="text-white font-bold flex items-center gap-2">
              <span class="text-rose-400">⚠️</span> Was schiefging
            </h4>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex gap-3">
                <span class="text-rose-400 font-bold flex-shrink-0">1.</span>
                Boeing vergab 70% der Fertigung an 50+ globale Lieferanten — darunter Strukturteile, Elektronik, Hydraulik
              </li>
              <li class="flex gap-3">
                <span class="text-rose-400 font-bold flex-shrink-0">2.</span>
                Koordinationsprobleme: Schnittstellen passten nicht → 3 Jahre Produktionsstopp
              </li>
              <li class="flex gap-3">
                <span class="text-rose-400 font-bold flex-shrink-0">3.</span>
                Know-how-Verlust: Boeing verlor Fertigungsexpertise für Composite-Materialien
              </li>
              <li class="flex gap-3">
                <span class="text-rose-400 font-bold flex-shrink-0">4.</span>
                Qualitätsprobleme: Li-Ion-Batterien (Zulieferer GS Yuasa) verursachten Brände 2013
              </li>
            </ul>
          </div>

          <div class="glass rounded-2xl border border-white/10 p-6">
            <h4 class="text-white font-bold mb-4">Schadensrechnung</h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Geplanter Erstflug</span>
                <span class="text-white">August 2008</span>
              </div>
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Tatsächlicher Erstflug</span>
                <span class="text-rose-400 font-bold">Dezember 2009 (+16 Monate)</span>
              </div>
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Mehrkosten Gesamtprogramm</span>
                <span class="text-rose-400 font-bold">$ 32 Milliarden</span>
              </div>
              <div class="flex justify-between py-2 border-b border-white/5">
                <span class="text-slate-400">Nachverhandlungskosten</span>
                <span class="text-rose-400 font-bold">$ 2,5 Mrd. Strafzahlungen</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-slate-400">Börsenkurs Boeing (2020)</span>
                <span class="text-rose-400 font-bold">–60% vs. Höchststand</span>
              </div>
            </div>
            <div class="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              ⚠️ <strong>Lektion:</strong> Kernkompetenzen (Flugzeugstruktur, Sicherheitssysteme) nie vollständig
              auslagern. Boeing kaufte danach mehrere Zulieferer zurück (Re-Insourcing).
            </div>
          </div>
        </div>

        <!-- Key lesson -->
        <div class="glass rounded-2xl border border-amber-500/25 bg-gradient-to-r from-amber-600/10 to-transparent p-6">
          <div class="flex gap-4">
            <span class="text-2xl flex-shrink-0">📚</span>
            <div>
              <h4 class="text-white font-bold mb-2">Was dieser Fall für die Make-or-Buy-Entscheidung bedeutet</h4>
              <p class="text-slate-300 text-sm leading-relaxed">
                Boeing bewertete nur die <strong class="text-white">kurzfristigen Kostenvorteile</strong> des Outsourcings,
                ignorierte aber <strong class="text-white">Koordinationskosten, Know-how-Verlust und Lieferantenrisiken</strong>.
                Eine vollständige Make-or-Buy-Analyse hätte die strategische Bedeutung der Eigenentwicklung
                struktureller Luftfahrtkomponenten als K.O.-Kriterium identifiziert — und die Entscheidung
                wahrscheinlich anders ausgehen lassen.
              </p>
            </div>
          </div>
        </div>

      </div>

    </Transition>

    <!-- Comparison table -->
    <div class="glass rounded-2xl border border-white/10 overflow-hidden">
      <div class="px-6 py-4 border-b border-white/10">
        <h3 class="text-white font-bold">Entscheidungsvergleich — die 3 Fälle im Überblick</h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full data-table">
          <thead>
            <tr class="bg-surface-800/50">
              <th>Unternehmen</th>
              <th>Produkt</th>
              <th class="text-center">Entscheidung</th>
              <th>Hauptgrund</th>
              <th class="text-center">Ergebnis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="font-medium text-white">BMW Group</td>
              <td>Elektromotoren</td>
              <td class="text-center">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">MAKE</span>
              </td>
              <td class="text-slate-300">Kernkompetenz E-Mobilität, Break-even überschritten</td>
              <td class="text-center text-emerald-400 font-bold">✓ Erfolgreich</td>
            </tr>
            <tr>
              <td class="font-medium text-white">Apple Inc.</td>
              <td>A-Series Chips</td>
              <td class="text-center">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">MAKE</span>
              </td>
              <td class="text-slate-300">Differenzierung, HW-SW-Integration, Stückzahlen</td>
              <td class="text-center text-emerald-400 font-bold">✓ Erfolgreich</td>
            </tr>
            <tr>
              <td class="font-medium text-white">Boeing</td>
              <td>787 Dreamliner (70%)</td>
              <td class="text-center">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">BUY</span>
              </td>
              <td class="text-slate-300">Kostenreduktion, Fokus aufs Design</td>
              <td class="text-center text-rose-400 font-bold">✗ Fehlgeschlagen</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.tab-fade-enter-from { opacity: 0; transform: translateY(10px); }
.tab-fade-leave-to   { opacity: 0; transform: translateY(-6px); }
</style>
