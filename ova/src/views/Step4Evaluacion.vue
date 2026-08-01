<script setup>
import { ref, computed } from 'vue'

const currentQuestion = ref(0)
const userAnswers = ref({})
const selectedOption = ref(null)
const isSubmitted = ref(false)

// Estado de pistas
const showHint = ref(false)
const hintsUsed = ref({})

const questions = [
  {
    category: "Concepto de Aceleración",
    question: "¿Qué representa físicamente la aceleración en el movimiento de un objeto?",
    options: [
      "La velocidad total acumulada durante el recorrido.",
      "La razón de cambio de la velocidad en relación al tiempo.",
      "La distancia recorrida por cada segundo transcurrido.",
      "La fuerza máxima ejercida sobre el objeto en caída."
    ],
    correct: 1,
    hint: "Recuerda la fórmula a = (v_f - v_i) / t. No mide qué tan rápido vas, sino cuánto varía tu velocidad.",
    explanation: "La aceleración indica la variación de velocidad en un intervalo de tiempo determinado."
  },
  {
    category: "Cálculo en Módulo Lunar",
    question: "Si el módulo reduce su velocidad de 30 m/s a 5 m/s en 10 segundos, ¿cuál es su desaceleración?",
    options: [
      "2.5 m/s²",
      "-2.5 m/s²",
      "3.5 m/s²",
      "-3.0 m/s²"
    ],
    correct: 1,
    hint: "Calcula a = (v_f - v_i) / t = (5 - 30) / 10. Al ser un frenado, el resultado debe ser negativo.",
    explanation: "a = (5 - 30) / 10 = -2.5 m/s². El signo negativo indica que el vehículo está frenando."
  },
  {
    category: "Caída Libre y Gravedad",
    question: "Si un objeto cae en la Luna (g = 1.15 m/s²) partiendo del reposo, ¿qué velocidad alcanza a los 4 segundos?",
    options: [
      "9.80 m/s",
      "4.60 m/s",
      "2.30 m/s",
      "1.15 m/s"
    ],
    correct: 1,
    hint: "Aplica la fórmula v_f = v_0 + g * t considerando v_0 = 0 m/s.",
    explanation: "v_f = 0 + (1.15 * 4) = 4.60 m/s."
  },
  {
    category: "Velocidad Constante",
    question: "Un módulo navega a una velocidad constante de 15 m/s en el espacio. ¿Cuál es su aceleración neta?",
    options: [
      "15 m/s²",
      "1.15 m/s²",
      "0 m/s²",
      "Depende de la masa del combustible restante."
    ],
    correct: 2,
    hint: "Si la velocidad no cambia en el tiempo (v_f = v_i), la diferencia de velocidad es igual a cero.",
    explanation: "Sin cambio de velocidad (v_f - v_i = 0), la aceleración es de exactamente 0 m/s²."
  }
]

const isHintUsedForCurrent = computed(() => !!hintsUsed.value[currentQuestion.value])

function selectOption(index) {
  selectedOption.value = index
  userAnswers.value[currentQuestion.value] = index
}

function nextQuestion() {
  if (selectedOption.value !== null) {
    showHint.value = false
    currentQuestion.value++
    selectedOption.value = userAnswers.value[currentQuestion.value] ?? null
  }
}

function prevQuestion() {
  showHint.value = false
  currentQuestion.value--
  selectedOption.value = userAnswers.value[currentQuestion.value] ?? null
}

function triggerHint() {
  showHint.value = true
  hintsUsed.value[currentQuestion.value] = true
}

function finishEvaluation() {
  isSubmitted.value = true
}

const correctCount = computed(() => {
  let count = 0
  questions.forEach((q, idx) => {
    if (userAnswers.value[idx] === q.correct) count++
  })
  return count
})

const scorePercentage = computed(() => Math.round((correctCount.value / questions.length) * 100))

function restartEvaluation() {
  currentQuestion.value = 0
  userAnswers.value = {}
  selectedOption.value = null
  isSubmitted.value = false
  showHint.value = false
  hintsUsed.value = {}
}
</script>

<template>
  <div class="eval-container">
    <!-- Header principal -->
    <header class="eval__header">
      <div class="eval__title">
        <span class="badge-pill">Módulo 4 · Evaluación Final</span>
        <h2>Evaluación de Física y MRUA</h2>
        <p class="subtitle">Pon a prueba tus conocimientos sobre aceleración, desaceleración y análisis de movimiento.</p>
      </div>
    </header>

    <div class="eval__body">
      <!-- Cuestionario Activo -->
      <section v-if="!isSubmitted" class="panel eval-panel">
        <div class="eval-card">
          <!-- Barra superior de progreso -->
          <div class="progress-bar-container">
            <div class="progress-info">
              <span>Pregunta {{ currentQuestion + 1 }} de {{ questions.length }}</span>
              <button 
                @click="triggerHint" 
                class="btn-hint" 
                :disabled="isHintUsedForCurrent"
              >
                💡 {{ isHintUsedForCurrent ? 'Pista Consultada' : 'Solicitar Pista' }}
              </button>
            </div>
            <div class="progress-track">
              <div 
                class="progress-fill" 
                :style="{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }"
              ></div>
            </div>
          </div>

          <!-- Cuadro de Pista -->
          <div v-if="showHint" class="hint-box">
            <div class="hint-content">
              <span>💡 <strong>Pista del Tutor:</strong> {{ questions[currentQuestion].hint }}</span>
              <button @click="showHint = false" class="btn-close-hint">✕</button>
            </div>
          </div>

          <!-- Pregunta y Opciones -->
          <div class="question-box">
            <span class="category-tag">{{ questions[currentQuestion].category }}</span>
            <h3 class="question-text">{{ questions[currentQuestion].question }}</h3>

            <div class="options-grid">
              <button
                v-for="(option, idx) in questions[currentQuestion].options"
                :key="idx"
                class="option-btn"
                :class="{ 'selected': selectedOption === idx }"
                @click="selectOption(idx)"
              >
                <span class="option-idx">{{ String.fromCharCode(65 + idx) }}</span>
                <span class="option-text">{{ option }}</span>
              </button>
            </div>
          </div>

          <!-- Controles de navegación -->
          <div class="eval-actions">
            <button 
              v-if="currentQuestion > 0" 
              @click="prevQuestion" 
              class="btn-sec"
            >
              ⬅️ Anterior
            </button>

            <button 
              v-if="currentQuestion < questions.length - 1" 
              @click="nextQuestion" 
              class="btn-eng run inline-btn"
              :disabled="selectedOption === null"
            >
              <span>Siguiente ➡️</span>
            </button>

            <button 
              v-else 
              @click="finishEvaluation" 
              class="btn-eng run inline-btn btn-finish"
              :disabled="selectedOption === null"
            >
              <span>🏆 Entregar Evaluación</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Panel de Resultados -->
      <section v-else class="panel result-panel">
        <div class="result-card">
          <div class="result-header">
            <div class="status-icon">
              {{ scorePercentage >= 70 ? '🎉' : '📚' }}
            </div>
            <h3>{{ scorePercentage >= 70 ? '¡Misión Cumplida, Aprendiz!' : '¡Requiere Repaso Técnico!' }}</h3>
            <p class="subtitle">
              Obtuviste <strong>{{ correctCount }}</strong> de <strong>{{ questions.length }}</strong> respuestas correctas.
            </p>

            <div class="score-badge" :class="{ 'ok': scorePercentage >= 70, 'bad': scorePercentage < 70 }">
              <span>{{ scorePercentage }}%</span>
              <small>{{ scorePercentage >= 70 ? 'Aprobado' : 'No Aprobado' }}</small>
            </div>
          </div>

          <!-- Detalle de respuestas -->
          <div class="review-section">
            <h4>📋 Resumen de Desempeño:</h4>
            <div 
              v-for="(q, idx) in questions" 
              :key="idx" 
              class="review-item"
              :class="userAnswers[idx] === q.correct ? 'item-ok' : 'item-bad'"
            >
              <div class="review-head">
                <span>{{ idx + 1 }}. {{ q.question }}</span>
                <span class="status-tag">
                  {{ userAnswers[idx] === q.correct ? '✔ Correcta' : '✖ Incorrecta' }}
                </span>
              </div>
              <p class="review-exp">💡 <strong>Explicación:</strong> {{ q.explanation }}</p>
            </div>
          </div>

          <button class="btn-eng run" @click="restartEvaluation">
            <span>🔄 Intentar de Nuevo</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
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
  font-family: inherit;
}

.eval__header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1.25rem;
}

.badge-pill {
  display: inline-block;
  padding: 0.3rem 0.85rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #39a900;
  background: rgba(57, 169, 0, 0.12);
  border: 1px solid rgba(57, 169, 0, 0.35);
  border-radius: 50px;
  margin-bottom: 0.6rem;
}

.eval__title h2 {
  margin: 0 0 0.25rem;
  font-size: 1.35rem;
  color: #fff;
}

.subtitle {
  color: #b0c4de;
  font-size: 0.88rem;
  margin: 0;
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

.eval-card, .result-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.5rem;
}

/* Progress bar */
.progress-bar-container {
  margin-bottom: 1.25rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #b0c4de;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.btn-hint {
  background: rgba(255, 183, 3, 0.12);
  border: 1px solid rgba(255, 183, 3, 0.35);
  color: #ffb703;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-hint:hover:not(:disabled) {
  background: rgba(255, 183, 3, 0.25);
}

.btn-hint:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.progress-track {
  height: 8px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0077ff, #39a900);
  transition: width 0.3s ease;
}

/* Hint box */
.hint-box {
  background: rgba(255, 183, 3, 0.08);
  border: 1px solid rgba(255, 183, 3, 0.25);
  color: #ffd166;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.82rem;
}

.hint-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.btn-close-hint {
  background: none;
  border: none;
  color: #ffb703;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.9rem;
}

/* Question */
.category-tag {
  display: inline-block;
  background: rgba(0, 183, 255, 0.12);
  border: 1px solid rgba(0, 183, 255, 0.3);
  color: #00b7ff;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.6rem;
}

.question-text {
  color: #fff;
  font-size: 1.1rem;
  margin: 0 0 1.25rem;
  line-height: 1.4;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #b0c4de;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  font-family: inherit;
  font-size: 0.88rem;
}

.option-btn:hover {
  background: rgba(0, 183, 255, 0.08);
  border-color: rgba(0, 183, 255, 0.4);
  color: #fff;
}

.option-btn.selected {
  background: rgba(57, 169, 0, 0.15);
  border-color: #39a900;
  color: #fff;
}

.option-idx {
  width: 26px;
  height: 26px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.78rem;
  color: #00b7ff;
  flex-shrink: 0;
}

.option-btn.selected .option-idx {
  background: #39a900;
  color: #fff;
}

/* Actions */
.eval-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
  align-items: center;
}

.btn-sec {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #b0c4de;
  padding: 0.65rem 1.1rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-sec:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.inline-btn {
  margin-top: 0 !important;
  width: auto !important;
  margin-left: auto;
}

.btn-finish {
  background: linear-gradient(135deg, #00324d, #39a900) !important;
}

.btn-eng {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
}

.btn-eng.run {
  background: linear-gradient(135deg, #0077ff, #39a900);
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 119, 255, 0.3);
}

.btn-eng:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

/* Results section */
.result-card {
  text-align: center;
}

.status-icon {
  font-size: 3rem;
  margin-bottom: 0.4rem;
}

.result-header h3 {
  color: #fff;
  font-size: 1.3rem;
  margin: 0 0 0.25rem;
}

.score-badge {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 1.25rem auto;
  font-size: 1.6rem;
  font-weight: 900;
}

.score-badge.ok {
  background: rgba(57, 169, 0, 0.12);
  border: 3px solid #39a900;
  color: #39a900;
}

.score-badge.bad {
  background: rgba(255, 77, 77, 0.12);
  border: 3px solid #ff4d4d;
  color: #ff4d4d;
}

.score-badge small {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
}

.review-section {
  text-align: left;
  margin: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.review-section h4 {
  color: #00b7ff;
  margin: 0 0 0.25rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.review-item {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.85rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.review-item.item-ok {
  border-left: 4px solid #39a900;
}

.review-item.item-bad {
  border-left: 4px solid #ff4d4d;
}

.review-head {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.85rem;
  color: #fff;
  margin-bottom: 0.35rem;
  gap: 1rem;
}

.status-tag {
  font-size: 0.72rem;
  flex-shrink: 0;
}

.item-ok .status-tag { color: #39a900; }
.item-bad .status-tag { color: #ff4d4d; }

.review-exp {
  margin: 0;
  font-size: 0.78rem;
  color: #b0c4de;
}
</style>