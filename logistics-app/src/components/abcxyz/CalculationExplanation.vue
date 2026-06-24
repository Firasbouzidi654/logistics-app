<template>
  <section class="glass rounded-2xl border border-white/10 p-5">
    <div class="mb-5">
      <h3 class="text-white font-semibold">How is the classification calculated?</h3>
      <p class="text-slate-500 text-xs mt-1">Vier einfache Schritte von den Artikeldaten bis zur ABC-Klasse.</p>
    </div>

    <div class="flex flex-col md:flex-row md:items-stretch gap-3">
      <article class="flex-1 rounded-xl bg-white/[0.03] border border-white/8 p-4">
        <p class="text-accent-400 text-xs font-bold uppercase tracking-wider">1. Verbrauchswert</p>
        <p class="text-slate-200 text-sm font-medium mt-2">Verbrauchswert = Stückpreis × Jahresverbrauchsmenge</p>
        <p class="text-slate-500 text-xs mt-3">Beispiel:</p>
        <p class="text-slate-300 text-xs mt-1">9.200 € × 120 = 1.104.000 €</p>
      </article>

      <div class="self-center text-accent-400 text-xl font-bold text-center">↓</div>

      <article class="flex-1 rounded-xl bg-white/[0.03] border border-white/8 p-4">
        <p class="text-accent-400 text-xs font-bold uppercase tracking-wider">2. Anteil %</p>
        <p class="text-slate-200 text-sm font-medium mt-2">Anteil % = Verbrauchswert ÷ Gesamtwert × 100</p>
        <p class="text-slate-500 text-xs mt-3">Beispiel:</p>
        <p class="text-slate-300 text-xs mt-1">1.104.000 € ÷ 5.795.100 € × 100 = 19,1 %</p>
      </article>

      <div class="self-center text-accent-400 text-xl font-bold text-center">↓</div>

      <article class="flex-1 rounded-xl bg-white/[0.03] border border-white/8 p-4">
        <p class="text-accent-400 text-xs font-bold uppercase tracking-wider">3. Kumuliert %</p>
        <p class="text-slate-200 text-sm font-medium mt-2">Aktuelle Zeile + vorherige Zeile</p>
        <p class="text-slate-500 text-xs mt-3">Beispiel:</p>
        <p class="text-slate-300 text-xs mt-1">19,1 % → 19,1 %</p>
        <p class="text-slate-300 text-xs mt-1">16,5 % + 19,1 % = 35,6 %</p>
      </article>

      <div class="self-center text-accent-400 text-xl font-bold text-center">↓</div>

      <article class="flex-1 rounded-xl bg-white/[0.03] border border-white/8 p-4">
        <p class="text-accent-400 text-xs font-bold uppercase tracking-wider">4. Klassifikation</p>
        <div class="space-y-1.5 text-xs mt-3">
          <p class="text-rose-300">0–70 % → A-Artikel</p>
          <p class="text-amber-300">70–90 % → B-Artikel</p>
          <p class="text-slate-300">90–100 % → C-Artikel</p>
        </div>
      </article>
    </div>
  </section>
</template>
