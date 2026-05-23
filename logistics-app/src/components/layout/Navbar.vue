<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navItems = [
  { label: 'Startseite', to: '/' },
  { label: 'ABC/XYZ Analyse', to: '/abc-xyz' },
  { label: 'Stücklistenanalyse', to: '/stueckliste', disabled: true },
  { label: 'Make-or-Buy', to: '/make-or-buy', disabled: true },
]

function onScroll() { scrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    :class="[
      'fixed top-0 inset-x-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-surface-900/95 backdrop-blur-xl border-b border-white/10 shadow-xl'
        : 'bg-transparent',
    ]"
  >
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3 group">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500 to-blue-600 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow">
          <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5 text-white" stroke="currentColor" stroke-width="2">
            <path d="M3 7l9-4 9 4v10l-9 4-9-4V7z" />
            <path d="M12 3v18M3 7l9 4 9-4" />
          </svg>
        </div>
        <div class="hidden sm:block">
          <span class="text-white font-bold text-sm leading-none">Logistik Analyse</span>
          <p class="text-slate-400 text-xs">HTW Berlin · SS 2026</p>
        </div>
      </RouterLink>

      <!-- Desktop nav -->
      <ul class="hidden md:flex items-center gap-1">
        <li v-for="item in navItems" :key="item.to">
          <RouterLink
            v-if="!item.disabled"
            :to="item.to"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              route.path === item.to
                ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/10',
            ]"
          >
            {{ item.label }}
          </RouterLink>
          <span
            v-else
            class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 cursor-not-allowed flex items-center gap-1"
          >
            {{ item.label }}
            <span class="text-xs bg-surface-700 text-slate-500 px-1.5 py-0.5 rounded">bald</span>
          </span>
        </li>
      </ul>

      <!-- Badge -->
      <div class="hidden md:flex items-center gap-3">
        <span class="px-3 py-1 rounded-full text-xs font-medium bg-accent-500/15 text-accent-400 border border-accent-500/25">
          Firas Bouzidi · 594251
        </span>
      </div>

      <!-- Mobile toggle -->
      <button
        class="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        @click="mobileOpen = !mobileOpen"
      >
        <svg v-if="!mobileOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
          <path d="M3 12h18M3 6h18M3 18h18" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div
        v-if="mobileOpen"
        class="md:hidden bg-surface-900/98 backdrop-blur-xl border-b border-white/10 px-4 py-4 space-y-1"
      >
        <RouterLink
          v-for="item in navItems.filter(i => !i.disabled)"
          :key="item.to"
          :to="item.to"
          class="block px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-menu-enter-active, .mobile-menu-leave-active { transition: all 0.2s ease; }
.mobile-menu-enter-from, .mobile-menu-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
