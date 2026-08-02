<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'

/* ================================================================ */
/* Utilidades                                                       */
/* ================================================================ */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ================================================================ */
/* Definición de los 10 ejercicios                                   */
/* ================================================================ */
const exercises = [
  {
    id: 0,
    type: 'gravity-select',
    category: '🚀 Selector de Gravedad Planetaria',
    prompt: 'Un paquete se libera en caída libre desde el reposo. Después de t = 4 s alcanza una velocidad de 39.2 m/s. ¿En qué cuerpo celeste ocurrió el lanzamiento?',
    hint: 'Usa v_f = g · t (con v₀ = 0). Despeja g = v_f / t y compáralo con la tabla de gravedades.',
    data: {
      options: [
        { name: 'Luna', g: 1.15, icon: '🌕' },
        { name: 'Marte', g: 3.7, icon: '🔴' },
        { name: 'Tierra', g: 9.8, icon: '🌍' },
        { name: 'Júpiter', g: 24.8, icon: '🪐' },
      ],
    },
    correct: 'Tierra',
    explanation: 'g = v_f / t = 39.2 / 4 = 9.8 m/s², que corresponde a la gravedad de la Tierra.',
  },
  {
    id: 1,
    type: 'equation-assembly',
    category: '🧩 Ensamble de la Ecuación',
    prompt: 'Arrastra (o toca) las fichas para reconstruir la ecuación de velocidad final en un movimiento con aceleración constante.',
    hint: 'La velocidad final es la velocidad inicial más el producto de la aceleración por el tiempo.',
    data: { tokens: ['v_f', '=', 'v_0', '+', 'a', '·', 't'] },
    explanation: 'La ecuación correcta es v_f = v_0 + a · t: la velocidad final depende de la inicial, más lo que se ganó por acelerar durante un tiempo t.',
  },
  {
    id: 2,
    type: 'graph-click',
    category: '📊 Decodificador de Telemetría',
    prompt: 'La gráfica muestra la velocidad de un módulo en tres tramos de vuelo. Haz clic sobre el tramo donde la aceleración es exactamente 0 m/s².',
    hint: 'La aceleración es la pendiente de la gráfica v-t. Una pendiente de cero es una línea horizontal.',
    data: {
      points: [
        [0, 0], [3, 20], [6, 20], [9, 0],
      ],
      maxT: 9,
      maxV: 20,
      zones: [
        { from: 0, to: 3, label: 'Tramo 1' },
        { from: 3, to: 6, label: 'Tramo 2' },
        { from: 6, to: 9, label: 'Tramo 3' },
      ],
    },
    correct: 2,
    explanation: 'En el Tramo 2 (3 s a 6 s) la velocidad se mantiene constante en 20 m/s: la gráfica es horizontal, por lo tanto a = 0 m/s².',
  },
  {
    id: 3,
    type: 'vector-classify',
    category: '⚖️ Clasificador de Vectores y Módulos',
    prompt: 'Clasifica cada situación de vuelo según el signo de su aceleración.',
    hint: 'Si gana rapidez en su dirección de movimiento es (+); si frena es (−); si no cambia su rapidez es (0).',
    data: {
      scenarios: [
        { text: 'El módulo enciende motores en la dirección de su movimiento y gana rapidez.', correct: 'plus' },
        { text: 'El módulo apaga motores y viaja en línea recta a rapidez constante por el vacío espacial.', correct: 'zero' },
        { text: 'El módulo activa retrocohetes en contra de su movimiento para frenar antes de aterrizar.', correct: 'minus' },
        { text: 'La nave mantiene el mismo empuje y la misma rapidez durante toda la órbita de transferencia.', correct: 'zero' },
      ],
    },
    explanation: 'Acelerado (+) = gana rapidez en su dirección; Frenado (−) = pierde rapidez (empuje contrario); Constante (0) = la rapidez no cambia.',
  },
  {
    id: 4,
    type: 'numeric-console',
    category: '🎛️ Calculadora de Ignición Espacial',
    prompt: 'Un módulo parte con v₀ = 12 m/s y acelera a 2.5 m/s² durante 8 s. Calcula su velocidad final e ingrésala en el panel.',
    hint: 'v_f = v_0 + a · t',
    data: { answer: 32, tolerance: 0.5 },
    explanation: 'v_f = 12 + (2.5 × 8) = 12 + 20 = 32 m/s.',
  },
  {
    id: 5,
    type: 'stopwatch',
    category: '⏱️ Temporizador de Maniobra Orbital',
    prompt: 'Un módulo pasa de v₀ = 5 m/s a v_f = 17 m/s con una aceleración de 3 m/s². Calcula mentalmente el tiempo t que dura la maniobra, luego presiona INICIAR y detén el cronómetro justo en ese segundo.',
    hint: 't = (v_f − v_0) / a',
    data: { answer: 4, tolerance: 0.4 },
    explanation: 't = (17 − 5) / 3 = 12 / 3 = 4 s.',
  },
  {
    id: 6,
    type: 'thruster-select',
    category: '🚀 Selección de Propulsores',
    prompt: 'La misión requiere una desaceleración de 3.7 m/s² para el descenso. Selecciona el propulsor adecuado.',
    hint: 'Compara el empuje (aceleración) de cada propulsor con el valor requerido por la misión.',
    data: {
      thrusters: [
        { name: 'Alfa', thrust: 1.8, desc: 'Bajo consumo — ideal para maniobras finas de aproximación.' },
        { name: 'Beta', thrust: 3.7, desc: 'Consumo medio — diseñado para descensos en gravedad media.' },
        { name: 'Gamma', thrust: 6.2, desc: 'Alto consumo — reservado para despegues de emergencia.' },
      ],
      maxScale: 8,
    },
    correct: 'Beta',
    explanation: 'El propulsor Beta entrega exactamente 3.7 m/s² de empuje, el valor que exige la misión.',
  },
  {
    id: 7,
    type: 'code-fill',
    category: '🧮 Rellenar Código en Consola',
    prompt: 'Completa la línea de código para que calcule correctamente la aceleración.',
    hint: 'La fórmula es a = (v_f − v_0) / t. La variable que falta es v0 (o su valor, 10).',
    data: { accepted: ['v0', 'vo', '10'] },
    explanation: 'a = (vf − v0) / t. La variable v0 vale 10, así que también se acepta escribir "10" directamente.',
  },
  {
    id: 8,
    type: 'knob',
    category: '⛽ Perilla de Empuje de Motor',
    prompt: 'Durante el descenso final, el módulo debe pasar de v₀ = 18 m/s a v_f = 6 m/s en t = 5 s. Calcula la desaceleración necesaria y gira la perilla hasta ese valor exacto.',
    hint: 'La desaceleración es el cambio de velocidad dividido entre el tiempo: a = (v₀ − v_f) / t.',
    data: { target: 2.4, max: 4, tolerance: 0.15 },
    explanation: 'a = (18 − 6) / 5 = 12 / 5 = 2.4 m/s². Ese es el valor exacto que debía marcar la perilla.',
  },
  {
    id: 9,
    type: 'launch-sim',
    category: '🏆 Misión Final: Lanzamiento de Sonda',
    prompt: 'Parámetros conocidos: v₀ = 10 m/s, a = 2 m/s². La sonda debe alcanzar una velocidad de escape de 50 m/s. Calcula el tiempo de propulsión t e ingrésalo antes de lanzar.',
    hint: 'v_f = v_0 + a · t → despeja t = (v_f − v_0) / a',
    data: { v0: 10, a: 2, targetVf: 50, toleranceVf: 2 },
    explanation: 't = (50 − 10) / 2 = 20 s. Con ese tiempo de propulsión, la sonda alcanza los 50 m/s requeridos.',
  },
]

/* ================================================================ */
/* Estado general de navegación                                     */
/* ================================================================ */
const currentQuestion = ref(0)
const isSubmitted = ref(false)
const showHint = ref(false)
const hintsUsed = reactive({})

const currentEx = computed(() => exercises[currentQuestion.value])
const isHintUsedForCurrent = computed(() => !!hintsUsed[currentQuestion.value])

function triggerHint() {
  showHint.value = true
  hintsUsed[currentQuestion.value] = true
}

function nextQuestion() {
  if (!isAnswered(currentQuestion.value)) return
  showHint.value = false
  currentQuestion.value++
}
function prevQuestion() {
  showHint.value = false
  currentQuestion.value--
}
function finishEvaluation() {
  if (!isAnswered(currentQuestion.value)) return
  isSubmitted.value = true
}

/* ================================================================ */
/* Ejercicio 0 · Selector de Gravedad Planetaria                    */
/* ================================================================ */
const gravitySelected = ref(null)

/* ================================================================ */
/* Ejercicio 1 · Ensamble de la Ecuación (drag & drop / tap)        */
/* ================================================================ */
const assemblyPool = ref([])
const assemblySlots = ref([])
const assemblySelectedToken = ref(null)
const pulsingSlot = ref(null) // dispara el pulso de "encaje magnético" en el socket recién llenado

function initAssembly() {
  const tokens = exercises[1].data.tokens.map((label, id) => ({ id, label }))
  assemblyPool.value = shuffle(tokens)
  assemblySlots.value = Array(tokens.length).fill(null)
  assemblySelectedToken.value = null
  pulsingSlot.value = null
}

function placeTokenInSlot(id, slotIndex) {
  if (assemblySlots.value[slotIndex]) return
  const token = assemblyPool.value.find(t => t.id === id)
  if (!token) return
  assemblySlots.value[slotIndex] = token
  assemblyPool.value = assemblyPool.value.filter(t => t.id !== id)
  pulsingSlot.value = slotIndex
  setTimeout(() => { if (pulsingSlot.value === slotIndex) pulsingSlot.value = null }, 550)
}
function returnTokenFromSlot(slotIndex) {
  const token = assemblySlots.value[slotIndex]
  if (!token) return
  assemblyPool.value.push(token)
  assemblySlots.value[slotIndex] = null
}
function onPoolDragStart(token, e) {
  e.dataTransfer.setData('text/plain', JSON.stringify({ id: token.id, from: 'pool' }))
}
function onSlotDragStart(slotIndex, e) {
  const token = assemblySlots.value[slotIndex]
  if (!token) return
  e.dataTransfer.setData('text/plain', JSON.stringify({ id: token.id, from: 'slot', slotIndex }))
}
function onDropSlot(targetIndex, e) {
  e.preventDefault()
  let data
  try { data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}') } catch { return }
  if (assemblySlots.value[targetIndex] && data.from !== 'slot') return
  if (data.from === 'pool') {
    placeTokenInSlot(data.id, targetIndex)
  } else if (data.from === 'slot' && !assemblySlots.value[targetIndex]) {
    const token = assemblySlots.value[data.slotIndex]
    assemblySlots.value[data.slotIndex] = null
    assemblySlots.value[targetIndex] = token
    pulsingSlot.value = targetIndex
    setTimeout(() => { if (pulsingSlot.value === targetIndex) pulsingSlot.value = null }, 550)
  }
}
function onDropPool(e) {
  e.preventDefault()
  let data
  try { data = JSON.parse(e.dataTransfer.getData('text/plain') || '{}') } catch { return }
  if (data.from === 'slot') returnTokenFromSlot(data.slotIndex)
}
function onSlotClick(slotIndex) {
  if (assemblySlots.value[slotIndex]) {
    returnTokenFromSlot(slotIndex)
  } else if (assemblySelectedToken.value != null) {
    placeTokenInSlot(assemblySelectedToken.value, slotIndex)
    assemblySelectedToken.value = null
  }
}
function onPoolTokenClick(token) {
  assemblySelectedToken.value = assemblySelectedToken.value === token.id ? null : token.id
}

/* ================================================================ */
/* Ejercicio 2 · Decodificador de Telemetría (gráfica clicable)      */
/* ================================================================ */
const graphSelected = ref(null)
const CHART_W = 300
const CHART_H = 140
const chartPolyline = computed(() => {
  const { points, maxT, maxV } = exercises[2].data
  return points
    .map(([t, v]) => `${(t / maxT) * CHART_W},${CHART_H - 20 - (v / maxV) * (CHART_H - 40)}`)
    .join(' ')
})
const chartZones = computed(() => {
  const { zones, maxT } = exercises[2].data
  return zones.map(z => ({
    x: (z.from / maxT) * CHART_W,
    w: ((z.to - z.from) / maxT) * CHART_W,
  }))
})

/* ================================================================ */
/* Ejercicio 3 · Clasificador de Vectores (toggles de 3 posiciones)  */
/* ================================================================ */
const vectorStates = ref([null, null, null, null])

/* ================================================================ */
/* Ejercicio 4 · Calculadora de Ignición (teclado + LED)             */
/* ================================================================ */
const numericValue = ref('')
const numericConfirmed = ref(false)
const displayFlicker = ref(false)

function flickerDisplay() {
  displayFlicker.value = false
  requestAnimationFrame(() => {
    displayFlicker.value = true
    setTimeout(() => { displayFlicker.value = false }, 130)
  })
}
function pressDigit(k) {
  numericConfirmed.value = false
  numericValue.value += k
  flickerDisplay()
}
function clearNumeric() {
  numericConfirmed.value = false
  numericValue.value = ''
  flickerDisplay()
}
function backspaceNumeric() {
  numericConfirmed.value = false
  numericValue.value = numericValue.value.slice(0, -1)
  flickerDisplay()
}
function confirmNumeric() {
  if (numericValue.value === '') return
  numericConfirmed.value = true
}

/* ================================================================ */
/* Ejercicio 5 · Temporizador de Maniobra Orbital (cronómetro)       */
/* ================================================================ */
const stopwatchElapsed = ref(0)
const stopwatchRunning = ref(false)
const stopwatchStopped = ref(false)
const rippleActive = ref(false)
let stopwatchInterval = null
let stopwatchStart = null

function startStopwatch() {
  stopwatchRunning.value = true
  stopwatchStopped.value = false
  stopwatchElapsed.value = 0
  stopwatchStart = performance.now()
  stopwatchInterval = setInterval(() => {
    stopwatchElapsed.value = (performance.now() - stopwatchStart) / 1000
  }, 30)
}
function stopStopwatch() {
  if (!stopwatchRunning.value) return
  clearInterval(stopwatchInterval)
  stopwatchInterval = null
  stopwatchRunning.value = false
  stopwatchStopped.value = true
  rippleActive.value = true
  setTimeout(() => { rippleActive.value = false }, 650)
}
function resetStopwatchState() {
  if (stopwatchInterval) clearInterval(stopwatchInterval)
  stopwatchInterval = null
  stopwatchElapsed.value = 0
  stopwatchRunning.value = false
  stopwatchStopped.value = false
  rippleActive.value = false
}

/* ================================================================ */
/* Ejercicio 6 · Selección de Propulsores                            */
/* ================================================================ */
const thrusterSelected = ref(null)
const anyThrusterSelected = computed(() => thrusterSelected.value !== null)

/* ================================================================ */
/* Ejercicio 7 · Rellenar Código en Consola                          */
/* ================================================================ */
const codeBlank = ref('')

/* ================================================================ */
/* Ejercicio 8 · Perilla de Empuje de Motor (knob giratorio)         */
/* ================================================================ */
const knobValue = ref(0)
const knobConfirmed = ref(false)
const knobDragging = ref(false)
const knobBase = ref(null)
const knobPulse = ref(false)
const knobTicks = Array.from({ length: 11 }, (_, n) => -135 + n * 27)

watch(knobValue, () => {
  knobPulse.value = true
  setTimeout(() => { knobPulse.value = false }, 150)
})

function angleFromValue(v) {
  const max = exercises[8].data.max
  return -135 + (Math.max(0, Math.min(v, max)) / max) * 270
}
function valueFromAngleDeg(deg) {
  const max = exercises[8].data.max
  const clamped = Math.max(-135, Math.min(135, deg))
  return ((clamped + 135) / 270) * max
}
function onKnobPointerDown(e) {
  knobDragging.value = true
  knobConfirmed.value = false
  e.target.setPointerCapture?.(e.pointerId)
  updateKnobFromEvent(e)
}
function onKnobPointerMove(e) {
  if (!knobDragging.value) return
  updateKnobFromEvent(e)
}
function onKnobPointerUp() {
  knobDragging.value = false
}
function updateKnobFromEvent(e) {
  if (!knobBase.value) return
  const rect = knobBase.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90
  if (deg > 180) deg -= 360
  knobValue.value = Number(valueFromAngleDeg(deg).toFixed(2))
}
function confirmKnob() {
  knobConfirmed.value = true
}

/* ================================================================ */
/* Ejercicio 9 · Misión Final: Lanzamiento de Sonda                  */
/* ================================================================ */
const launchT = ref('')
const launchAnimating = ref(false)
const launchProgress = ref(0)
const launchResult = ref(null)
const predictedVf = computed(() => {
  const t = Number(launchT.value) || 0
  return exercises[9].data.v0 + exercises[9].data.a * t
})

function fireProbe() {
  if (!launchT.value || launchAnimating.value) return
  launchAnimating.value = true
  launchProgress.value = 0
  launchResult.value = null

  const { targetVf, toleranceVf } = exercises[9].data
  const predicted = predictedVf.value
  const success = Math.abs(predicted - targetVf) <= toleranceVf
  const ratio = Math.min(predicted / targetVf, 1.15)
  const finalProgress = success ? 88 : Math.min(ratio, 0.95) * 88

  const duration = 2200
  const start = performance.now()
  function frame(ts) {
    const p = Math.min((ts - start) / duration, 1)
    const eased = p * p // aceleración progresiva: arranca lento y acelera, como el empuje real
    launchProgress.value = eased * finalProgress
    if (p < 1) {
      requestAnimationFrame(frame)
    } else {
      launchAnimating.value = false
      launchResult.value = success ? 'success' : 'fail'
    }
  }
  requestAnimationFrame(frame)
}

/* ================================================================ */
/* Validación unificada: ¿respondido? / ¿correcto?                   */
/* ================================================================ */
function isAnswered(i) {
  switch (i) {
    case 0: return gravitySelected.value !== null
    case 1: return assemblySlots.value.every(s => s !== null)
    case 2: return graphSelected.value !== null
    case 3: return vectorStates.value.every(s => s !== null)
    case 4: return numericConfirmed.value
    case 5: return stopwatchStopped.value
    case 6: return thrusterSelected.value !== null
    case 7: return codeBlank.value.trim() !== ''
    case 8: return knobConfirmed.value
    case 9: return launchResult.value !== null
    default: return false
  }
}

function checkCorrect(i) {
  const ex = exercises[i]
  switch (i) {
    case 0: return gravitySelected.value === ex.correct
    case 1: return assemblySlots.value.every(s => s) && assemblySlots.value.map(s => s.label).join('|') === ex.data.tokens.join('|')
    case 2: return graphSelected.value === ex.correct
    case 3: return vectorStates.value.every((s, idx) => s === ex.data.scenarios[idx].correct)
    case 4: return numericValue.value !== '' && Math.abs(Number(numericValue.value) - ex.data.answer) <= ex.data.tolerance
    case 5: return stopwatchStopped.value && Math.abs(stopwatchElapsed.value - ex.data.answer) <= ex.data.tolerance
    case 6: return thrusterSelected.value === ex.correct
    case 7: return ex.data.accepted.includes(codeBlank.value.trim().toLowerCase())
    case 8: return knobConfirmed.value && Math.abs(knobValue.value - ex.data.target) <= ex.data.tolerance
    case 9: return launchResult.value === 'success'
    default: return false
  }
}

const correctCount = computed(() => exercises.reduce((sum, _, i) => sum + (checkCorrect(i) ? 1 : 0), 0))
const scorePercentage = computed(() => Math.round((correctCount.value / exercises.length) * 100))

const PASS_MESSAGES = [
  { title: '🌟 ¡Excelente, comandante!', body: 'Dominaste la misión por completo. Tus cálculos de aceleración son precisos y tu control de la nave, impecable.' },
  { title: '🎉 ¡Gran trabajo!', body: 'Superaste el desafío con un desempeño sólido. La base ya puede confiar en tus cálculos de vuelo.' },
]
const FAIL_MESSAGES = [
  { title: '📚 Casi lo logras', body: 'Estuviste cerca, pero algunos cálculos de la misión fallaron. Revisa las explicaciones de cada ejercicio y vuelve a intentarlo.' },
  { title: '🛠️ Necesitas más entrenamiento', body: 'Varios sistemas de la nave no respondieron como se esperaba. Repasa las fórmulas de MRUA con las pistas y vuelve a lanzar la misión.' },
]
const resultFeedback = computed(() => {
  const pass = scorePercentage.value >= 70
  if (pass) return scorePercentage.value === 100 ? PASS_MESSAGES[0] : PASS_MESSAGES[1]
  return scorePercentage.value >= 40 ? FAIL_MESSAGES[0] : FAIL_MESSAGES[1]
})

/* ================================================================ */
/* Reinicio completo                                                 */
/* ================================================================ */
function restartEvaluation() {
  currentQuestion.value = 0
  isSubmitted.value = false
  showHint.value = false
  Object.keys(hintsUsed).forEach(k => delete hintsUsed[k])

  gravitySelected.value = null
  initAssembly()
  graphSelected.value = null
  vectorStates.value = [null, null, null, null]
  numericValue.value = ''
  numericConfirmed.value = false
  resetStopwatchState()
  thrusterSelected.value = null
  codeBlank.value = ''
  knobValue.value = 0
  knobConfirmed.value = false
  launchT.value = ''
  launchResult.value = null
  launchAnimating.value = false
  launchProgress.value = 0
}

onMounted(() => {
  initAssembly()
  window.addEventListener('pointermove', onKnobPointerMove)
  window.addEventListener('pointerup', onKnobPointerUp)
})
onUnmounted(() => {
  resetStopwatchState()
  window.removeEventListener('pointermove', onKnobPointerMove)
  window.removeEventListener('pointerup', onKnobPointerUp)
})
</script>

<template>
  <div class="eval-container">
    <header class="eval__header">
      <div class="eval__title">
        <span class="badge-pill">Módulo 4 · Evaluación Final</span>
        <h2>Evaluación de Física y MRUA</h2>
        <p class="subtitle">Pon a prueba tus conocimientos sobre aceleración, desaceleración y análisis de movimiento con 10 desafíos interactivos.</p>
      </div>
    </header>

    <div class="eval__body">
      <!-- ===================== CUESTIONARIO ACTIVO ===================== -->
      <section v-if="!isSubmitted" class="panel eval-panel">
        <div class="eval-card">
          <div class="progress-bar-container">
            <div class="progress-info">
              <span>Ejercicio {{ currentQuestion + 1 }} de {{ exercises.length }}</span>
              <button @click="triggerHint" class="btn-hint" :disabled="isHintUsedForCurrent">
                💡 {{ isHintUsedForCurrent ? 'Pista Consultada' : 'Solicitar Pista' }}
              </button>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }"></div>
            </div>
          </div>

          <div v-if="showHint" class="hint-box">
            <div class="hint-content">
              <span>💡 <strong>Pista del Tutor:</strong> {{ currentEx.hint }}</span>
              <button @click="showHint = false" class="btn-close-hint">✕</button>
            </div>
          </div>

          <div class="question-box">
            <span class="category-tag">{{ currentEx.category }}</span>
            <h3 class="question-text">{{ currentEx.prompt }}</h3>

            <!-- 0 · Selector de Gravedad Planetaria -->
            <div v-if="currentEx.type === 'gravity-select'" class="planet-grid">
              <button
                v-for="p in currentEx.data.options" :key="p.name"
                class="planet-card" :class="{ selected: gravitySelected === p.name }"
                @click="gravitySelected = p.name"
              >
                <span class="planet-icon">{{ p.icon }}</span>
                <span class="planet-name">{{ p.name }}</span>
                <span class="planet-g">g = {{ p.g }} m/s²</span>
              </button>
            </div>

            <!-- 1 · Ensamble de la Ecuación -->
            <div v-else-if="currentEx.type === 'equation-assembly'" class="assembly">
              <div class="slot-row">
                <div
                  v-for="(slot, i) in assemblySlots" :key="i"
                  class="slot" :class="{ filled: !!slot, pulse: pulsingSlot === i }"
                  :draggable="!!slot"
                  @dragstart="onSlotDragStart(i, $event)"
                  @dragover.prevent
                  @drop="onDropSlot(i, $event)"
                  @click="onSlotClick(i)"
                >{{ slot ? slot.label : '' }}</div>
              </div>
              <div class="pool-row" @dragover.prevent @drop="onDropPool($event)">
                <div
                  v-for="tok in assemblyPool" :key="tok.id"
                  class="token" :class="{ selected: assemblySelectedToken === tok.id }"
                  draggable="true"
                  @dragstart="onPoolDragStart(tok, $event)"
                  @click="onPoolTokenClick(tok)"
                >{{ tok.label }}</div>
              </div>
              <p class="hint-key">💡 Arrastra las fichas a las casillas, o tócalas para seleccionarlas y luego toca una casilla.</p>
            </div>

            <!-- 2 · Decodificador de Telemetría -->
            <div v-else-if="currentEx.type === 'graph-click'" class="graph-wrap">
              <svg class="telemetry-chart" :viewBox="`0 0 ${CHART_W} ${CHART_H}`" preserveAspectRatio="none">
                <defs>
                  <pattern id="radarGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M20 0H0V20" fill="none" stroke="rgba(0,183,255,0.08)" stroke-width="1" />
                  </pattern>
                  <filter id="traceGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="2.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <radialGradient id="zoneGlowBlue" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stop-color="#00b7ff" stop-opacity="0.4" />
                    <stop offset="100%" stop-color="#00b7ff" stop-opacity="0" />
                  </radialGradient>
                  <radialGradient id="zoneGlowGreen" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stop-color="#39a900" stop-opacity="0.5" />
                    <stop offset="100%" stop-color="#39a900" stop-opacity="0" />
                  </radialGradient>
                </defs>

                <rect x="0" y="0" :width="CHART_W" :height="CHART_H - 20" fill="url(#radarGrid)" />
                <line x1="0" :y1="CHART_H - 20" :x2="CHART_W" :y2="CHART_H - 20" stroke="rgba(255,255,255,0.15)" />
                <polyline :points="chartPolyline" fill="none" stroke="#00b7ff" stroke-width="2.5" filter="url(#traceGlow)" />

                <rect
                  v-for="(z, i) in chartZones" :key="i"
                  :x="z.x" y="0" :width="z.w" :height="CHART_H - 20"
                  class="graph-zone" :class="{ selected: graphSelected === i + 1 }"
                  :fill="graphSelected === i + 1 ? 'url(#zoneGlowGreen)' : 'transparent'"
                  @click="graphSelected = i + 1"
                />
                <circle v-if="graphSelected" :cx="chartZones[graphSelected - 1].x + chartZones[graphSelected - 1].w / 2" cy="14" r="5" fill="#39a900" class="zone-marker">
                  <animate attributeName="r" values="4;8;4" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.35;1" dur="1.2s" repeatCount="indefinite" />
                </circle>

                <text
                  v-for="(z, i) in chartZones" :key="'label' + i"
                  :x="z.x + z.w / 2" :y="CHART_H - 4" text-anchor="middle" class="zone-label"
                >Tramo {{ i + 1 }}</text>
              </svg>
            </div>

            <!-- 3 · Clasificador de Vectores -->
            <div v-else-if="currentEx.type === 'vector-classify'" class="vector-list">
              <div v-for="(sc, i) in currentEx.data.scenarios" :key="i" class="vector-scenario">
                <p>{{ sc.text }}</p>
                <div class="segmented">
                  <button class="seg-plus" :class="{ active: vectorStates[i] === 'plus' }" @click="vectorStates[i] = 'plus'">Acelerado (+)</button>
                  <button class="seg-zero" :class="{ active: vectorStates[i] === 'zero' }" @click="vectorStates[i] = 'zero'">Constante (0)</button>
                  <button class="seg-minus" :class="{ active: vectorStates[i] === 'minus' }" @click="vectorStates[i] = 'minus'">Frenado (−)</button>
                </div>
              </div>
            </div>

            <!-- 4 · Calculadora de Ignición -->
            <div v-else-if="currentEx.type === 'numeric-console'" class="console">
              <div class="console-display-row">
                <div class="console-display" :class="{ flicker: displayFlicker }">{{ numericValue || '0' }}</div>
                <div class="led" :class="!numericConfirmed ? 'idle' : (checkCorrect(4) ? 'green' : 'amber')"></div>
              </div>
              <div class="keypad">
                <button v-for="k in ['7','8','9','4','5','6','1','2','3','0','.','+','-']" :key="k" @click="pressDigit(k)">{{ k }}</button>
                <button class="key-clear" @click="clearNumeric">C</button>
                <button class="key-back" @click="backspaceNumeric">⌫</button>
              </div>
              <button class="btn-eng run" @click="confirmNumeric">CONFIRMAR VALOR</button>
            </div>

            <!-- 5 · Temporizador de Maniobra Orbital -->
            <div v-else-if="currentEx.type === 'stopwatch'" class="stopwatch">
              <div class="stopwatch-ring" :class="{ running: stopwatchRunning }">
                <div class="stopwatch-display">{{ stopwatchElapsed.toFixed(2) }}s</div>
                <div v-if="rippleActive" class="ripple"></div>
              </div>
              <button v-if="!stopwatchRunning && !stopwatchStopped" class="btn-eng run" @click="startStopwatch">▶ INICIAR CRONÓMETRO</button>
              <button v-else-if="stopwatchRunning" class="btn-eng stop-btn" @click="stopStopwatch">⏹ DETENER MANIOBRA</button>
              <button v-else class="btn-sec" @click="resetStopwatchState">↺ Reintentar cronómetro</button>
            </div>

            <!-- 6 · Selección de Propulsores -->
            <div v-else-if="currentEx.type === 'thruster-select'" class="thruster-grid">
              <button
                v-for="th in currentEx.data.thrusters" :key="th.name"
                class="thruster-card" :class="{ selected: thrusterSelected === th.name }"
                @click="thrusterSelected = th.name"
              >
                <h4>Propulsor {{ th.name }}</h4>
                <p class="thrust-val">{{ th.thrust }} m/s²</p>
                <div class="power-bar">
                  <div class="power-fill" :style="{ width: (anyThrusterSelected ? (th.thrust / currentEx.data.maxScale) * 100 : 0) + '%' }"></div>
                </div>
                <p class="thrust-desc">{{ th.desc }}</p>
              </button>
            </div>

            <!-- 7 · Rellenar Código en Consola -->
            <div v-else-if="currentEx.type === 'code-fill'" class="code-console">
              <pre><code>let vf = 40;
let v0 = 10;
let t = 6;
let aceleracion = (vf - <input class="code-input" :class="{ correct: checkCorrect(7) }" v-model="codeBlank" placeholder="?" />) / t;</code></pre>
            </div>

            <!-- 8 · Perilla de Empuje de Motor -->
            <div v-else-if="currentEx.type === 'knob'" class="knob-wrap">
              <div class="knob-base" ref="knobBase" @pointerdown="onKnobPointerDown">
                <div class="knob-ticks">
                  <span v-for="(deg, n) in knobTicks" :key="n" class="tick" :style="{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-56px)` }"></span>
                </div>
                <div class="knob-track"></div>
                <div class="knob-handle" :style="{ transform: `rotate(${angleFromValue(knobValue)}deg)` }">
                  <span class="knob-dot"></span>
                </div>
              </div>
              <p class="knob-readout" :class="{ pulse: knobPulse }">{{ knobValue.toFixed(2) }} m/s²</p>
              <button class="btn-eng run" @click="confirmKnob">FIJAR VALOR</button>
            </div>

            <!-- 9 · Misión Final: Lanzamiento de Sonda -->
            <div v-else-if="currentEx.type === 'launch-sim'" class="launch">
              <label class="field">
                <span>Tiempo de propulsión t (s)</span>
                <input type="number" v-model.number="launchT" :disabled="launchAnimating || launchResult !== null" />
              </label>
              <button class="btn-eng run" :disabled="!launchT || launchAnimating || launchResult !== null" @click="fireProbe">
                🚀 LANZAR SONDA
              </button>
              <div class="launch-track">
                <div class="probe" :class="{ 'trail-success': launchResult === 'success', 'bounce-fail': launchResult === 'fail' }" :style="{ left: launchProgress + '%' }">🛰️</div>
                <div class="launch-target">🎯 Objetivo</div>
              </div>
              <p v-if="launchResult" class="launch-result" :class="launchResult">
                {{ launchResult === 'success'
                  ? `🌌 ¡Órbita alcanzada! Velocidad final ≈ ${predictedVf.toFixed(1)} m/s`
                  : `💥 Trayectoria fallida. Velocidad final ≈ ${predictedVf.toFixed(1)} m/s (objetivo 50 m/s)` }}
              </p>
            </div>
          </div>

          <div class="eval-actions">
            <button v-if="currentQuestion > 0" @click="prevQuestion" class="btn-sec">⬅️ Anterior</button>

            <button
              v-if="currentQuestion < exercises.length - 1"
              @click="nextQuestion" class="btn-eng run inline-btn"
              :disabled="!isAnswered(currentQuestion)"
            ><span>Siguiente ➡️</span></button>

            <button
              v-else
              @click="finishEvaluation" class="btn-eng run inline-btn btn-finish"
              :disabled="!isAnswered(currentQuestion)"
            ><span>🏆 Entregar Evaluación</span></button>
          </div>
        </div>
      </section>

      <!-- ===================== PANEL DE RESULTADOS ===================== -->
      <section v-else class="panel result-panel">
        <div class="result-card">
          <div class="result-header">
            <div class="status-icon">{{ scorePercentage >= 70 ? '🎉' : '📚' }}</div>
            <h3>{{ scorePercentage >= 70 ? '¡Misión Cumplida, Aprendiz!' : '¡Requiere Repaso Técnico!' }}</h3>
            <p class="subtitle">Obtuviste <strong>{{ correctCount }}</strong> de <strong>{{ exercises.length }}</strong> respuestas correctas.</p>
            <div class="score-badge" :class="{ ok: scorePercentage >= 70, bad: scorePercentage < 70 }">
              <span>{{ scorePercentage }}%</span>
              <small>{{ scorePercentage >= 70 ? 'Aprobado' : 'No Aprobado' }}</small>
            </div>

            <div class="result-banner" :class="scorePercentage >= 70 ? 'ok' : 'bad'">
              <h4>{{ resultFeedback.title }}</h4>
              <p>{{ resultFeedback.body }}</p>
            </div>
          </div>

          <div class="review-section">
            <h4>📋 Resumen de Desempeño:</h4>
            <div v-for="(ex, i) in exercises" :key="i" class="review-item" :class="checkCorrect(i) ? 'item-ok' : 'item-bad'">
              <div class="review-head">
                <span>{{ i + 1 }}. {{ ex.category }}</span>
                <span class="status-tag">{{ checkCorrect(i) ? '✔ Correcta' : '✖ Incorrecta' }}</span>
              </div>
              <p class="review-exp">💡 <strong>Explicación:</strong> {{ ex.explanation }}</p>
            </div>
          </div>

          <button class="btn-eng run" @click="restartEvaluation"><span>🔄 Intentar de Nuevo</span></button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.eval-container {
  display: flex; flex-direction: column; gap: 1.5rem;
  max-width: 1050px; margin: 0 auto;
  background: rgba(11, 14, 20, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px; padding: 1.75rem;
  backdrop-filter: blur(14px);
  color: #d7e0f5; font-family: system-ui, -apple-system, sans-serif;
}
.eval__header { border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 1.25rem; }
.badge-pill {
  display: inline-block; padding: 0.3rem 0.85rem; font-size: 0.7rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.2px; color: #39a900;
  background: rgba(57, 169, 0, 0.12); border: 1px solid rgba(57, 169, 0, 0.35);
  border-radius: 50px; margin-bottom: 0.6rem;
}
.eval__title h2 { margin: 0 0 0.25rem; font-size: 1.35rem; color: #fff; }
.subtitle { color: #b0c4de; font-size: 0.88rem; margin: 0; }
.eval__body { display: flex; flex-direction: column; gap: 1.5rem; }
.panel { display: flex; flex-direction: column; gap: 1rem; }
.eval-card, .result-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px; padding: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Barra de progreso y pista */
.progress-bar-container { margin-bottom: 1.25rem; }
.progress-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; font-size: 0.85rem; }
.btn-hint { background: transparent; border: 1px dashed rgba(255, 193, 7, 0.5); color: #ffc107; padding: 0.25rem 0.6rem; border-radius: 6px; cursor: pointer; font-size: 0.75rem; }
.btn-hint:disabled { opacity: 0.5; cursor: not-allowed; }
.progress-track { height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
.progress-fill { height: 100%; background: #00b7ff; transition: width 0.3s ease; }

.hint-box { background: rgba(255, 193, 7, 0.1); border: 1px solid rgba(255, 193, 7, 0.3); border-radius: 8px; padding: 0.75rem; margin-bottom: 1rem; }
.hint-content { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #ffca28; }
.btn-close-hint { background: none; border: none; color: #ffca28; cursor: pointer; }

/* Caja de pregunta */
.category-tag { font-size: 0.75rem; text-transform: uppercase; color: #00b7ff; font-weight: 700; }
.question-text { font-size: 1.1rem; color: #fff; margin: 0.5rem 0 1.25rem 0; }

/* ---- Ejercicio 0: Gravedad ---- */
.planet-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; }
.planet-card {
  position: relative; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
  padding: 0.85rem; display: flex; flex-direction: column; align-items: center; gap: 0.25rem; color: #fff; cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.planet-card::before {
  content: ''; position: absolute; inset: -10px; z-index: -1; border-radius: 16px; opacity: 0;
  background: radial-gradient(circle, rgba(0,183,255,0.28), transparent 70%); transition: opacity 0.25s ease;
}
.planet-card:hover { transform: translateY(-6px); }
.planet-card:hover::before { opacity: 1; }
.planet-card.selected { border-color: #00e5ff; animation: selectedGlow 1.6s ease-in-out infinite; }
@keyframes selectedGlow { 0%, 100% { box-shadow: 0 0 12px rgba(0,229,255,.45); } 50% { box-shadow: 0 0 24px rgba(0,229,255,.85); } }
.planet-icon { font-size: 1.5rem; display: inline-block; animation: floatIcon 3.4s ease-in-out infinite; }
.planet-card:nth-child(2) .planet-icon { animation-delay: .3s; }
.planet-card:nth-child(3) .planet-icon { animation-delay: .6s; }
.planet-card:nth-child(4) .planet-icon { animation-delay: .9s; }
@keyframes floatIcon { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(6deg); } }
.planet-g { font-size: 0.75rem; color: #a0aec0; }

/* ---- Ejercicio 1: Drag and Drop (sockets) ---- */
.assembly { display: flex; flex-direction: column; gap: 1rem; align-items: center; }
.slot-row, .pool-row { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; min-height: 48px; }
.slot {
  width: 44px; height: 44px; border: 2px dashed rgba(0,183,255,0.35); border-radius: 8px; display: flex;
  align-items: center; justify-content: center; font-weight: bold; background: rgba(0,0,0,0.25); color: #00b7ff;
  box-shadow: inset 0 0 8px rgba(0,183,255,0.08); transition: border-color .2s ease, transform .2s ease;
}
.slot.filled { border-style: solid; border-color: #00b7ff; }
.slot.pulse { animation: socketPulse .55s ease, slotSettle .35s ease; }
@keyframes socketPulse { 0% { box-shadow: 0 0 0 0 rgba(57,169,0,.7); } 100% { box-shadow: 0 0 0 16px rgba(57,169,0,0); } }
@keyframes slotSettle { 0% { transform: scale(.82); } 60% { transform: scale(1.1); } 100% { transform: scale(1); } }
.token {
  padding: 0.5rem 0.85rem; background: #1a2332; border: 1px solid rgba(0, 183, 255, 0.4); border-radius: 8px;
  color: #fff; cursor: grab; font-weight: bold; transition: transform .15s ease, box-shadow .15s ease;
}
.token:active { transform: scale(.92); }
.token.selected { border-color: #ffc107; background: rgba(255, 193, 7, 0.2); box-shadow: 0 0 10px rgba(255,193,7,.4); }
.hint-key { font-size: 0.75rem; color: #8a99ad; }

/* ---- Ejercicio 2: Telemetría SVG ---- */
.graph-wrap { width: 100%; display: flex; justify-content: center; }
.telemetry-chart { width: 100%; max-width: 450px; height: 160px; background: rgba(0,0,0,0.35); border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); }
.graph-zone { cursor: pointer; stroke: rgba(255,255,255,0.05); transition: fill .2s ease; }
.graph-zone:hover { fill: url(#zoneGlowBlue) !important; }
.zone-label { fill: #a0aec0; font-size: 10px; }
.zone-marker { pointer-events: none; }

/* ---- Ejercicio 3: Vectores ---- */
.vector-list { display: flex; flex-direction: column; gap: 0.75rem; }
.vector-scenario { background: rgba(0,0,0,0.2); padding: 0.75rem; border-radius: 8px; display: flex; flex-direction: column; gap: 0.5rem; }
.vector-scenario p { margin: 0; font-size: 0.85rem; }
.segmented { display: flex; gap: 0.25rem; background: rgba(255,255,255,0.05); padding: 0.2rem; border-radius: 6px; }
.segmented button { flex: 1; border: none; background: transparent; color: #a0aec0; padding: 0.35rem; font-size: 0.75rem; border-radius: 4px; cursor: pointer; transition: background .25s ease, color .25s ease; }
.segmented button.seg-plus.active { background: linear-gradient(135deg, #1b7e00, #39a900); color: #061018; font-weight: bold; }
.segmented button.seg-zero.active { background: linear-gradient(135deg, #0077ff, #00b7ff); color: #061018; font-weight: bold; }
.segmented button.seg-minus.active { background: linear-gradient(135deg, #b34700, #ffb703); color: #061018; font-weight: bold; }

/* ---- Ejercicio 4: Teclado ---- */
.console { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; width: 220px; margin: 0 auto; }
.console-display-row { display: flex; align-items: center; gap: 0.5rem; width: 100%; }
.console-display { flex: 1; background: #000; color: #00ff66; border: 1px solid rgba(0,255,102,0.3); padding: 0.5rem; text-align: right; font-family: monospace; font-size: 1.2rem; border-radius: 4px; }
.console-display.flicker { animation: flicker .13s steps(2); }
@keyframes flicker { 0% { opacity: .35; } 100% { opacity: 1; } }
.led { width: 12px; height: 12px; border-radius: 50%; background: #444; }
.led.green { background: #00ff66; animation: ledPulseGreen 1s ease-in-out infinite; }
.led.amber { background: #ffc107; animation: ledPulseAmber 1s ease-in-out infinite; }
@keyframes ledPulseGreen { 0%, 100% { box-shadow: 0 0 8px #00ff66; } 50% { box-shadow: 0 0 16px #00ff66, 0 0 4px #fff; } }
@keyframes ledPulseAmber { 0%, 100% { box-shadow: 0 0 8px #ffc107; } 50% { box-shadow: 0 0 16px #ffc107, 0 0 4px #fff; } }
.keypad { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.35rem; width: 100%; }
.keypad button { padding: 0.5rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 4px; cursor: pointer; transition: background .15s ease; }
.keypad button:hover { background: rgba(0,183,255,0.18); }

/* ---- Ejercicio 5: Cronómetro ---- */
.stopwatch { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.stopwatch-ring {
  position: relative; width: 170px; height: 170px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; background: #0b0e14; border: 3px solid rgba(0,183,255,0.2);
}
.stopwatch-ring::before {
  content: ''; position: absolute; inset: -3px; border-radius: 50%; padding: 3px;
  background: conic-gradient(from 0deg, #00b7ff, rgba(0,183,255,.1) 80%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity .3s ease;
}
.stopwatch-ring.running::before { opacity: 1; animation: spinRing 1.8s linear infinite; }
@keyframes spinRing { to { transform: rotate(360deg); } }
.stopwatch-display { position: relative; z-index: 1; font-size: 2.3rem; font-family: monospace; color: #00b7ff; }
.ripple { position: absolute; inset: -6px; border-radius: 50%; border: 2px solid #39a900; animation: rippleOut .65s ease-out; }
@keyframes rippleOut { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.35); opacity: 0; } }

/* ---- Ejercicio 6: Propulsores ---- */
.thruster-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.75rem; }
.thruster-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.85rem; text-align: left; color: #fff; cursor: pointer; transition: border-color .25s ease, box-shadow .25s ease; }
.thruster-card.selected { border-color: #39a900; animation: cardEnergy 1.4s ease-in-out infinite; }
@keyframes cardEnergy { 0%, 100% { box-shadow: 0 0 10px rgba(57,169,0,.28); } 50% { box-shadow: 0 0 20px rgba(57,169,0,.55); } }
.thrust-val { font-size: 1.2rem; color: #39a900; font-weight: bold; margin: 0.25rem 0; }
.power-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; margin: 0.35rem 0; }
.power-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #0077ff, #39a900); transition: width .6s ease; }
.thrust-desc { font-size: 0.75rem; color: #8a99ad; margin: 0; }

/* ---- Ejercicio 7: Código ---- */
.code-console { background: #0d1117; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 1rem; font-family: monospace; }
.code-input { background: rgba(255,255,255,0.1); border: 1px solid #00b7ff; color: #00ff66; width: 60px; text-align: center; font-family: monospace; border-radius: 4px; transition: box-shadow .2s ease, border-color .2s ease; }
.code-input:focus { outline: none; box-shadow: 0 0 10px rgba(0,183,255,.6); border-color: #00e5ff; }
.code-input.correct { border-color: #39a900; box-shadow: 0 0 12px rgba(57,169,0,.7); animation: codeFlash .5s ease; }
@keyframes codeFlash { 0% { box-shadow: 0 0 0 rgba(57,169,0,0); } 50% { box-shadow: 0 0 18px rgba(57,169,0,.9); } 100% { box-shadow: 0 0 12px rgba(57,169,0,.7); } }

/* ---- Ejercicio 8: Perilla Knob ---- */
.knob-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
.knob-base { width: 130px; height: 130px; border-radius: 50%; background: #1a2332; border: 3px solid #00b7ff; position: relative; touch-action: none; cursor: pointer; }
.knob-ticks { position: absolute; inset: 0; }
.tick { position: absolute; top: 50%; left: 50%; width: 2px; height: 8px; background: rgba(0,183,255,.45); border-radius: 1px; }
.knob-handle { width: 100%; height: 100%; position: absolute; top: 0; left: 0; transition: transform 0.05s ease-out; }
.knob-dot { width: 8px; height: 8px; background: #ffc107; border-radius: 50%; position: absolute; top: 12px; left: calc(50% - 4px); animation: dotGlow 1.6s ease-in-out infinite; }
@keyframes dotGlow { 0%, 100% { box-shadow: 0 0 6px #ffc107; } 50% { box-shadow: 0 0 14px #ffc107, 0 0 4px #fff; } }
.knob-readout { font-family: monospace; font-size: 1.1rem; color: #ffc107; margin: 0; transition: transform .1s ease; }
.knob-readout.pulse { animation: readoutPulse .15s ease; }
@keyframes readoutPulse { 0% { transform: scale(1.18); } 100% { transform: scale(1); } }

/* ---- Ejercicio 9: Lanzamiento ---- */
.launch { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.85rem; }
.field input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 0.5rem; border-radius: 6px; width: 120px; }
.launch-track { height: 40px; background: rgba(0,0,0,0.4); border-radius: 20px; position: relative; display: flex; align-items: center; padding: 0 10px; overflow: hidden; }
.probe { position: absolute; top: 50%; transform: translateY(-50%); font-size: 1.2rem; }
.probe.trail-success { filter: drop-shadow(0 0 10px #39a900); animation: probeGlowCross .8s ease; }
.probe.trail-success::before { content: ''; position: absolute; right: 100%; top: 50%; transform: translateY(-50%); width: 60px; height: 4px; background: linear-gradient(90deg, transparent, #39a900); opacity: .85; }
@keyframes probeGlowCross { 0% { filter: drop-shadow(0 0 2px #39a900); } 100% { filter: drop-shadow(0 0 14px #39a900); } }
.probe.bounce-fail { filter: drop-shadow(0 0 8px #ff5252); animation: probeBounceFail .5s ease; }
@keyframes probeBounceFail { 0% { transform: translateY(-50%) translateX(0); } 30% { transform: translateY(-50%) translateX(8px); } 60% { transform: translateY(-50%) translateX(-4px); } 100% { transform: translateY(-50%) translateX(0); } }
.launch-target { position: absolute; right: 15px; font-size: 0.75rem; color: #ffc107; }
.launch-result.success { color: #00ff66; }
.launch-result.fail { color: #ff5252; }

/* ---- Botones de Acción ---- */
.eval-actions { display: flex; justify-content: space-between; margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; }
.btn-sec { background: rgba(255,255,255,0.08); border: none; color: #fff; padding: 0.6rem 1.2rem; border-radius: 8px; cursor: pointer; }
.btn-eng { background: #39a900; border: none; color: #fff; padding: 0.6rem 1.2rem; border-radius: 8px; font-weight: bold; cursor: pointer; }
.btn-eng:disabled { opacity: 0.5; cursor: not-allowed; }
.stop-btn { background: #ff5252; }

/* ---- Panel de Resultados ---- */
.result-card { text-align: center; }
.status-icon { font-size: 3rem; margin-bottom: 0.5rem; }
.score-badge { display: inline-flex; flex-direction: column; padding: 0.75rem 1.5rem; border-radius: 12px; margin: 1rem 0; font-weight: bold; font-size: 1.5rem; }
.score-badge.ok { background: rgba(57, 169, 0, 0.2); color: #39a900; border: 1px solid #39a900; }
.score-badge.bad { background: rgba(255, 82, 82, 0.2); color: #ff5252; border: 1px solid #ff5252; }

.result-banner {
  max-width: 480px; margin: 0.5rem auto 1.25rem; padding: 1rem 1.25rem; border-radius: 10px;
  animation: bannerIn .4s ease;
}
.result-banner h4 { margin: 0 0 0.35rem; font-size: 1.05rem; }
.result-banner p { margin: 0; font-size: 0.85rem; line-height: 1.5; color: #d7e0f5; }
.result-banner.ok { background: rgba(57, 169, 0, 0.12); border: 1px solid rgba(57, 169, 0, 0.4); box-shadow: 0 0 18px rgba(57, 169, 0, 0.25); }
.result-banner.ok h4 { color: #39a900; }
.result-banner.bad { background: rgba(255, 82, 82, 0.1); border: 1px solid rgba(255, 82, 82, 0.35); box-shadow: 0 0 18px rgba(255, 82, 82, 0.2); }
.result-banner.bad h4 { color: #ff5252; }
@keyframes bannerIn { 0% { opacity: 0; transform: translateY(-8px) scale(.97); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
.review-section { text-align: left; margin: 1.5rem 0; display: flex; flex-direction: column; gap: 0.75rem; }
.review-item { padding: 0.85rem; border-radius: 8px; background: rgba(0,0,0,0.2); }
.review-item.item-ok { border-left: 4px solid #39a900; }
.review-item.item-bad { border-left: 4px solid #ff5252; }
.review-head { display: flex; justify-content: space-between; font-weight: bold; font-size: 0.85rem; }
.review-exp { font-size: 0.8rem; color: #a0aec0; margin: 0.35rem 0 0 0; }
</style>