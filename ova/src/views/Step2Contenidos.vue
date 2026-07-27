<template>
  <div class="content-container">
    <!-- Encabezado -->
    <div class="content-header" ref="headerRef">
      <span class="badge-pill">Núcleo Explicativo · Teoría y Fórmulas</span>
      <h2>La Dinámica de la Aceleración</h2>
      <p class="content-lead">
        Cómo un cambio de velocidad en el tiempo transforma el movimiento de los cuerpos.
      </p>
    </div>

    <!-- Tarjetas con visor 360° -->
    <div class="cards-grid">
      <div
        v-for="(card, index) in explanationCards"
        :key="index"
        class="info-card"
        ref="cardsRef"
      >
        <div
          class="card-stage-360"
          @pointerdown="startDrag(index, $event)"
          @pointermove="onDrag(index, $event)"
          @pointerup="stopDrag(index, $event)"
          @pointerleave="stopDrag(index, $event)"
        >
          <div class="turntable-glow"></div>
          <div class="object-360-wrapper" :style="{ transform: `rotateY(${rotations[index]}deg)` }">
            <div class="object-core">
              <span class="object-icon">{{ card.icon }}</span>
              <div class="object-ring"></div>
            </div>
          </div>
          <div class="drag-hint" :class="{ 'is-hidden': activeDraggingIndex === index }">
            <span>↔️ Arrastra 360°</span>
          </div>
        </div>

        <h3>{{ card.title }}</h3>
        <p>{{ card.text }}</p>
      </div>
    </div>

    <!-- Fórmula + Laboratorio de Impulso Dinámico -->
    <div class="formula-section" ref="formulaSectionRef">
      <div class="formula-box">
        <span class="formula-tag">Ecuación Fundamental</span>
        <div class="math-expression">
          a =
          <span class="frac">
            <span class="frac-num">v<sub>f</sub> − v<sub>0</sub></span>
            <span class="frac-den">t</span>
          </span>
        </div>
        <p class="formula-desc">
          <strong>a</strong> = aceleración · <strong>v<sub>f</sub></strong> = velocidad final ·
          <strong>v<sub>0</sub></strong> = velocidad inicial · <strong>t</strong> = tiempo transcurrido.
        </p>
      </div>

      <div class="impulse-lab">
        <div class="lab-header">
          <h3>Laboratorio de Impulso Dinámico</h3>
          <p>Mueve los controles y observa el vehículo acelerar o frenar en tiempo real.</p>
        </div>

        <div class="lab-controls">
          <label class="control">
            <span class="control-label">Velocidad inicial (v<sub>0</sub>)</span>
            <input type="range" min="0" max="20" step="0.5" v-model.number="v0" :disabled="running" />
            <span class="control-value">{{ v0.toFixed(1) }} m/s</span>
          </label>
          <label class="control">
            <span class="control-label">Velocidad final (v<sub>f</sub>)</span>
            <input type="range" min="0" max="30" step="0.5" v-model.number="vf" :disabled="running" />
            <span class="control-value">{{ vf.toFixed(1) }} m/s</span>
          </label>
          <label class="control">
            <span class="control-label">Tiempo (t)</span>
            <input type="range" min="1" max="8" step="0.5" v-model.number="t" :disabled="running" />
            <span class="control-value">{{ t.toFixed(1) }} s</span>
          </label>
        </div>

        <div class="lab-readout">
          <span class="a-value">a = {{ acceleration.toFixed(2) }} m/s²</span>
          <span class="a-tag" :class="accelTagClass">{{ accelLabel }}</span>
        </div>

        <div class="track">
          <div class="track-line"></div>
          <div class="finish-flag" aria-hidden="true">🏁</div>
          <div class="vehicle" :style="{ left: vehicleLeft }">
            <span class="speed-lines" v-show="running" aria-hidden="true"></span>
            <span aria-hidden="true">🚗</span>
          </div>
        </div>

        <div class="lab-footer">
          <div class="speed-gauge" role="meter" :aria-valuenow="Math.round(currentVelocity)" aria-valuemin="0">
            <div class="gauge-fill" :style="{ width: gaugeWidth }"></div>
          </div>
          <span class="gauge-label">v(t) = {{ currentVelocity.toFixed(1) }} m/s</span>
        </div>

        <button class="btn-animate-formula" @click="runImpulse" :disabled="running">
          <span>{{ running ? 'En marcha…' : 'Probar Impulso Dinámico' }}</span>
        </button>
      </div>
    </div>

    <!-- Navegación -->
    <div class="navigation-footer">
      <router-link to="/" class="btn-nav secondary">
        <span>← Volver a Introducción</span>
      </router-link>
      <router-link to="/nivel-3" class="btn-nav primary">
        <span>Siguiente: Simulación Interactiva</span>
        <span class="arrow">→</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { animate, utils } from 'animejs'

const explanationCards = [
  {
    icon: '⚡',
    title: '¿Qué es la Aceleración?',
    text: 'Magnitud vectorial que indica la variación de la velocidad por unidad de tiempo. No solo importa qué tan rápido vas, sino cómo cambia esa velocidad.',
  },
  {
    icon: '📈',
    title: 'Gráficos Velocidad vs. Tiempo',
    text: 'La pendiente de la línea en un gráfico velocidad-tiempo representa directamente la aceleración del objeto.',
  },
  {
    icon: '🚜',
    title: 'Contexto Productivo',
    text: 'Aplicado en transporte regional, frenado de vehículos pesados y mecanismos automatizados de producción.',
  },
]

// ---- Visor 360° de cada tarjeta ----
const rotations = reactive([0, 0, 0])
const activeDraggingIndex = ref(null)
let startX = 0

const headerRef = ref(null)
const cardsRef = ref([])
const formulaSectionRef = ref(null)

onMounted(() => {
  animate(headerRef.value, {
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    ease: 'outExpo',
  })

  animate(cardsRef.value, {
    opacity: [0, 1],
    translateY: [50, 0],
    scale: [0.9, 1],
    delay: utils.stagger(150, { start: 300 }),
    duration: 1200,
    ease: 'outElastic(1, .6)',
  })

  animate(formulaSectionRef.value, {
    opacity: [0, 1],
    scale: [0.95, 1],
    delay: 700,
    duration: 1000,
    ease: 'outQuad',
  })
})

function startDrag(index, event) {
  activeDraggingIndex.value = index
  startX = event.clientX
  event.currentTarget.setPointerCapture(event.pointerId)
}

function onDrag(index, event) {
  if (activeDraggingIndex.value !== index) return
  const deltaX = event.clientX - startX
  rotations[index] += deltaX * 0.8
  startX = event.clientX
}

function stopDrag(index, event) {
  if (activeDraggingIndex.value === index) {
    activeDraggingIndex.value = null
    try {
      event.currentTarget.releasePointerCapture(event.pointerId)
    } catch (e) {
      /* no-op */
    }
  }
}

// ---- Laboratorio de Impulso Dinámico ----
const v0 = ref(4)
const vf = ref(18)
const t = ref(4)
const running = ref(false)
const carProgress = ref(0)
const currentVelocity = ref(v0.value)

const acceleration = computed(() => (vf.value - v0.value) / t.value)

const accelLabel = computed(() => {
  if (acceleration.value > 0.05) return 'Acelerando'
  if (acceleration.value < -0.05) return 'Frenando'
  return 'Velocidad constante'
})

const accelTagClass = computed(() => {
  if (acceleration.value > 0.05) return 'is-positive'
  if (acceleration.value < -0.05) return 'is-negative'
  return 'is-neutral'
})

const vehicleLeft = computed(() => `calc((100% - 46px) * ${carProgress.value})`)

const gaugeWidth = computed(() => {
  const max = Math.max(v0.value, vf.value, 1) * 1.05
  return `${Math.min((currentVelocity.value / max) * 100, 100)}%`
})

const clock = reactive({ elapsed: 0 })

function runImpulse() {
  if (running.value) return
  running.value = true
  carProgress.value = 0
  currentVelocity.value = v0.value
  clock.elapsed = 0

  const a = acceleration.value
  const totalDistance = v0.value * t.value + 0.5 * a * t.value * t.value
  const visualDuration = Math.min(Math.max(t.value * 350, 1200), 4000)

  animate(clock, {
    elapsed: t.value,
    duration: visualDuration,
    ease: 'linear',
    onUpdate: () => {
      const te = clock.elapsed
      const distance = v0.value * te + 0.5 * a * te * te
      carProgress.value = totalDistance > 0 ? Math.min(Math.max(distance / totalDistance, 0), 1) : 0
      currentVelocity.value = Math.max(v0.value + a * te, 0)
    },
    onComplete: () => {
      carProgress.value = 1
      currentVelocity.value = vf.value
      running.value = false
    },
  })
}
</script>

<style scoped>
.content-container {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* Encabezado */
.content-header {
  text-align: center;
}

.badge-pill {
  display: inline-block;
  padding: 0.35rem 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: #39a900;
  background: rgba(57, 169, 0, 0.12);
  border: 1px solid rgba(57, 169, 0, 0.35);
  border-radius: 50px;
  margin-bottom: 0.85rem;
}

.content-header h2 {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.5rem;
}

.content-lead {
  font-size: 1rem;
  color: #b0c4de;
  max-width: 620px;
  margin: 0 auto;
}

/* Tarjetas con translúcidos */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1.4rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card:hover {
  border-color: rgba(57, 169, 0, 0.4);
  background: rgba(255, 255, 255, 0.07);
  box-shadow: 0 10px 30px rgba(57, 169, 0, 0.15);
  transform: translateY(-4px);
}

/* Visor 360 individual */
.card-stage-360 {
  position: relative;
  height: 150px;
  background: radial-gradient(circle at center, rgba(57, 169, 0, 0.15) 0%, rgba(6, 15, 35, 0.85) 80%);
  border: 1px solid rgba(57, 169, 0, 0.3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  overflow: hidden;
  perspective: 800px;
}

.card-stage-360:active {
  cursor: grabbing;
}

.turntable-glow {
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(57, 169, 0, 0.3) 0%, transparent 70%);
  border: 1px dashed rgba(57, 169, 0, 0.4);
  transform: rotateX(75deg);
  bottom: 12px;
  pointer-events: none;
}

.object-360-wrapper {
  position: relative;
  transform-style: preserve-3d;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.05s linear;
}

.object-core {
  position: relative;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(0, 119, 255, 0.35), rgba(57, 169, 0, 0.15));
  border: 2px solid rgba(57, 169, 0, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(57, 169, 0, 0.3);
}

.object-icon {
  font-size: 1.8rem;
}

.object-ring {
  position: absolute;
  inset: -6px;
  border: 2px dotted rgba(57, 169, 0, 0.5);
  border-radius: 50%;
  animation: spinRing 8s linear infinite;
}

@keyframes spinRing {
  to {
    transform: rotate(360deg);
  }
}

.drag-hint {
  position: absolute;
  bottom: 8px;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.65rem;
  color: #fff;
  backdrop-filter: blur(6px);
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.drag-hint.is-hidden {
  opacity: 0;
}

.info-card h3 {
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 700;
  margin: 0;
}

.info-card p {
  font-size: 0.88rem;
  color: #b0c4de;
  line-height: 1.5;
  margin: 0;
}

/* Fórmula con fondo translúcido */
.formula-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.formula-box {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}

.formula-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #39a900;
  letter-spacing: 1.2px;
}

.math-expression {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin: 1.1rem 0;
}

.frac {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.15rem;
  line-height: 1.3;
}

.frac-num {
  padding: 0 0.2rem 0.15rem;
  border-bottom: 2px solid currentColor;
}

.frac-den {
  padding-top: 0.15rem;
}

.formula-desc {
  font-size: 0.9rem;
  color: #b0c4de;
  max-width: 620px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Laboratorio de impulso translúcido */
.impulse-lab {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1.75rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.lab-header h3 {
  color: #ffffff;
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.lab-header p {
  margin: 0;
  font-size: 0.88rem;
  color: #b0c4de;
}

.lab-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.control {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.82rem;
  color: #ffffff;
}

.control-label {
  font-weight: 600;
}

.control input[type='range'] {
  accent-color: #39a900;
  width: 100%;
}

.control-value {
  font-size: 0.78rem;
  color: #b0c4de;
  font-variant-numeric: tabular-nums;
}

.lab-readout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.a-value {
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
}

.a-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  padding: 0.25rem 0.65rem;
  border-radius: 50px;
}

.a-tag.is-positive {
  background: rgba(57, 169, 0, 0.2);
  color: #39a900;
  border: 1px solid rgba(57, 169, 0, 0.4);
}

.a-tag.is-negative {
  background: rgba(200, 40, 40, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(200, 40, 40, 0.4);
}

.a-tag.is-neutral {
  background: rgba(255, 255, 255, 0.08);
  color: #b0c4de;
}

/* Pista de movimiento translúcida */
.track {
  position: relative;
  height: 60px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.track-line {
  position: absolute;
  top: 50%;
  left: 1rem;
  right: 3rem;
  height: 2px;
  background: repeating-linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.25) 0 14px,
    transparent 14px 28px
  );
  transform: translateY(-50%);
}

.finish-flag {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.vehicle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.6rem;
  transition: left 0.05s linear;
  will-change: left;
}

.speed-lines {
  position: absolute;
  top: 50%;
  right: 100%;
  width: 46px;
  height: 2px;
  transform: translateY(-50%);
  background: repeating-linear-gradient(
    90deg,
    rgba(57, 169, 0, 0.6) 0 6px,
    transparent 6px 12px
  );
}

/* Velocímetro */
.lab-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.speed-gauge {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.gauge-fill {
  height: 100%;
  background: linear-gradient(90deg, #0077ff, #39a900);
  border-radius: 8px;
  transition: width 0.05s linear;
}

.gauge-label {
  font-size: 0.78rem;
  color: #b0c4de;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* Botón */
.btn-animate-formula {
  align-self: center;
  background: linear-gradient(135deg, #0077ff, #39a900);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.8rem 1.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 119, 255, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease;
}

.btn-animate-formula:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(57, 169, 0, 0.4);
}

.btn-animate-formula:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Navegación */
.navigation-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.btn-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-nav.secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.btn-nav.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-nav.primary {
  background: linear-gradient(135deg, #0077ff, #39a900);
  color: #fff;
  box-shadow: 0 6px 20px rgba(0, 119, 255, 0.3);
}

.btn-nav.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(57, 169, 0, 0.4);
}

.arrow {
  transition: transform 0.3s ease;
}

.btn-nav.primary:hover .arrow {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .navigation-footer {
    flex-direction: column;
  }
  .btn-nav {
    justify-content: center;
  }
}
</style>