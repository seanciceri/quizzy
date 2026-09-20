// src/composables/useQuiz.js
import { ref, computed } from 'vue'
import { fetchQuestions } from '../services/triviaApi'

// La scala dei premi, come nel gioco vero (15 domande = 15 livelli)
const PRIZE_LADDER = [
  100, 200, 300, 500, 1000,       // domande 1-5 (facili)
  2000, 4000, 8000, 16000, 32000, // domande 6-10 (medie)
  64000, 125000, 250000, 500000, 1000000, // domande 11-15 (difficili)
]

// I "traguardi sicuri": se sbagli, torni almeno a questo importo
const SAFE_HAVENS = [4, 9] // indici 0-based → domanda 5 e domanda 10

export function useQuiz() {
  // --- STATO REATTIVO ---
  const questions = ref([])          // array delle 15 domande
  const currentIndex = ref(0)        // indice della domanda attuale (0-14)
  const selectedAnswer = ref(null)   // risposta scelta dall'utente
  const isAnswerRevealed = ref(false) // true dopo che l'utente conferma
  const gameStatus = ref('idle')     // 'idle' | 'loading' | 'playing' | 'won' | 'lost'
  const errorMessage = ref('')

  // Stato degli aiuti (lifelines)
  const lifelines = ref({
    fiftyFifty: { used: false },
    audience: { used: false },
    phone: { used: false },
    hint: { used: false },
  })
  const disabledAnswers = ref([]) // risposte nascoste dal 50:50
  const hintedAnswer = ref(null)

  // --- COMPUTED (valori derivati, si aggiornano da soli) ---
  const currentQuestion = computed(() => questions.value[currentIndex.value])
  const currentPrize = computed(() => PRIZE_LADDER[currentIndex.value])
  const isLastQuestion = computed(() => currentIndex.value === PRIZE_LADDER.length - 1)

  // --- AZIONI (funzioni che modificano lo stato) ---

  async function startGame() {
    gameStatus.value = 'loading'
    errorMessage.value = ''
    try {
      questions.value = await fetchQuestions(15)
      currentIndex.value = 0
      selectedAnswer.value = null
      isAnswerRevealed.value = false
      disabledAnswers.value = []
      hintedAnswer.value = null
      lifelines.value = {
        fiftyFifty: { used: false },
        audience: { used: false },
        phone: { used: false },
        hint: { used: false },
      }
      gameStatus.value = 'playing'
    } catch (err) {
      errorMessage.value = 'Impossibile caricare le domande. Riprova.'
      gameStatus.value = 'idle'
    }
  }

  function selectAnswer(answer) {
    if (isAnswerRevealed.value) return // blocca cambi dopo la conferma
    selectedAnswer.value = answer
  }

  function confirmAnswer() {
    if (!selectedAnswer.value) return
    isAnswerRevealed.value = true

    const isCorrect = selectedAnswer.value === currentQuestion.value.correct_answer

    if (!isCorrect) {
      // aspettiamo un attimo prima di finire il gioco, per far vedere il colore rosso
      setTimeout(() => {
        gameStatus.value = 'lost'
      }, 2000)
    }
  }

  function nextQuestion() {
    if (isLastQuestion.value) {
      gameStatus.value = 'won'
      return
    }
    currentIndex.value++
    selectedAnswer.value = null
    isAnswerRevealed.value = false
    disabledAnswers.value = []
    hintedAnswer.value = null
  }

  // Aiuto 50:50 → nasconde 2 risposte sbagliate
  function useFiftyFifty() {
    if (lifelines.value.fiftyFifty.used) return
    lifelines.value.fiftyFifty.used = true

    const wrongAnswers = currentQuestion.value.answers.filter(
      (a) => a !== currentQuestion.value.correct_answer
    )
    // ne scegliamo 2 a caso da nascondere
    disabledAnswers.value = shuffle(wrongAnswers).slice(0, 2)
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5)
  }

  // Aiuto "Chiedi all'amico" → rivela direttamente la risposta corretta
function useHint() {
  if (lifelines.value.hint.used) return
  lifelines.value.hint.used = true
  hintedAnswer.value = currentQuestion.value.correct_answer
}

  function resetGame() {
    gameStatus.value = 'idle'
    questions.value = []
    currentIndex.value = 0
  }

  // Quello che il composable "espone" all'esterno
  return {
    questions,
    currentIndex,
    currentQuestion,
    currentPrize,
    selectedAnswer,
    isAnswerRevealed,
    gameStatus,
    errorMessage,
    lifelines,
    disabledAnswers,
    isLastQuestion,
    startGame,
    selectAnswer,
    confirmAnswer,
    nextQuestion,
    hintedAnswer,
    useFiftyFifty,
    useHint, 
    resetGame,
    PRIZE_LADDER,
    SAFE_HAVENS,
  }
}