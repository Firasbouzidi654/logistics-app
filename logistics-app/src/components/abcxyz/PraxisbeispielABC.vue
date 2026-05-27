<script setup>
import { ref } from 'vue'

const activeStep = ref(0)

const steps = [
  {
    icon: '🏭',
    label: 'Situation',
    title: 'Ausgangslage: Maschinenbau GmbH Augsburg',
    color: 'from-blue-600/20 to-indigo-600/10',
    border: 'border-blue-500/25',
    accent: 'text-blue-400',
  },
  {
    icon: '📊',
    label: 'Analyse',
    title: 'ABC/XYZ Klassifikation — Ergebnisse',
    color: 'from-accent-600/20 to-blue-600/10',
    border: 'border-accent-500/25',
    accent: 'text-accent-400',
  },
  {
    icon: '⚡',
    label: 'Maßnahmen',
    title: 'Strategische Handlungsempfehlungen',
    color: 'from-emerald-600/20 to-teal-600/10',
    border: 'border-emerald-500/25',
    accent: 'text-emerald-400',
  },
  {
    icon: '📈',
    label: 'Ergebnis',
    title: 'Ergebnis & Einsparungspotenzial',
    color: 'from-violet-600/20 to-purple-600/10',
    border: 'border-violet-500/25',
    accent: 'text-violet-400',
  },
]

const matrixData = [
  { class: 'AX', make: 'bg-rose-500',   desc: 'Hoher Wert, stabile Nachfrage → Eigenproduktion, Rahmenverträge',         count: 2,  icon: '🔴' },
  { class: 'AY', make: 'bg-orange-500',  desc: 'Hoher Wert, schwankende Nachfrage → Sicherheitsbestand erhöhen',          count: 1,  icon: '🟠' },
  { class: 'AZ', make: 'bg-amber-500',   desc: 'Hoher Wert, unregelmäßig → Just-in-time vom Lieferanten',                 count: 1,  icon: '🟡' },
  { class: 'BX', make: 'bg-lime-600',    desc: 'Mittelwert, stabil → Standardbestellungen, mittlere Lagermengen',         count: 2,  icon: '🟢' },
  { class: 'BY', make: 'bg-teal-600',    desc: 'Mittelwert, schwankend → Bestandsoptimierung durch Simulation',           count: 1,  icon: '🔵' },
  { class: 'CX', make: 'bg-slate-600',   desc: 'Geringer Wert, stabil → Auffüllung nach Bedarf, Kanban-System',           count: 1,  icon: '⚪' },
  { class: 'CZ', make: 'bg-gray-600',    desc: 'Geringer Wert, unregelmäßig → Minimalbestand, Bedarfsauslösung',          count: 2,  icon: '⚫' },
]
</script>

<template>
  <div class="space-y-8">

    <!-- Intro Banner -->
    <div class="relative glass rounded-2xl border border-white/10 overflow-hidden p-6 md:p-8">
      <div class="orb w-64 h-64 bg-blue-600/12 -top-10 -right-10 pointer-events-none"></div>
      <div class="relative z-10 max-w-3xl">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 rounded-full text-xs font-bold bg-accent-500/20 text-accent-400 border border-accent-500/30 uppercase tracking-widest">
            Praxisbeispiel
          </span>
          <span class="text-slate-500 text-sm">Reales Unternehmensbeispiel aus dem Maschinenbau</span>
        </div>
        <h2 class="text-2xl md:text-3xl font-black text-white mb-3">
          Maschinenbau GmbH Augsburg<br>
          <span class="gradient-text">Ersatzteil-Lagerverwaltung optimieren</span>
        </h2>
        <p class="text-slate-400 leading-relaxed">
          Die Maschinenbau GmbH Augsburg führt <strong class="text-white">850 Ersatzteilartikel</strong> im Lager.
          Hohe Kapitalbindung (€ 2,4 Mio.) und häufige Lieferengpässe zwingen das Unternehmen,
          die Bestandsstrategie grundlegend zu überarbeiten. Die ABC/XYZ-Analyse identifiziert
          Optimierungspotenziale in drei Wochen.
        </p>
        <div class="mt-5 flex flex-wrap gap-3 text-sm">
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-blue-400">📦</span> 850 Lagerartikel
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-rose-400">💰</span> € 2,4 Mio. Kapitalbindung
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-emerald-400">🎯</span> Ziel: –30% Lagerkosten
          </div>
          <div class="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/8">
            <span class="text-amber-400">⏱️</span> 3 Wochen Analyse
          </div>
        </div>
      </div>
    </div>

    <!-- Step Navigation -->
    <div class="flex gap-1 bg-surface-800/60 rounded-xl p-1 flex-wrap">
      <button
        v-for="(step, i) in steps"
        :key="i"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center',
          activeStep === i
            ? 'bg-white/10 text-white border border-white/15'
            : 'text-slate-400 hover:text-white hover:bg-white/5',
        ]"
        @click="activeStep = i"
      >
        <span>{{ step.icon }}</span>
        <span class="hidden sm:inline">{{ step.label }}</span>
      </button>
    </div>

    <!-- Step Content -->
    <Transition name="tab-fade" mode="out-in">

      <!-- Step 0: Situation -->
      <div v-if="activeStep === 0" key="0">
        <div class="grid md:grid-cols-2 gap-6">

          <!-- Problem description -->
          <div class="glass rounded-2xl border border-white/10 p-6 space-y-5">
            <h3 class="text-white font-bold text-lg flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">⚠</span>
              Ausgangsprobleme
            </h3>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-start gap-3">
                <span class="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span><strong class="text-white">Überbestand</strong> bei C-Artikeln: 68% der Artikel binden nur 8% des Kapitals, aber belegen 45% der Lagerfläche</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span><strong class="text-white">Unterbestand</strong> bei A-Artikeln: 3× monatliche Lieferengpässe bei Hochwertigteilen (€ 500+ pro Stück)</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span><strong class="text-white">Keine Differenzierung</strong>: Alle 850 Artikel mit gleicher Bestellstrategie (wöchentlich, feste Losgröße)</span>
              </li>
              <li class="flex items-start gap-3">
                <span class="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <span><strong class="text-white">Hohe Kapitalbindung</strong>: Lagerhaltungskosten 22% p.a. — € 528.000/Jahr für Zinsen, Miete, Schwund</span>
              </li>
            </ul>
          </div>

          <!-- Pareto 80/20 visualization -->
          <div class="glass rounded-2xl border border-white/10 p-6">
            <h3 class="text-white font-bold text-lg mb-5 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400">📊</span>
              Pareto-Prinzip im Lager
            </h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-xs text-slate-400 mb-2">
                  <span class="font-semibold text-rose-400">A-Artikel (12% der Artikel)</span>
                  <span class="font-bold text-white">€ 1.680.000 · 70% Wert</span>
                </div>
                <div class="h-6 bg-surface-700 rounded-lg overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg transition-all duration-700 flex items-center px-2"
                       style="width:70%">
                    <span class="text-white text-xs font-bold">70%</span>
                  </div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs text-slate-400 mb-2">
                  <span class="font-semibold text-amber-400">B-Artikel (20% der Artikel)</span>
                  <span class="font-bold text-white">€ 480.000 · 20% Wert</span>
                </div>
                <div class="h-6 bg-surface-700 rounded-lg overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg transition-all duration-700 flex items-center px-2"
                       style="width:20%">
                    <span class="text-white text-xs font-bold">20%</span>
                  </div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-xs text-slate-400 mb-2">
                  <span class="font-semibold text-slate-400">C-Artikel (68% der Artikel)</span>
                  <span class="font-bold text-white">€ 240.000 · 10% Wert</span>
                </div>
                <div class="h-6 bg-surface-700 rounded-lg overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg transition-all duration-700 flex items-center px-2"
                       style="width:10%">
                    <span class="text-white text-xs font-bold">10%</span>
                  </div>
                </div>
              </div>
            </div>
            <p class="mt-5 text-xs text-slate-500 border-t border-white/8 pt-4">
              ℹ️ Datengrundlage: 24 Monate Verbrauchshistorie · SAP ERP Export
            </p>
          </div>
        </div>
      </div>

      <!-- Step 1: Analysis results -->
      <div v-else-if="activeStep === 1" key="1">
        <div class="space-y-6">
          <div class="glass rounded-2xl border border-white/10 p-6">
            <h3 class="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <span class="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center text-accent-400">⊞</span>
              ABC/XYZ-Matrix — 850 Lagerartikel
            </h3>

            <!-- Matrix grid -->
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr>
                    <th class="pb-3 text-left text-slate-400 font-medium w-16"></th>
                    <th class="pb-3 text-center text-slate-300 font-semibold">X<br><span class="text-xs text-slate-500 font-normal">Stabile Nachfrage<br>VK &lt; 25%</span></th>
                    <th class="pb-3 text-center text-slate-300 font-semibold">Y<br><span class="text-xs text-slate-500 font-normal">Schwankend<br>VK 25–50%</span></th>
                    <th class="pb-3 text-center text-slate-300 font-semibold">Z<br><span class="text-xs text-slate-500 font-normal">Unregelmäßig<br>VK &gt; 50%</span></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr v-for="row in ['A','B','C']" :key="row">
                    <td class="py-3 pr-4">
                      <span :class="[
                        'font-black text-lg',
                        row==='A' ? 'text-rose-400' : row==='B' ? 'text-amber-400' : 'text-slate-400'
                      ]">{{ row }}</span>
                      <span class="block text-xs text-slate-600">
                        {{ row==='A' ? '≤70% kum.' : row==='B' ? '70–90%' : '>90%' }}
                      </span>
                    </td>
                    <td v-for="col in ['X','Y','Z']" :key="col" class="py-3 px-4 text-center">
                      <div :class="[
                        'rounded-xl p-3 border transition-all duration-200 hover:scale-105',
                        row==='A' && col==='X' ? 'bg-rose-500/20 border-rose-500/30' :
                        row==='A' && col==='Y' ? 'bg-orange-500/15 border-orange-500/25' :
                        row==='A' && col==='Z' ? 'bg-amber-500/15 border-amber-500/20' :
                        row==='B'              ? 'bg-teal-500/12 border-teal-500/20' :
                                                 'bg-slate-700/40 border-slate-600/30',
                      ]">
                        <div class="text-xl font-black text-white">
                          {{ row==='A'&&col==='X'?102 : row==='A'&&col==='Y'?68 : row==='A'&&col==='Z'?34 :
                             row==='B'&&col==='X'?170 : row==='B'&&col==='Y'?85 : row==='B'&&col==='Z'?51 :
                             row==='C'&&col==='X'?119 : row==='C'&&col==='Y'?102 : 119 }}
                        </div>
                        <div class="text-xs text-slate-400 mt-1">Artikel</div>
                        <div class="text-xs font-bold mt-1" :class="
                          row==='A' ? 'text-rose-400' : row==='B' ? 'text-teal-400' : 'text-slate-500'
                        ">{{ row+col }}</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Key findings -->
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in matrixData" :key="item.class"
                 class="glass rounded-xl border border-white/8 p-4 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">{{ item.icon }}</span>
                <span class="font-black text-white">{{ item.class }}</span>
                <span class="ml-auto text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">{{ item.count * 51 }} Artikel</span>
              </div>
              <p class="text-xs text-slate-400 leading-relaxed">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Actions -->
      <div v-else-if="activeStep === 2" key="2">
        <div class="grid md:grid-cols-3 gap-6">

          <div class="glass rounded-2xl border border-rose-500/25 bg-gradient-to-br from-rose-600/10 to-transparent p-6">
            <div class="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-xl mb-4">🔴</div>
            <h3 class="text-rose-400 font-bold text-base mb-1">A-Artikel (102 Stk)</h3>
            <p class="text-xs text-slate-500 mb-4">Priorität 1 · Hoher Handlungsbedarf</p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex gap-2"><span class="text-rose-400 flex-shrink-0">→</span>Individuelle Sicherheitsbestände auf Basis σ-Berechnung</li>
              <li class="flex gap-2"><span class="text-rose-400 flex-shrink-0">→</span>Rahmenverträge mit 2 Lieferanten (Dual-Sourcing)</li>
              <li class="flex gap-2"><span class="text-rose-400 flex-shrink-0">→</span>Wöchentliche Bestandsprüfung, Meldebestand einrichten</li>
              <li class="flex gap-2"><span class="text-rose-400 flex-shrink-0">→</span>Lieferantenportal für Echtzeit-Verfügbarkeit einbinden</li>
            </ul>
            <div class="mt-5 text-xs bg-rose-500/10 rounded-lg p-3 border border-rose-500/20">
              <strong class="text-rose-400">Ziel:</strong> 0 Lieferengpässe bei A-Teilen
            </div>
          </div>

          <div class="glass rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-600/10 to-transparent p-6">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl mb-4">🟡</div>
            <h3 class="text-amber-400 font-bold text-base mb-1">B-Artikel (306 Stk)</h3>
            <p class="text-xs text-slate-500 mb-4">Priorität 2 · Optimierungspotenzial</p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex gap-2"><span class="text-amber-400 flex-shrink-0">→</span>Klassische Bestellpunktrechnung (ROP-Formel)</li>
              <li class="flex gap-2"><span class="text-amber-400 flex-shrink-0">→</span>Zweiwöchentlicher Bestellrhythmus, Sammelbestellungen</li>
              <li class="flex gap-2"><span class="text-amber-400 flex-shrink-0">→</span>BZ-Teile: Simulation für Sicherheitsbestand</li>
              <li class="flex gap-2"><span class="text-amber-400 flex-shrink-0">→</span>Lieferantenkonsolidierung: von 12 auf 5 Lieferanten</li>
            </ul>
            <div class="mt-5 text-xs bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
              <strong class="text-amber-400">Ziel:</strong> –20% Bestellkosten durch Bündelung
            </div>
          </div>

          <div class="glass rounded-2xl border border-slate-500/25 bg-gradient-to-br from-slate-600/10 to-transparent p-6">
            <div class="w-10 h-10 rounded-xl bg-slate-500/20 flex items-center justify-center text-xl mb-4">⚪</div>
            <h3 class="text-slate-300 font-bold text-base mb-1">C-Artikel (442 Stk)</h3>
            <p class="text-xs text-slate-500 mb-4">Priorität 3 · Lagerabbau</p>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex gap-2"><span class="text-slate-400 flex-shrink-0">→</span>Kanban-System einführen: 2-Behälter-Prinzip</li>
              <li class="flex gap-2"><span class="text-slate-400 flex-shrink-0">→</span>CZ-Teile: Einzelbestellung auf Abruf (kein Lagerbestand)</li>
              <li class="flex gap-2"><span class="text-slate-400 flex-shrink-0">→</span>138 Artikel mit &lt; 2 Abgängen/Jahr → Listenstreichung</li>
              <li class="flex gap-2"><span class="text-slate-400 flex-shrink-0">→</span>Lagerflächenreduzierung: –340 m²</li>
            </ul>
            <div class="mt-5 text-xs bg-slate-500/10 rounded-lg p-3 border border-slate-500/20">
              <strong class="text-slate-400">Ziel:</strong> Sortiment um 16% reduzieren
            </div>
          </div>

        </div>
      </div>

      <!-- Step 3: Results -->
      <div v-else key="3">
        <div class="space-y-6">

          <!-- KPI Results -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="glass rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-600/15 to-teal-700/10 p-5 text-center">
              <p class="text-3xl font-black text-emerald-400">–34%</p>
              <p class="text-sm text-white font-semibold mt-1">Kapitalbindung</p>
              <p class="text-xs text-slate-500 mt-1">von € 2,4 auf € 1,6 Mio.</p>
            </div>
            <div class="glass rounded-2xl border border-accent-500/25 bg-gradient-to-br from-accent-600/15 to-blue-700/10 p-5 text-center">
              <p class="text-3xl font-black text-accent-400">–28%</p>
              <p class="text-sm text-white font-semibold mt-1">Lagerkosten p.a.</p>
              <p class="text-xs text-slate-500 mt-1">Einsparung € 147.000/Jahr</p>
            </div>
            <div class="glass rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-600/15 to-purple-700/10 p-5 text-center">
              <p class="text-3xl font-black text-violet-400">100%</p>
              <p class="text-sm text-white font-semibold mt-1">A-Lieferfähigkeit</p>
              <p class="text-xs text-slate-500 mt-1">0 Engpässe nach 6 Mon.</p>
            </div>
            <div class="glass rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-600/15 to-orange-700/10 p-5 text-center">
              <p class="text-3xl font-black text-amber-400">–340m²</p>
              <p class="text-sm text-white font-semibold mt-1">Lagerflächenfreigabe</p>
              <p class="text-xs text-slate-500 mt-1">Neue Produktionsfläche</p>
            </div>
          </div>

          <!-- Timeline -->
          <div class="glass rounded-2xl border border-white/10 p-6">
            <h3 class="text-white font-bold text-lg mb-6">Implementierungsfahrplan</h3>
            <div class="relative">
              <!-- Vertical line -->
              <div class="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-rose-500 via-amber-500 to-emerald-500"></div>
              <div class="space-y-6 pl-14">
                <div v-for="(phase, i) in [
                  { week: 'Woche 1–2', title: 'Datenbeschaffung & Analyse', desc: '24-Monate SAP-Export, VK-Berechnung, ABC/XYZ-Klassifikation aller 850 Artikel', color: 'bg-rose-500', done: true },
                  { week: 'Woche 3–4', title: 'Strategieentscheidung', desc: 'Handlungsempfehlungen je Klasse, Lieferantenverhandlungen, Kanban-Planung', color: 'bg-amber-500', done: true },
                  { week: 'Woche 5–8', title: 'Systemkonfiguration SAP', desc: 'Meldebestände einrichten, Dual-Sourcing-Verträge A-Teile, CZ-Artikel sperren', color: 'bg-teal-500', done: true },
                  { week: 'Woche 9–12', title: 'Rollout & Schulung', desc: 'Kanban-Behälter einführen, Lagerumbau, Mitarbeiterschulung Disposition', color: 'bg-accent-500', done: false },
                  { week: 'Monat 4–6', title: 'Monitoring & Feintuning', desc: 'KPI-Überprüfung, Anpassung Sicherheitsbestände, Lieferantenbewertung', color: 'bg-violet-500', done: false },
                ]" :key="i" class="relative">
                  <div :class="['absolute -left-9 top-0.5 w-4 h-4 rounded-full border-2 border-surface-900', phase.color, phase.done ? '' : 'opacity-50']"></div>
                  <div class="flex items-start gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 flex-wrap">
                        <span class="text-xs font-bold uppercase tracking-widest text-slate-500">{{ phase.week }}</span>
                        <span v-if="phase.done" class="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">✓ abgeschlossen</span>
                        <span v-else class="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">⏳ geplant</span>
                      </div>
                      <p class="text-white font-semibold mt-1">{{ phase.title }}</p>
                      <p class="text-slate-400 text-sm mt-1">{{ phase.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Key takeaway -->
          <div class="glass rounded-2xl border border-accent-500/30 bg-gradient-to-r from-accent-600/10 to-blue-600/5 p-6">
            <div class="flex gap-4">
              <div class="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center flex-shrink-0 text-lg">💡</div>
              <div>
                <h4 class="text-white font-bold mb-2">Lehre aus dem Praxisfall</h4>
                <p class="text-slate-300 text-sm leading-relaxed">
                  Die ABC/XYZ-Matrix zeigt, dass <strong class="text-white">nicht alle Artikel gleich behandelt werden dürfen</strong>.
                  Durch die differenzierte Bestandsstrategie — intensive Betreuung für AX-Teile, Kanban für CX-Teile,
                  Bedarfsauslösung für CZ-Teile — konnte die Maschinenbau GmbH innerhalb von 6 Monaten
                  <strong class="text-emerald-400">€ 147.000 Lagerkosten einsparen</strong> und die Lieferfähigkeit von 94% auf 99,8% steigern.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </Transition>
  </div>
</template>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
