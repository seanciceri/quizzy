<!-- src/components/FinalScreen.vue -->
<script setup>
defineProps({
  status: { type: String, required: true }, // 'won' | 'lost'
  questionsReached: { type: Number, default: 0 },
  prize: { type: Number, default: 0 },
})

const emit = defineEmits(['restart'])
</script>

<template>
  <div class="text-center">
    <template v-if="status === 'won'">
      <h1 class="text-4xl font-bold text-yellow-400 mb-4">Hai vinto 1.000.000 €! 🎉</h1>
    </template>

    <template v-else>
      <h1 class="text-4xl font-bold text-red-500 mb-4">Game Over</h1>
      <p class="text-slate-400 mb-2">Hai raggiunto la domanda {{ questionsReached }}</p>
      <p class="text-xl font-bold text-yellow-400 mb-6">
        Hai vinto €{{ prize.toLocaleString() }}
      </p>
    </template>

    <button
      @click="emit('restart')"
      class="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
    >
      {{ status === 'won' ? 'Gioca ancora' : 'Riprova' }}
    </button>
  </div>
</template>