<script setup>
import { ref } from 'vue'
import { TREE } from '../../stores/stueckliste'

const expanded = ref(new Set(['SA-001', 'SA-002', 'SA-003', 'SA-004']))

function toggle(id) {
  expanded.value.has(id) ? expanded.value.delete(id) : expanded.value.add(id)
}

const groupColors = {
  Antrieb:   { bg: 'bg-accent-500/15',  border: 'border-accent-500/30',  text: 'text-accent-400',  dot: 'bg-accent-400'  },
  Sensorik:  { bg: 'bg-violet-500/15',  border: 'border-violet-500/30',  text: 'text-violet-400',  dot: 'bg-violet-400'  },
  Steuerung: { bg: 'bg-emerald-500/15', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  Energie:   { bg: 'bg-amber-500/15',   border: 'border-amber-500/30',   text: 'text-amber-400',   dot: 'bg-amber-400'   },
  Mechanik:  { bg: 'bg-rose-500/15',    border: 'border-rose-500/30',    text: 'text-rose-400',    dot: 'bg-rose-400'    },
}

const defaultColor = { bg: 'bg-white/5', border: 'border-white/10', text: 'text-slate-300', dot: 'bg-slate-400' }
function gc(group) { return groupColors[group] || defaultColor }
</script>

<template>
  <div class="glass rounded-2xl border border-white/10 overflow-hidden">
    <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between">
      <div>
        <h3 class="text-white font-semibold">Produktstruktur · Stückliste</h3>
        <p class="text-slate-500 text-xs mt-0.5">Mehrstufige Stücklistenstruktur — Baugruppen klickbar</p>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-500">
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-violet-400/80 inline-block"></span>Endprodukt</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm bg-accent-400/80 inline-block"></span>Baugruppe</span>
        <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-slate-400/60 inline-block"></span>Komponente</span>
      </div>
    </div>

    <div class="p-6">
      <!-- Level 0: Finished Product -->
      <div class="flex flex-col items-center">
        <div class="w-full max-w-sm bg-gradient-to-br from-violet-600/25 to-purple-700/15 border border-violet-500/40 rounded-2xl px-5 py-4 text-center shadow-card">
          <div class="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 mb-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 text-violet-400">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <p class="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-0.5">{{ TREE.id }} · Fertigprodukt</p>
          <h4 class="text-white font-bold text-base">{{ TREE.name }}</h4>
          <p class="text-slate-400 text-xs mt-1">Menge: {{ TREE.qty }} Stück</p>
        </div>

        <!-- Connector line down -->
        <div class="w-px h-8 bg-gradient-to-b from-violet-500/50 to-white/10"></div>

        <!-- Level 1: Assemblies -->
        <div class="w-full grid grid-cols-2 xl:grid-cols-4 gap-4 relative">
          <!-- Top connecting bar -->
          <div class="absolute top-0 inset-x-[12.5%] h-px bg-white/10 hidden xl:block"></div>

          <div
            v-for="assembly in TREE.children"
            :key="assembly.id"
            class="flex flex-col items-center"
          >
            <!-- Vertical connector from top bar -->
            <div class="w-px h-4 bg-white/10"></div>

            <!-- Assembly card -->
            <button
              :class="[
                'w-full rounded-xl px-4 py-3 border text-left transition-all duration-200',
                'hover:scale-105 hover:shadow-glow active:scale-95',
                gc(assembly.group).bg, gc(assembly.group).border,
              ]"
              @click="toggle(assembly.id)"
            >
              <div class="flex items-center justify-between mb-1">
                <span :class="['text-xs font-bold uppercase tracking-wider', gc(assembly.group).text]">{{ assembly.id }}</span>
                <svg
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                  :class="['w-3.5 h-3.5 transition-transform duration-200', gc(assembly.group).text, expanded.has(assembly.id) ? 'rotate-180' : '']"
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
              <p class="text-white text-sm font-semibold leading-tight">{{ assembly.name }}</p>
              <p class="text-slate-400 text-xs mt-1">{{ assembly.children.length }} Komponenten</p>
            </button>

            <!-- Level 2: Components (collapsible) -->
            <Transition name="tree-expand">
              <div v-if="expanded.has(assembly.id)" class="w-full mt-2 space-y-1.5">
                <div class="w-px h-2 bg-white/10 mx-auto"></div>
                <div
                  v-for="(comp, ci) in assembly.children"
                  :key="comp.id"
                  class="relative"
                >
                  <!-- Side connector -->
                  <div class="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-px bg-white/15"></div>
                  <div
                    :class="[
                      'ml-2 bg-white/4 border border-white/8 rounded-lg px-3 py-2',
                      'hover:bg-white/8 hover:border-white/15 transition-colors',
                    ]"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-slate-500 font-mono">{{ comp.id }}</span>
                      <span class="text-xs text-slate-400 font-medium">×{{ comp.qty }}</span>
                    </div>
                    <p class="text-slate-300 text-xs font-medium leading-tight mt-0.5">{{ comp.name }}</p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tree-expand-enter-active, .tree-expand-leave-active { transition: all 0.25s ease; }
.tree-expand-enter-from, .tree-expand-leave-to { opacity: 0; transform: translateY(-6px); }
</style>
