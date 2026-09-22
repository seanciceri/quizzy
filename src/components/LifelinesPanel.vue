<!-- src/components/LifelinesPanel.vue -->
<script setup>
defineProps({
  fiftyFiftyUsed: { type: Boolean, default: false },
  hintUsed: { type: Boolean, default: false },
  changeQuestionUsed: { type: Boolean, default: false },
  isChangingQuestion: { type: Boolean, default: false },
})

// Tre eventi distinti, uno per aiuto: il genitore saprà esattamente
// quale aiuto è stato richiesto, senza bisogno di payload aggiuntivi
const emit = defineEmits(['fifty-fifty', 'hint', 'change-question'])
</script>

<template>
  <div class="flex flex-wrap gap-2 mb-2 sm:mb-4">
    <LifelinesPanel
  :fifty-fifty-used="lifelines.fiftyFifty.used"
  :hint-used="lifelines.hint.used"
  :change-question-used="lifelines.changeQuestion.used"
  @fifty-fifty="useFiftyFifty"
  @hint="useHint"
  @change-question="useChangeQuestion"
/>
  </div>
</template>