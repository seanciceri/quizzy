<script setup>
import { useQuiz } from './composables/useQuiz'
import AnswerButton from './components/AnswerButton.vue'
import LifelinesPanel from './components/LifelinesPanel.vue'
import FinalScreen from './components/FinalScreen.vue'

// Chiamiamo il composable: da qui in poi abbiamo accesso
// a tutto lo stato e le funzioni del gioco
const {
  gameStatus,
  currentQuestion,
  currentPrize,
  currentIndex,
  selectedAnswer,
  isAnswerRevealed,
  errorMessage,
  disabledAnswers,
  lifelines,
  startGame,
  selectAnswer,
  confirmAnswer,
  nextQuestion,
  useFiftyFifty,
  resetGame,
  hintedAnswer,
  useHint,
  guaranteedPrize,
} = useQuiz()

// Funzione di supporto solo per la UI: decide il colore del bottone
// in base allo stato (selezionata, corretta, sbagliata, normale)
function answerClasses(answer) {
  if (!isAnswerRevealed.value) {
    if (selectedAnswer.value === answer) {
      return 'bg-blue-600 border-blue-400'
    }
    // ← nuovo: bordo giallo pulsante sulla risposta suggerita
    if (hintedAnswer.value === answer) {
      return 'bg-[#54C739] border-yellow-400 ring-2 ring-yellow-400 animate-pulse'
    }
    return 'bg-[#FEC64B] border-slate-600 hover:bg-[#FF9F1C] text-[#29165C] font-bold'
  }
  // dopo la conferma: mostriamo verde/rosso (invariato)
  if (answer === currentQuestion.value.correct_answer) {
    return 'bg-green-600 border-green-400'
  }
  if (answer === selectedAnswer.value) {
    return 'bg-red-600 border-red-400'
  }
  return 'bg-slate-800 border-slate-700 opacity-50'
}
</script>

<template>
  <div class="min-h-screen bg-quiz-bg text-white flex items-center justify-center p-4">
    
    <!-- SCHERMATA INIZIALE -->
    <div v-if="gameStatus === 'idle'" class="text-center">
      <h1 class="text-6xl sm:text-8xl md:text-[140px] lg:text-[180px] font-black mb-4 text-[#FAB724] font-titanone text-center [-webkit-text-stroke:5px_#8337E4]">
  QUIZZY
</h1>
      <p class="text-slate-400 mb-6">{{ errorMessage }}</p>
        <button
    @click="startGame"
    class="bg-[#FCBC2C] hover:bg-[#F5A900] px-8 sm:px-12 md:px-16 lg:px-20 py-3 rounded-full text-2xl sm:text-3xl md:text-4xl lg:text-[50px] font-bold transition-colors text-[#29165B] font-quicksand"
  >
    START
  </button>
    </div>

    <!-- CARICAMENTO -->
    <div v-else-if="gameStatus === 'loading'" class="text-center font-quicksand">
      <p class="text-xl">Loading questions...</p>
    </div>

    <!-- GIOCO IN CORSO -->
    <div v-else-if="gameStatus === 'playing' && currentQuestion" class="w-full max-w-2xl">
      <div class="flex justify-between mb-4 text-slate-400 text-base sm:text-lg">
        <span>Question {{ currentIndex + 1 }} / 15</span>
        <span class="font-bold text-yellow-400">€{{ currentPrize.toLocaleString() }}</span>
      </div>

      <!-- Aiuto 50:50 -->
      <button
        v-if="!lifelines.fiftyFifty.used"
        @click="useFiftyFifty"
        class="mb-4 bg-[#2E8AFD] rounded-full hover:bg-[#176FD6] px-4 py-2 rounded text-sm text-[#29165B] font-bold"
      >
        🌗 50:50
      </button>

            <button
        v-if="!lifelines.hint.used"
        @click="useHint"
        class="mb-4 ml-2 bg-[#F53198] rounded-full hover:bg-[#D91F7D] px-4 py-2 rounded text-sm text-[#29165B] font-bold"
      >
        &#x1F52E ASK THE GENIE
      </button>

      <div class="bg-[#F4EEE7] rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
        <h2 class="text-lg sm:text-xl md:text-2xl text-[#29165C] font-semibold leading-snug">{{ currentQuestion.question }}</h2>
      </div>

            <button
        @click="resetGame"
        class="fixed top-4 right-4 mb-4 bg-[#1BC29F] hover:bg-slate-600 px-4 py-2 rounded text-sm font-bold"
      >
        ← Back Home
      </button>

      <div class="grid grid-cols-1 gap-3">
  <AnswerButton
    v-for="(answer, index) in currentQuestion.answers"
    :key="answer"
    :answer="answer"
    :index="index"
    :is-selected="selectedAnswer === answer"
    :is-revealed="isAnswerRevealed"
    :is-correct="answer === currentQuestion.correct_answer"
    :is-hinted="hintedAnswer === answer"
    :is-hidden="disabledAnswers.includes(answer)"
    @select="selectAnswer"
  />
</div>

      <div class="mt-6 text-center"> 
        <button
          v-if="selectedAnswer && !isAnswerRevealed"
          @click="confirmAnswer"
          class="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold"
        >
          FINAL ANSWER
        </button>
        <button
          v-else-if="isAnswerRevealed && selectedAnswer === currentQuestion.correct_answer"
          @click="nextQuestion"
          class="bg-[#F5A905] hover:bg-blue-700 px-6 py-2 rounded-lg font-bold"
        >
          NEXT QUESTION
        </button>
      </div>
    </div>

    <!-- VITTORIA -->
    <FinalScreen
  v-else-if="gameStatus === 'won' || gameStatus === 'lost'"
  :status="gameStatus"
  :questions-reached="currentIndex + 1"
  :prize="guaranteedPrize"
  @restart="resetGame"
/>

     <footer class="fixed bottom-0 left-0 right-0 text-center py-2 text-xs text-slate-500">
      Made by Sean
    </footer>

  </div>
</template>