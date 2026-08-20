// src/services/triviaApi.js

const BASE_URL = 'https://opentdb.com/api.php'

/**
 * Recupera le domande da Open Trivia DB
 * @param {number} amount - numero di domande (noi useremo 15)
 * @param {string} difficulty - 'easy' | 'medium' | 'hard' (opzionale)
 */
export async function fetchQuestions(amount = 15, difficulty = '') {
  const params = new URLSearchParams({
    amount,
    type: 'multiple', // solo risposte a scelta multipla
  })
  if (difficulty) params.append('difficulty', difficulty)

  const response = await fetch(`${BASE_URL}?${params}`)
  const data = await response.json()

  if (data.response_code !== 0) {
    throw new Error('Errore nel recupero delle domande')
  }

  return data.results.map(decodeQuestion)
}

// Le stringhe di Open Trivia DB arrivano con entità HTML (es. &quot;, &#039;)
// quindi vanno decodificate prima di mostrarle
function decodeQuestion(q) {
  const decode = (str) => {
    const el = document.createElement('textarea')
    el.innerHTML = str
    return el.value
  }

  return {
    question: decode(q.question),
    correct_answer: decode(q.correct_answer),
    // mescoliamo risposta corretta e sbagliate, poi mescoliamo l'ordine
    answers: shuffle([
      decode(q.correct_answer),
      ...q.incorrect_answers.map(decode),
    ]),
    category: decode(q.category),
    difficulty: q.difficulty,
  }
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5)
}