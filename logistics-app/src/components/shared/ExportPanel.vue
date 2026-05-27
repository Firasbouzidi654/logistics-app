<script setup>
import { ref } from 'vue'

const props = defineProps({
  /** 'abc' | 'mob' */
  type: { type: String, required: true },
  /** optional label shown in the panel */
  label: { type: String, default: '' },
})

const loading = ref(null) // 'csv' | 'excel' | 'pdf' | null
const toast   = ref('')

async function run(format) {
  loading.value = format
  toast.value   = ''
  try {
    if (props.type === 'abc') {
      const { exportABCCSV, exportABCExcel, exportABCPDF } = await import('../../composables/useABCExport')
      if (format === 'csv')   exportABCCSV()
      if (format === 'excel') await exportABCExcel()
      if (format === 'pdf')   await exportABCPDF()
    } else {
      const { exportMOBCSV, exportMOBExcel, exportMOBPDF } = await import('../../composables/useMOBExport')
      if (format === 'csv')   exportMOBCSV()
      if (format === 'excel') await exportMOBExcel()
      if (format === 'pdf')   await exportMOBPDF()
    }
    toast.value = `✓ ${format.toUpperCase()} exportiert`
    setTimeout(() => (toast.value = ''), 2800)
  } catch (e) {
    toast.value = '✗ Fehler beim Export'
    console.error(e)
  } finally {
    loading.value = null
  }
}
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <!-- CSV -->
    <button
      class="export-btn group border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-500/10"
      :class="{ 'opacity-60 cursor-wait': loading === 'csv' }"
      :disabled="!!loading"
      @click="run('csv')"
      title="Als CSV exportieren"
    >
      <span class="text-emerald-400 group-hover:scale-110 transition-transform inline-block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      </span>
      <span class="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
        {{ loading === 'csv' ? '…' : 'CSV' }}
      </span>
    </button>

    <!-- Excel -->
    <button
      class="export-btn group border-green-500/30 hover:border-green-400/60 hover:bg-green-500/10"
      :class="{ 'opacity-60 cursor-wait': loading === 'excel' }"
      :disabled="!!loading"
      @click="run('excel')"
      title="Als Excel-Datei exportieren"
    >
      <span class="text-green-400 group-hover:scale-110 transition-transform inline-block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
        </svg>
      </span>
      <span class="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
        {{ loading === 'excel' ? '…' : 'Excel' }}
      </span>
    </button>

    <!-- PDF -->
    <button
      class="export-btn group border-rose-500/30 hover:border-rose-400/60 hover:bg-rose-500/10"
      :class="{ 'opacity-60 cursor-wait': loading === 'pdf' }"
      :disabled="!!loading"
      @click="run('pdf')"
      title="Als PDF exportieren"
    >
      <span class="text-rose-400 group-hover:scale-110 transition-transform inline-block">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-3.5 h-3.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="M9 15v-4h2a2 2 0 010 4H9zM14 11v4M14 11h2"/>
        </svg>
      </span>
      <span class="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
        {{ loading === 'pdf' ? '…' : 'PDF' }}
      </span>
    </button>

    <!-- Toast feedback -->
    <Transition name="toast">
      <span
        v-if="toast"
        class="text-xs font-medium px-3 py-1 rounded-full"
        :class="toast.startsWith('✓') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'"
      >
        {{ toast }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
.export-btn {
  @apply flex items-center gap-1.5 px-3 py-1.5 rounded-lg border
         bg-white/5 backdrop-blur-sm
         transition-all duration-200 active:scale-95;
}

.toast-enter-active, .toast-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
