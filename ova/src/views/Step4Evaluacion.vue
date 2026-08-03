 <script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

/* ================================================================
   UTILIDADES
================================================================ */

function shuffle(arr) {
  const a = [...arr]

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }

  return a
}

/* ================================================================
   EVALUACIÓN
   10 problemas de aceleración con vehículos reales de la región
================================================================ */

const exercises = [
  {
    id: 0,
    type: 'multiple-choice',
    category: '🏍️ Motocicleta — Salida urbana',
    prompt:
      'Una motocicleta que circula por una vía urbana pasa de 0 m/s a 18 m/s en 6 s. ¿Cuál es su aceleración media?',
    hint: 'Usa a = (v_f − v_0) / t.',
    data: {
      options: [
        '2 m/s²',
        '3 m/s²',
        '6 m/s²',
        '108 m/s²'
      ]
    },
    correct: '3 m/s²',
    explanation:
      'a = (18 − 0) / 6 = 3 m/s². La motocicleta aumenta su velocidad 3 m/s cada segundo.'
  },

  {
    id: 1,
    type: 'multiple-choice',
    category: '🚌 Buseta — Ruta intermunicipal',
    prompt:
      'Una buseta pasa de 10 m/s a 22 m/s durante 4 s. ¿Cuál es su aceleración?',
    hint:
      'Primero calcula cuánto cambió la velocidad y después divide entre el tiempo.',
    data: {
      options: [
        '2 m/s²',
        '3 m/s²',
        '4 m/s²',
        '8 m/s²'
      ]
    },
    correct: '3 m/s²',
    explanation:
      'a = (22 − 10) / 4 = 12 / 4 = 3 m/s².'
  },

  {
    id: 2,
    type: 'numeric',
    category: '🚕 Taxi — Incorporación a la vía',
    prompt:
      'Un taxi parte con 8 m/s y acelera a 2 m/s² durante 5 s. ¿Qué velocidad final alcanza?',
    hint: 'Usa v_f = v_0 + a · t.',
    data: {
      answer: 18,
      tolerance: 0.1,
      unit: 'm/s'
    },
    explanation:
      'v_f = 8 + (2 × 5) = 18 m/s.'
  },

  {
    id: 3,
    type: 'multiple-choice',
    category: '🚛 Camión — Transporte de carga',
    prompt:
      'Un camión aumenta su velocidad de 12 m/s a 20 m/s en 8 s. ¿Qué aceleración presenta?',
    hint: 'Usa a = (v_f − v_0) / t.',
    data: {
      options: [
        '0.5 m/s²',
        '1 m/s²',
        '1.5 m/s²',
        '2 m/s²'
      ]
    },
    correct: '1 m/s²',
    explanation:
      'a = (20 − 12) / 8 = 8 / 8 = 1 m/s².'
  },

  {
    id: 4,
    type: 'multiple-choice',
    category: '🚌 Bus — Frenado antes de una parada',
    prompt:
      'Un bus viaja a 20 m/s y reduce su velocidad hasta 8 m/s en 6 s. ¿Cuál es su aceleración?',
    hint:
      'Cuando el vehículo está frenando, el cambio de velocidad es negativo.',
    data: {
      options: [
        '−2 m/s²',
        '−1 m/s²',
        '1 m/s²',
        '2 m/s²'
      ]
    },
    correct: '−2 m/s²',
    explanation:
      'a = (8 − 20) / 6 = −12 / 6 = −2 m/s². El signo negativo indica desaceleración.'
  },

  {
    id: 5,
    type: 'multiple-choice',
    category: '🏍️ Motocicleta — Aceleración en carretera',
    prompt:
      'Una motocicleta aumenta su velocidad de 12 m/s a 30 m/s con una aceleración constante de 3 m/s². ¿Cuánto tiempo tarda?',
    hint:
      'Despeja t de v_f = v_0 + a · t.',
    data: {
      options: [
        '4 s',
        '5 s',
        '6 s',
        '9 s'
      ]
    },
    correct: '6 s',
    explanation:
      't = (30 − 12) / 3 = 18 / 3 = 6 s.'
  },

  {
    id: 6,
    type: 'multiple-choice',
    category: '🚐 Van — Movimiento con aceleración constante',
    prompt:
      'Una van escolar parte con 5 m/s y acelera a 2 m/s² durante 7 s. ¿Cuál es su velocidad final?',
    hint:
      'Multiplica la aceleración por el tiempo y súmala a la velocidad inicial.',
    data: {
      options: [
        '12 m/s',
        '14 m/s',
        '19 m/s',
        '24 m/s'
      ]
    },
    correct: '19 m/s',
    explanation:
      'v_f = 5 + (2 × 7) = 5 + 14 = 19 m/s.'
  },

  {
    id: 7,
    type: 'numeric',
    category: '🚚 Camión — Salida con carga',
    prompt:
      'Un camión pasa de 6 m/s a 18 m/s en 4 s. Calcula su aceleración e ingresa el valor en m/s².',
    hint:
      'a = (18 − 6) / 4.',
    data: {
      answer: 3,
      tolerance: 0.1,
      unit: 'm/s²'
    },
    explanation:
      'a = (18 − 6) / 4 = 12 / 4 = 3 m/s².'
  },

  {
    id: 8,
    type: 'multiple-choice',
    category: '🚕 Taxi — Frenado en una intersección',
    prompt:
      'Un taxi reduce su velocidad de 16 m/s a 4 m/s en 3 s. ¿Cuál es su aceleración media?',
    hint:
      'El valor final es menor que el inicial, por eso el resultado será negativo.',
    data: {
      options: [
        '−4 m/s²',
        '−3 m/s²',
        '3 m/s²',
        '4 m/s²'
      ]
    },
    correct: '−4 m/s²',
    explanation:
      'a = (4 − 16) / 3 = −12 / 3 = −4 m/s².'
  },

  {
    id: 9,
    type: 'numeric',
    category: '🚌 Bus intermunicipal — Problema final',
    prompt:
      'Un bus intermunicipal viaja a 10 m/s y acelera constantemente a 2.5 m/s² durante 8 s. Calcula su velocidad final.',
    hint:
      'Usa v_f = v_0 + a · t.',
    data: {
      answer: 30,
      tolerance: 0.1,
      unit: 'm/s'
    },
    explanation:
      'v_f = 10 + (2.5 × 8) = 10 + 20 = 30 m/s.'
  }
]

/* ================================================================
   ESTADO
================================================================ */

const currentQuestion = ref(0)
const isSubmitted = ref(false)
const showHint = ref(false)

const hintsUsed = reactive({})
const checked = reactive({})
const answers = reactive({})

const currentEx = computed(() => exercises[currentQuestion.value])

const feedbackVisible = computed(() => {
  return !!checked[currentQuestion.value]
})

const isHintUsedForCurrent = computed(() => {
  return !!hintsUsed[currentQuestion.value]
})

/* ================================================================
   RESPUESTAS
================================================================ */

function setAnswer(value) {
  if (checked[currentQuestion.value]) return

  answers[currentQuestion.value] = value
}

function isAnswered(i) {
  const value = answers[i]

  return value !== undefined &&
    value !== null &&
    value !== ''
}

function checkCorrect(i) {
  const ex = exercises[i]
  const value = answers[i]

  if (!isAnswered(i)) return false

  if (ex.type === 'numeric') {
    return (
      Math.abs(
        Number(value) - ex.data.answer
      ) <= ex.data.tolerance
    )
  }

  return value === ex.correct
}

/* ================================================================
   RETROALIMENTACIÓN INMEDIATA
================================================================ */

function submitCurrentAnswer() {
  const i = currentQuestion.value

  if (checked[i]) return

  if (!isAnswered(i)) return

  checked[i] = true
  showHint.value = false
}

function getFeedbackTitle(i) {
  return checkCorrect(i)
    ? '✅ ¡Respuesta correcta!'
    : '❌ Respuesta incorrecta'
}

function getFeedbackClass(i) {
  return checkCorrect(i)
    ? 'feedback-correct'
    : 'feedback-incorrect'
}

/* ================================================================
   NAVEGACIÓN
================================================================ */

function nextQuestion() {
  if (!checked[currentQuestion.value]) return

  showHint.value = false

  currentQuestion.value++
}

function prevQuestion() {
  showHint.value = false

  currentQuestion.value--
}

function triggerHint() {
  showHint.value = true

  hintsUsed[currentQuestion.value] = true
}

/* ================================================================
   RESULTADOS
================================================================ */

const correctCount = computed(() => {
  return exercises.reduce((sum, _, i) => {
    return sum + (checkCorrect(i) ? 1 : 0)
  }, 0)
})

const scorePercentage = computed(() => {
  return Math.round(
    (correctCount.value / exercises.length) * 100
  )
})

const resultFeedback = computed(() => {
  if (scorePercentage.value === 100) {
    return {
      title: '🌟 ¡Excelente trabajo!',
      body:
        'Respondiste correctamente los 10 problemas de aceleración y aplicaste las ecuaciones del MRUA con precisión.'
    }
  }

  if (scorePercentage.value >= 70) {
    return {
      title: '🎉 ¡Muy buen trabajo!',
      body:
        'Comprendes los conceptos principales de aceleración. Revisa las explicaciones de las preguntas que fallaste para fortalecer tu aprendizaje.'
    }
  }

  if (scorePercentage.value >= 40) {
    return {
      title: '📚 Vas por buen camino',
      body:
        'Tienes algunos conceptos claros, pero necesitas practicar más el cálculo de aceleración, velocidad final y desaceleración.'
    }
  }

  return {
    title: '🛠️ Necesitas repasar MRUA',
    body:
      'Revisa las fórmulas y las explicaciones de cada ejercicio. Después puedes volver a realizar la evaluación.'
  }
})

function finishEvaluation() {
  if (!checked[currentQuestion.value]) return

  isSubmitted.value = true
}

/* ================================================================
   REINICIAR
================================================================ */

function restartEvaluation() {
  currentQuestion.value = 0
  isSubmitted.value = false
  showHint.value = false

  Object.keys(hintsUsed).forEach(
    key => delete hintsUsed[key]
  )

  Object.keys(checked).forEach(
    key => delete checked[key]
  )

  Object.keys(answers).forEach(
    key => delete answers[key]
  )
}

onMounted(() => {
  // Evaluación iniciada
})

onUnmounted(() => {
  // Limpieza
})
</script>


<template>

  <div class="eval-container">

    <!-- =========================================================
         ENCABEZADO
    ========================================================== -->

    <header class="eval__header">

      <div class="eval__title">

        <span class="badge-pill">
          Módulo 4 · Evaluación Final
        </span>

        <h2>
          Evaluación de Física y MRUA
        </h2>

        <p class="subtitle">
          10 problemas de aceleración con vehículos reales de la región,
          retroalimentación inmediata y explicación de cada respuesta.
        </p>

      </div>

    </header>


    <div class="eval__body">

      <!-- =======================================================
           EVALUACIÓN
      ======================================================== -->

      <section
        v-if="!isSubmitted"
        class="panel eval-panel"
      >

        <div class="eval-card">

          <!-- PROGRESO -->

          <div class="progress-bar-container">

            <div class="progress-info">

              <span>
                Problema {{ currentQuestion + 1 }}
                de {{ exercises.length }}
              </span>

              <button
                @click="triggerHint"
                class="btn-hint"
                :disabled="
                  isHintUsedForCurrent ||
                  feedbackVisible
                "
              >
                💡

                {{
                  isHintUsedForCurrent
                    ? 'Pista Consultada'
                    : 'Solicitar Pista'
                }}

              </button>

            </div>


            <div class="progress-track">

              <div
                class="progress-fill"
                :style="{
                  width:
                    `${((currentQuestion + 1) /
                    exercises.length) * 100}%`
                }"
              ></div>

            </div>

          </div>


          <!-- PISTA -->

          <div
            v-if="showHint"
            class="hint-box"
          >

            <div class="hint-content">

              <span>

                💡

                <strong>
                  Pista del Tutor:
                </strong>

                {{ currentEx.hint }}

              </span>

              <button
                @click="showHint = false"
                class="btn-close-hint"
              >
                ✕
              </button>

            </div>

          </div>


          <!-- PREGUNTA -->

          <div class="question-box">

            <span class="category-tag">
              {{ currentEx.category }}
            </span>


            <h3 class="question-text">

              {{ currentEx.prompt }}

            </h3>


            <!-- =================================================
                 OPCIONES MÚLTIPLE
            ================================================== -->

            <div
              v-if="
                currentEx.type ===
                'multiple-choice'
              "
              class="options-grid"
            >

              <button
                v-for="
                  option in currentEx.data.options
                "
                :key="option"
                class="answer-option"

                :class="{

                  selected:
                    answers[currentQuestion] === option,

                  correct:
                    feedbackVisible &&
                    option === currentEx.correct,

                  wrong:
                    feedbackVisible &&
                    answers[currentQuestion] === option &&
                    option !== currentEx.correct

                }"

                :disabled="feedbackVisible"

                @click="
                  setAnswer(option);
                  submitCurrentAnswer()
                "
              >

                <span class="option-letter">

                  {{
                    String.fromCharCode(
                      65 +
                      currentEx.data.options.indexOf(option)
                    )
                  }}

                </span>


                <span>
                  {{ option }}
                </span>


                <span
                  v-if="
                    feedbackVisible &&
                    option === currentEx.correct
                  "
                  class="option-status"
                >
                  ✓
                </span>


                <span
                  v-if="
                    feedbackVisible &&
                    answers[currentQuestion] === option &&
                    option !== currentEx.correct
                  "
                  class="option-status"
                >
                  ✕
                </span>

              </button>

            </div>


            <!-- =================================================
                 RESPUESTA NUMÉRICA
            ================================================== -->

            <div
              v-else-if="
                currentEx.type === 'numeric'
              "
              class="numeric-answer"
            >

              <div class="numeric-display">

                <input
                  v-model="answers[currentQuestion]"
                  type="number"
                  step="0.1"
                  inputmode="decimal"

                  :disabled="feedbackVisible"

                  placeholder="Escribe tu respuesta"

                  @keyup.enter="
                    submitCurrentAnswer
                  "
                />

                <span>
                  {{ currentEx.data.unit }}
                </span>

              </div>


              <button
                v-if="!feedbackVisible"

                class="btn-eng run"

                :disabled="
                  !isAnswered(currentQuestion)
                "

                @click="
                  submitCurrentAnswer
                "
              >

                ✓ COMPROBAR RESPUESTA

              </button>

            </div>


            <!-- =================================================
                 RETROALIMENTACIÓN INMEDIATA
            ================================================== -->

            <transition name="feedback">

              <div
                v-if="feedbackVisible"

                class="instant-feedback"

                :class="
                  getFeedbackClass(
                    currentQuestion
                  )
                "
              >

                <div class="feedback-title">

                  {{
                    getFeedbackTitle(
                      currentQuestion
                    )
                  }}

                </div>


                <p
                  v-if="
                    !checkCorrect(
                      currentQuestion
                    )
                  "
                  class="feedback-answer"
                >

                  <strong>
                    Respuesta correcta:
                  </strong>

                  {{
                    currentEx.correct ??
                    (
                      currentEx.data.answer +
                      ' ' +
                      currentEx.data.unit
                    )
                  }}

                </p>


                <p>

                  <strong>
                    ¿Por qué?
                  </strong>

                  {{ currentEx.explanation }}

                </p>

              </div>

            </transition>

          </div>


          <!-- =================================================
               BOTONES
          ================================================== -->

          <div class="eval-actions">

            <button
              v-if="currentQuestion > 0"

              @click="prevQuestion"

              class="btn-sec"
            >
              ⬅️ Anterior
            </button>


            <div class="actions-right">

              <button
                v-if="
                  currentQuestion <
                  exercises.length - 1
                "

                @click="nextQuestion"

                class="btn-eng run inline-btn"

                :disabled="!feedbackVisible"
              >
                Siguiente ➡️
              </button>


              <button
                v-else

                @click="finishEvaluation"

                class="btn-eng run inline-btn btn-finish"

                :disabled="!feedbackVisible"
              >
                🏆 Ver resultados
              </button>

            </div>

          </div>

        </div>

      </section>


      <!-- =======================================================
           RESULTADOS
      ======================================================== -->

      <section
        v-else
        class="panel result-panel"
      >

        <div class="result-card">

          <div class="result-header">

            <div class="status-icon">

              {{
                scorePercentage >= 70
                  ? '🎉'
                  : '📚'
              }}

            </div>


            <h3>
              ¡Evaluación completada!
            </h3>


            <p class="subtitle">

              Obtuviste

              <strong>
                {{ correctCount }}
              </strong>

              de

              <strong>
                {{ exercises.length }}
              </strong>

              respuestas correctas.

            </p>


            <div
              class="score-badge"

              :class="{
                ok: scorePercentage >= 70,
                bad: scorePercentage < 70
              }"
            >

              <span>
                {{ scorePercentage }}%
              </span>

              <small>

                {{
                  scorePercentage >= 70
                    ? 'Aprobado'
                    : 'No Aprobado'
                }}

              </small>

            </div>


            <!-- MENSAJE FINAL -->

            <div
              class="result-banner"

              :class="
                scorePercentage >= 70
                  ? 'ok'
                  : 'bad'
              "
            >

              <h4>
                {{ resultFeedback.title }}
              </h4>

              <p>
                {{ resultFeedback.body }}
              </p>

            </div>

          </div>


          <!-- =================================================
               REPASO
          ================================================== -->

          <div class="review-section">

            <h4>
              📋 Resumen de desempeño
            </h4>


            <div
              v-for="(ex, i) in exercises"

              :key="ex.id"

              class="review-item"

              :class="
                checkCorrect(i)
                  ? 'item-ok'
                  : 'item-bad'
              "
            >

              <div class="review-head">

                <span>
                  {{ i + 1 }}.
                  {{ ex.category }}
                </span>


                <span class="status-tag">

                  {{
                    checkCorrect(i)
                      ? '✔ Correcta'
                      : '✖ Incorrecta'
                  }}

                </span>

              </div>


              <p class="review-answer">

                <strong>
                  Tu respuesta:
                </strong>

                {{
                  ex.type === 'numeric'
                    ? `${answers[i]} ${ex.data.unit}`
                    : answers[i]
                }}

              </p>


              <p
                v-if="!checkCorrect(i)"
                class="review-answer"
              >

                <strong>
                  Respuesta correcta:
                </strong>

                {{
                  ex.type === 'numeric'
                    ? `${ex.data.answer} ${ex.data.unit}`
                    : ex.correct
                }}

              </p>


              <p class="review-exp">

                💡

                <strong>
                  Explicación:
                </strong>

                {{ ex.explanation }}

              </p>

            </div>

          </div>


          <!-- REINTENTAR -->

          <button
            class="btn-eng run"
            @click="restartEvaluation"
          >

            🔄 Intentar de nuevo

          </button>

        </div>

      </section>

    </div>

  </div>

</template>


<style scoped>

/* ================================================================
   CONTENEDOR
================================================================ */

.eval-container {

  display: flex;

  flex-direction: column;

  gap: 1.5rem;

  max-width: 1050px;

  margin: 0 auto;

  background: rgba(11, 14, 20, 0.75);

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 16px;

  padding: 1.75rem;

  backdrop-filter: blur(14px);

  color: #d7e0f5;

  font-family:
    system-ui,
    -apple-system,
    sans-serif;

}


/* ================================================================
   HEADER
================================================================ */

.eval__header {

  border-bottom:
    1px solid rgba(255, 255, 255, 0.08);

  padding-bottom: 1.25rem;

}


.badge-pill {

  display: inline-block;

  padding:
    0.3rem 0.85rem;

  font-size: 0.7rem;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 1.2px;

  color: #39a900;

  background:
    rgba(57, 169, 0, 0.12);

  border:
    1px solid rgba(57, 169, 0, 0.35);

  border-radius: 50px;

  margin-bottom: 0.6rem;

}


.eval__title h2 {

  margin:
    0 0 0.25rem;

  font-size: 1.35rem;

  color: #fff;

}


.subtitle {

  color: #b0c4de;

  font-size: 0.88rem;

  margin: 0;

  line-height: 1.55;

}


.eval__body {

  display: flex;

  flex-direction: column;

  gap: 1.5rem;

}


.panel {

  display: flex;

  flex-direction: column;

  gap: 1rem;

}


.eval-card,
.result-card {

  background:
    rgba(255, 255, 255, 0.03);

  border-radius: 12px;

  padding: 1.5rem;

  border:
    1px solid rgba(255, 255, 255, 0.05);

}


/* ================================================================
   PROGRESO
================================================================ */

.progress-bar-container {

  margin-bottom: 1.25rem;

}


.progress-info {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 1rem;

  margin-bottom: 0.5rem;

  font-size: 0.85rem;

}


.btn-hint {

  background: transparent;

  border:
    1px dashed rgba(255, 193, 7, 0.5);

  color: #ffc107;

  padding:
    0.25rem 0.6rem;

  border-radius: 6px;

  cursor: pointer;

  font-size: 0.75rem;

}


.btn-hint:disabled {

  opacity: 0.5;

  cursor: not-allowed;

}


.progress-track {

  height: 7px;

  background:
    rgba(255, 255, 255, 0.1);

  border-radius: 4px;

  overflow: hidden;

}


.progress-fill {

  height: 100%;

  background:
    linear-gradient(
      90deg,
      #00324d,
      #39a900
    );

  transition:
    width 0.35s ease;

}


/* ================================================================
   PISTA
================================================================ */

.hint-box {

  background:
    rgba(255, 193, 7, 0.1);

  border:
    1px solid rgba(255, 193, 7, 0.3);

  border-radius: 8px;

  padding: 0.75rem;

  margin-bottom: 1rem;

}


.hint-content {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 1rem;

  font-size: 0.85rem;

  color: #ffca28;

}


.btn-close-hint {

  background: none;

  border: none;

  color: #ffca28;

  cursor: pointer;

}


/* ================================================================
   PREGUNTA
================================================================ */

.question-box {

  padding: 0.25rem 0;

}


.category-tag {

  font-size: 0.75rem;

  text-transform: uppercase;

  color: #39a900;

  font-weight: 800;

  letter-spacing: 0.4px;

}


.question-text {

  font-size: 1.1rem;

  color: #fff;

  margin:
    0.6rem 0 1.35rem;

  line-height: 1.55;

}


/* ================================================================
   OPCIONES
================================================================ */

.options-grid {

  display: grid;

  grid-template-columns:
    repeat(2, minmax(0, 1fr));

  gap: 0.85rem;

}


.answer-option {

  min-height: 70px;

  display: flex;

  align-items: center;

  gap: 0.75rem;

  position: relative;

  padding: 0.9rem 1rem;

  text-align: left;

  color: #fff;

  background:
    rgba(255, 255, 255, 0.045);

  border:
    1px solid rgba(255, 255, 255, 0.12);

  border-radius: 10px;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

}


.answer-option:hover:not(:disabled) {

  transform: translateY(-2px);

  border-color:
    rgba(57, 169, 0, 0.65);

  background:
    rgba(57, 169, 0, 0.09);

}


.answer-option.selected {

  border-color: #00b7ff;

  box-shadow:
    0 0 14px
    rgba(0, 183, 255, 0.18);

}


.answer-option.correct {

  border-color: #39a900;

  background:
    rgba(57, 169, 0, 0.16);

  box-shadow:
    0 0 18px
    rgba(57, 169, 0, 0.18);

}


.answer-option.wrong {

  border-color: #ff5252;

  background:
    rgba(255, 82, 82, 0.12);

}


.answer-option:disabled {

  cursor: default;

}


.option-letter {

  width: 30px;

  height: 30px;

  flex: 0 0 30px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background:
    rgba(255, 255, 255, 0.09);

  color: #9bb0c8;

  font-weight: 800;

}


.option-status {

  margin-left: auto;

  font-size: 1.25rem;

  font-weight: 900;

}


/* ================================================================
   RESPUESTA NUMÉRICA
================================================================ */

.numeric-answer {

  max-width: 460px;

  margin:
    1.5rem auto 0;

  display: flex;

  flex-direction: column;

  align-items: center;

  gap: 1rem;

}


.numeric-display {

  width: 100%;

  display: flex;

  align-items: center;

  gap: 0.65rem;

}


.numeric-display input {

  flex: 1;

  min-width: 0;

  padding: 0.9rem 1rem;

  color: #fff;

  background: #0b0e14;

  border:
    1px solid rgba(0, 183, 255, 0.4);

  border-radius: 9px;

  font-size: 1.1rem;

  outline: none;

}


.numeric-display input:focus {

  border-color: #00b7ff;

  box-shadow:
    0 0 14px
    rgba(0, 183, 255, 0.18);

}


.numeric-display span {

  color: #9bb0c8;

  font-family: monospace;

  white-space: nowrap;

}


/* ================================================================
   RETROALIMENTACIÓN
================================================================ */

.instant-feedback {

  margin-top: 1.25rem;

  padding: 1rem 1.1rem;

  border-radius: 10px;

  text-align: left;

  animation:
    feedbackIn 0.3s ease;

}


.feedback-correct {

  background:
    rgba(57, 169, 0, 0.12);

  border:
    1px solid rgba(57, 169, 0, 0.45);

  box-shadow:
    0 0 20px
    rgba(57, 169, 0, 0.12);

}


.feedback-incorrect {

  background:
    rgba(255, 82, 82, 0.1);

  border:
    1px solid rgba(255, 82, 82, 0.42);

  box-shadow:
    0 0 20px
    rgba(255, 82, 82, 0.1);

}


.feedback-title {

  font-weight: 900;

  font-size: 1rem;

  margin-bottom: 0.45rem;

}


.feedback-correct
.feedback-title {

  color: #58d425;

}


.feedback-incorrect
.feedback-title {

  color: #ff6b6b;

}


.instant-feedback p {

  margin:
    0.35rem 0 0;

  color: #d7e0f5;

  font-size: 0.87rem;

  line-height: 1.55;

}


.feedback-answer {

  color: #ffc107 !important;

}


@keyframes feedbackIn {

  from {

    opacity: 0;

    transform:
      translateY(8px);

  }

  to {

    opacity: 1;

    transform:
      translateY(0);

  }

}


/* ================================================================
   BOTONES
================================================================ */

.eval-actions {

  display: flex;

  justify-content: space-between;

  align-items: center;

  gap: 1rem;

  margin-top: 1.5rem;

  border-top:
    1px solid rgba(255, 255, 255, 0.05);

  padding-top: 1rem;

}


.actions-right {

  margin-left: auto;

}


.btn-sec {

  background:
    rgba(255, 255, 255, 0.08);

  border: none;

  color: #fff;

  padding:
    0.65rem 1.2rem;

  border-radius: 8px;

  cursor: pointer;

}


.btn-eng {

  background: #39a900;

  border: none;

  color: #fff;

  padding:
    0.65rem 1.2rem;

  border-radius: 8px;

  font-weight: bold;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;

}


.btn-eng:hover:not(:disabled) {

  transform:
    translateY(-1px);

  box-shadow:
    0 5px 16px
    rgba(57, 169, 0, 0.22);

}


.btn-eng:disabled {

  opacity: 0.5;

  cursor: not-allowed;

}


/* ================================================================
   RESULTADOS
================================================================ */

.result-card {

  text-align: center;

}


.status-icon {

  font-size: 3rem;

  margin-bottom: 0.5rem;

}


.score-badge {

  display: inline-flex;

  flex-direction: column;

  padding:
    0.75rem 1.5rem;

  border-radius: 12px;

  margin: 1rem 0;

  font-weight: bold;

  font-size: 1.5rem;

}


.score-badge small {

  font-size: 0.72rem;

  margin-top: 0.15rem;

}


.score-badge.ok {

  background:
    rgba(57, 169, 0, 0.2);

  color: #39a900;

  border:
    1px solid #39a900;

}


.score-badge.bad {

  background:
    rgba(255, 82, 82, 0.2);

  color: #ff5252;

  border:
    1px solid #ff5252;

}


.result-banner {

  max-width: 580px;

  margin:
    0.5rem auto 1.25rem;

  padding:
    1rem 1.25rem;

  border-radius: 10px;

}


.result-banner h4 {

  margin:
    0 0 0.35rem;

  font-size: 1.05rem;

}


.result-banner p {

  margin: 0;

  font-size: 0.85rem;

  line-height: 1.5;

  color: #d7e0f5;

}


.result-banner.ok {

  background:
    rgba(57, 169, 0, 0.12);

  border:
    1px solid rgba(57, 169, 0, 0.4);

}


.result-banner.ok h4 {

  color: #39a900;

}


.result-banner.bad {

  background:
    rgba(255, 82, 82, 0.1);

  border:
    1px solid rgba(255, 82, 82, 0.35);

}


.result-banner.bad h4 {

  color: #ff5252;

}


/* ================================================================
   REPASO FINAL
================================================================ */

.review-section {

  text-align: left;

  margin:
    1.5rem 0;

  display: flex;

  flex-direction: column;

  gap: 0.75rem;

}


.review-section h4 {

  margin: 0;

  color: #fff;

}


.review-item {

  padding: 0.9rem;

  border-radius: 8px;

  background:
    rgba(0, 0, 0, 0.2);

}


.review-item.item-ok {

  border-left:
    4px solid #39a900;

}


.review-item.item-bad {

  border-left:
    4px solid #ff5252;

}


.review-head {

  display: flex;

  justify-content: space-between;

  gap: 1rem;

  font-weight: bold;

  font-size: 0.85rem;

}


.status-tag {

  white-space: nowrap;

}


.item-ok .status-tag {

  color: #39a900;

}


.item-bad .status-tag {

  color: #ff5252;

}


.review-answer {

  font-size: 0.8rem;

  color: #b9c7d8;

  margin:
    0.5rem 0 0;

}


.review-exp {

  font-size: 0.8rem;

  color: #a0aec0;

  margin:
    0.5rem 0 0;

  line-height: 1.5;

}


/* ================================================================
   RESPONSIVE
================================================================ */

@media (max-width: 700px) {

  .eval-container {

    padding: 1rem;

    border-radius: 12px;

  }


  .eval-card,
  .result-card {

    padding: 1rem;

  }


  .progress-info {

    align-items: flex-start;

    flex-direction: column;

  }


  .options-grid {

    grid-template-columns: 1fr;

  }


  .question-text {

    font-size: 1rem;

  }


  .eval-actions {

    align-items: stretch;

    flex-direction: column;

  }


  .actions-right {

    width: 100%;

    margin-left: 0;

  }


  .actions-right .btn-eng {

    width: 100%;

  }


  .review-head {

    flex-direction: column;

    gap: 0.35rem;

  }

}

</style>