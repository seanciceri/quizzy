<!-- src/components/AnswerButton.vue -->
<script setup>
import { computed } from 'vue'

// defineProps dichiara COSA il componente si aspetta di ricevere dal genitore.
// Sono in sola lettura: questo componente non li modifica mai direttamente.
const props = defineProps({
  answer: { type: String, required: true },
  index: { type: Number, required: true },
  isSelected: { type: Boolean, default: false },
  isRevealed: { type: Boolean, default: false },
  isCorrect: { type: Boolean, default: false },   // questa risposta è quella giusta?
  isHinted: { type: Boolean, default: false },    // suggerita dall'aiuto "Chiedi all'amico"?
  isHidden: { type: Boolean, default: false },    // nascosta dal 50:50?
})

// defineEmits dichiara quali eventi questo componente può emettere verso il genitore.
// È buona pratica dichiararli esplicitamente, così chi legge il componente
// sa subito "che tipo di comunicazione" può generare, senza dover leggere tutto il codice.
const emit = defineEmits(['select'])

const letters = ['A', 'B', 'C', 'D']
const letter = computed(() => letters[props.index])

function handleClick() {
  // emettiamo l'evento 'select', passando IL VALORE della risposta come payload.
  // Il genitore, ascoltando questo evento, saprà quale risposta è stata cliccata.
  emit('select', props.answer)
}

// La logica di stile resta qui, vicino a ciò che rappresenta visivamente —
// è "presentazione", non "stato di gioco", quindi appartiene bene a questo componente
const buttonClasses = computed(() => {
  if (!props.isRevealed) {
    if (props.isSelected) return 'bg-blue-600 border-blue-400'
    if (props.isHinted) return 'bg-slate-800 border-yellow-400 ring-2 ring-yellow-400 animate-pulse'
    return 'bg-[#FDC549] hover:bg-[#FDAB4C] text-[#29165C] font-bold font-quicksand'
  }
  if (props.isCorrect) return 'bg-green-600 border-green-400'
  if (props.isSelected) return 'bg-red-600 border-red-400'
  return 'bg-slate-800 border-slate-700 opacity-50'
})
</script>

<template>
  <button
    v-show="!isHidden"
    @click="handleClick"
    :disabled="isRevealed"
    :class="buttonClasses"
    class="border-2 rounded-lg px-3 sm:px-4 py-3 sm:py-4 text-left transition-colors flex items-center gap-2 sm:gap-3 text-sm sm:text-base w-full"
  >
    <span class="font-bold">{{ letter }})</span>
    <span>{{ answer }}</span>
  </button>
</template>