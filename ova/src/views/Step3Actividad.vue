<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

const G_MOON = 1.15 // Gravedad reducida para un descenso más suave y controlable

const DIFFICULTIES = {
  facil:   { label: 'Fácil',   h0: [300, 380], v0: [20, 26], thrustMax: 3.5, fuel: 140, safeV: 3.5, desc: 'Ideal para practicar. Caída muy pausada y mayor margen.' },
  normal:  { label: 'Normal',  h0: [400, 480], v0: [28, 35], thrustMax: 3.0, fuel: 110, safeV: 3.0, desc: 'Desafío equilibrado. Requiere cálculo moderado y buen pulso.' },
  dificil: { label: 'Difícil', h0: [500, 600], v0: [38, 48], thrustMax: 2.5, fuel: 90,  safeV: 2.5, desc: 'Nivel experto. Margen de error ajustado.' },
}

const FUEL_BURN_RATE = 12

const difficulty = ref('normal')
const mode = ref('manual')
const phase = ref('setup') // 'setup' | 'flight' | 'landed' | 'crashed' | 'calc'

const scenario = reactive({ h0: 0, v0: 0, thrustMax: 0, fuelCap: 0, safeV: 0, desc: '' })
const sim = reactive({ t: 0, h: 0, v: 0, a: 0, fuel: 0, throttle: 0 })

const history = ref([])
const log = ref([])
let rafId = null
let lastTs = null

const ignitionAltitude = ref(null)
const studentAnswer = ref(null)

const velocityAtIgnition = computed(() => {
  if (ignitionAltitude.value == null || ignitionAltitude.value <= 0) return null
  const hIgn = Math.min(ignitionAltitude.value, scenario.h0)
  const v2 = scenario.v0 ** 2 + 2 * G_MOON * (scenario.h0 - hIgn)
  return Math.sqrt(Math.max(v2, 0))
})

const requiredDeceleration = computed(() => {
  const vIgn = velocityAtIgnition.value
  if (vIgn == null || ignitionAltitude.value <= 0) return null
  return vIgn ** 2 / (2 * ignitionAltitude.value)
})

const answerFeedback = computed(() => {
  if (studentAnswer.value == null || requiredDeceleration.value == null) return null
  const diff = Math.abs(studentAnswer.value - requiredDeceleration.value)
  const tolerance = requiredDeceleration.value * 0.1
  return diff <= tolerance ? 'correcto' : 'incorrecto'
})

function randBetween([min, max]) {
  return Math.round((min + Math.random() * (max - min)) * 10) / 10
}

function prepareMission() {
  stopLoop()
  const d = DIFFICULTIES[difficulty.value]
  scenario.h0 = randBetween(d.h0)
  scenario.v0 = randBetween(d.v0)
  scenario.thrustMax = d.thrustMax
  scenario.fuelCap = d.fuel
  scenario.safeV = d.safeV
  scenario.desc = d.desc

  sim.t = 0
  sim.h = scenario.h0
  sim.v = scenario.v0
  sim.a = G_MOON
  sim.fuel = scenario.fuelCap
  sim.throttle = 0

  history.value = [{ t: 0, v: scenario.v0, h: scenario.h0 }]
  log.value = []
  ignitionAltitude.value = null
  studentAnswer.value = null

  phase.value = 'setup'
  pushLog(`Misión configurada en modo ${d.label} · h₀: ${scenario.h0} m`)
}

function launchMission() {
  if (mode.value === 'auto') {
    phase.value = 'calc'
    pushLog('Panel de física activado: Resuelve los cálculos de MRUA.')
  } else {
    phase.value = 'flight'
    lastTs = null
    pushLog('🚀 ¡Descenso manual iniciado! Controla los retrocohetes.')
    rafId = requestAnimationFrame(step)
  }
}

function pushLog(msg) {
  const tag = `T+${sim.t.toFixed(2)}s`
  log.value.unshift(`${tag} · ${msg}`)
  if (log.value.length > 40) log.value.pop()
}

function stopLoop() {
  if (rafId) cancelAnimationFrame(rafId)
  rafId = null
}

function step(ts) {
  if (lastTs == null) lastTs = ts
  const dt = Math.min((ts - lastTs) / 1000, 0.05)
  lastTs = ts

  if (mode.value === 'auto') {
    const hIgn = ignitionAltitude.value ?? 0
    const aReq = studentAnswer.value ?? 0
    sim.throttle = sim.h <= hIgn && sim.fuel > 0 ? 100 * Math.min(aReq / scenario.thrustMax, 1) : 0
  }

  if (sim.fuel <= 0) sim.throttle = 0

  const thrustAccel = (sim.throttle / 100) * scenario.thrustMax
  sim.a = G_MOON - thrustAccel

  sim.v += sim.a * dt
  sim.h -= sim.v * dt
  sim.t += dt

  if (sim.throttle > 0) {
    sim.fuel = Math.max(0, sim.fuel - (sim.throttle / 100) * FUEL_BURN_RATE * dt)
    if (sim.fuel === 0) pushLog('⚠ ¡Alerta! Combustible agotado.')
  }

  if (sim.t - (history.value[0]?.t ?? -1) > 0.15) {
    history.value.push({ t: sim.t, v: sim.v, h: Math.max(sim.h, 0) })
    if (history.value.length > 400) history.value.shift()
  }

  if (sim.h <= 0) {
    sim.h = 0
    finishFlight()
    return
  }

  rafId = requestAnimationFrame(step)
}

function finishFlight() {
  stopLoop()
  history.value.push({ t: sim.t, v: sim.v, h: 0 })
  const impact = Math.abs(sim.v)
  if (impact <= scenario.safeV) {
    phase.value = 'landed'
    pushLog(`✅ ¡Aterrizaje perfecto! v = ${impact.toFixed(2)} m/s`)
  } else {
    phase.value = 'crashed'
    pushLog(`💥 Impacto muy fuerte. v = ${impact.toFixed(2)} m/s`)
  }
}

function setThrottle(val) {
  sim.throttle = Math.max(0, Math.min(100, val))
}

function adjustThrottle(delta) {
  setThrottle(sim.throttle + delta)
}

function onKeydown(e) {
  if (phase.value !== 'flight' || mode.value !== 'manual') return
  if (e.key === 'ArrowUp') { adjustThrottle(10); e.preventDefault() }
  if (e.key === 'ArrowDown') { adjustThrottle(-10); e.preventDefault() }
}

function setMode(m) {
  mode.value = m
  prepareMission()
}

function beginAutoFlight() {
  if (requiredDeceleration.value == null || studentAnswer.value == null) return
  pushLog(`Autopiloto programado · Alt. Ignición: ${ignitionAltitude.value} m · Acel: ${studentAnswer.value} m/s²`)
  phase.value = 'flight'
  lastTs = null
  rafId = requestAnimationFrame(step)
}

onMounted(() => {
  prepareMission()
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  stopLoop()
  window.removeEventListener('keydown', onKeydown)
})

const VIEW_TOP = 30
const VIEW_GROUND = 360

const moduleY = computed(() => {
  const ratio = scenario.h0 > 0 ? Math.min(sim.h / scenario.h0, 1) : 0
  return VIEW_GROUND - ratio * (VIEW_GROUND - VIEW_TOP)
})

const flameHeight = computed(() => 4 + (sim.throttle / 100) * 26)

const speedStatus = computed(() => {
  if (Math.abs(sim.v) <= scenario.safeV) return 'ok'
  if (Math.abs(sim.v) <= scenario.safeV * 1.6) return 'warn'
  return 'danger'
})

const chartPoints = computed(() => {
  if (history.value.length < 2) return ''
  const maxT = Math.max(...history.value.map(p => p.t), 0.001)
  const maxV = Math.max(...history.value.map(p => Math.abs(p.v)), 1)
  return history.value
    .map(p => {
      const x = (p.t / maxT) * 300
      const y = 70 - (p.v / maxV) * 60
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
})
</script>

<template>
  <div class="lander-container">
    <header class="lander__header">
      <div class="lander__title">
        <span class="badge-pill">Simulador Educativo · Física Espacial</span>
        <h2>Desafío de Descenso Lunar Suave</h2>
        <p class="subtitle">Caída optimizada para estudiantes: más pausada y fácil de controlar.</p>
      </div>

      <div class="lander__setup">
        <div class="setup-controls">
          <label class="field">
            <span>1. Elige la Dificultad</span>
            <select v-model="difficulty" @change="prepareMission" :disabled="phase === 'flight'">
              <option v-for="(d, key) in DIFFICULTIES" :key="key" :value="key">{{ d.label }}</option>
            </select>
          </label>

          <label class="field">
            <span>2. Selecciona el Modo</span>
            <div class="mode-toggle" role="tablist">
              <button
                role="tab"
                :aria-selected="mode === 'manual'"
                :class="{ active: mode === 'manual' }"
                :disabled="phase === 'flight'"
                @click="setMode('manual')"
              >🎮 Manual</button>
              <button
                role="tab"
                :aria-selected="mode === 'auto'"
                :class="{ active: mode === 'auto' }"
                :disabled="phase === 'flight'"
                @click="setMode('auto')"
              >📐 Automático (Cálculo)</button>
            </div>
          </label>
        </div>
      </div>
    </header>

    <div class="lander__body">
      <section class="viewport" aria-label="Visor visual de descenso">
        <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="flameGrad" cx="50%" cy="0%" r="80%">
              <stop offset="0%" stop-color="#FFD166" stop-opacity="0.95" />
              <stop offset="100%" stop-color="#EF476F" stop-opacity="0" />
            </radialGradient>
          </defs>

          <g class="stars">
            <circle v-for="n in 28" :key="n"
              :cx="(n * 37) % 320" :cy="(n * 53) % 300" r="1.1" fill="#8fa3c7" opacity="0.7" />
          </g>

          <line x1="18" :y1="VIEW_TOP" x2="18" :y2="VIEW_GROUND" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <text x="24" :y="VIEW_TOP + 8" class="scale-label">{{ scenario.h0.toFixed(0) }} m</text>
          <text x="24" :y="VIEW_GROUND" class="scale-label">0 m (Superficie)</text>

          <rect x="0" :y="VIEW_GROUND" width="320" height="40" fill="#0f1422" />
          <line x1="0" y1="360" x2="320" y2="360" stroke="#39a900" stroke-width="1.5" opacity="0.4" />
          <rect x="115" :y="VIEW_GROUND - 2" width="90" height="6" rx="2" class="platform"
            :class="phase === 'landed' ? 'platform--ok' : phase === 'crashed' ? 'platform--danger' : ''" />
          <text x="160" :y="VIEW_GROUND + 24" text-anchor="middle" class="scale-label">
            Zona de Aterrizaje · Meta: v ≤ {{ scenario.safeV }} m/s
          </text>

          <g :transform="`translate(160, ${moduleY})`">
            <ellipse v-if="sim.throttle > 0 && phase === 'flight'"
              cx="0" :cy="14 + flameHeight / 2" rx="7" :ry="flameHeight / 2"
              fill="url(#flameGrad)" />
            <g class="module" :class="{ crashed: phase === 'crashed' }">
              <rect x="-11" y="-16" width="22" height="26" rx="4" fill="#c7d3ef" />
              <rect x="-14" y="6" width="6" height="10" fill="#8fa3c7" />
              <rect x="8" y="6" width="6" height="10" fill="#8fa3c7" />
              <circle cx="0" cy="-6" r="5" fill="#0b0e14" stroke="#00b7ff" stroke-width="1.5" />
            </g>
          </g>
        </svg>
      </section>

      <section class="panel">
        <div v-if="phase === 'setup'" class="calc-card">
          <h3>📌 Paso 3 · Preparación de la Misión</h3>
          <p class="hint">{{ scenario.desc }}</p>
          <div class="mission-preview">
            <p><strong>Altitud de partida (h₀):</strong> {{ scenario.h0 }} metros</p>
            <p><strong>Velocidad inicial de caída (v₀):</strong> {{ scenario.v0 }} m/s</p>
            <p><strong>Combustible disponible:</strong> {{ scenario.fuelCap }}%</p>
            <p><strong>Velocidad máxima permitida al tocar suelo:</strong> Máximo {{ scenario.safeV }} m/s</p>
          </div>
          <button class="btn-eng run" @click="launchMission">
            <span>🚀 {{ mode === 'auto' ? 'Ir al Análisis Teórico' : '¡Comenzar Descenso Manual!' }}</span>
          </button>
        </div>

        <div v-else-if="mode === 'auto' && phase === 'calc'" class="calc-card">
          <h3>📐 Paso 3.1 · Resolución de Fórmulas (MRUA)</h3>
          <p class="hint">Calcula la física del descenso antes de activar el piloto automático.</p>
          <ol class="formula-steps">
            <li>Elige a qué altura encenderás los motores (h<sub>ign</sub>).</li>
            <li>Calcula la velocidad previa: v² = v₀² + 2·g·(h₀ − h<sub>ign</sub>)</li>
            <li>Halla la desaceleración necesaria: a = v<sub>ign</sub>² / (2·h<sub>ign</sub>)</li>
          </ol>

          <label class="field">
            <span>Altitud de ignición h<sub>ign</sub> (m) [Máx: {{ scenario.h0 }}]</span>
            <input type="number" min="1" :max="scenario.h0" v-model.number="ignitionAltitude" placeholder="Ej: 150" />
          </label>

          <p v-if="velocityAtIgnition != null" class="derived">
            💡 Velocidad calculada en ignición ≈ {{ velocityAtIgnition.toFixed(2) }} m/s
          </p>

          <label class="field">
            <span>Tu respuesta de desaceleración (m/s²)</span>
            <input type="number" step="0.01" min="0" v-model.number="studentAnswer" placeholder="Ej: 2.0" />
          </label>

          <p v-if="answerFeedback === 'correcto'" class="feedback ok">
            ✔ ¡Excelente! El cálculo es correcto. Ya puedes activar el sistema.
          </p>
          <p v-else-if="answerFeedback === 'incorrecto'" class="feedback bad">
            ⚠ Revisa la fórmula de desaceleración. Intenta recalcular con calma.
          </p>

          <button class="btn-eng run" :disabled="requiredDeceleration == null || studentAnswer == null" @click="beginAutoFlight">
            <span>🚀 Activar Autopiloto y Desender</span>
          </button>
        </div>

        <div v-else class="telemetry-card">
          <h3>📊 Tablero de Telemetría en Vuelo</h3>
          <dl class="telemetry-grid">
            <div class="t-box"><dt>Tiempo</dt><dd>{{ sim.t.toFixed(2) }}s</dd></div>
            <div class="t-box"><dt>Altitud</dt><dd>{{ sim.h.toFixed(1) }}m</dd></div>
            <div class="t-box" :class="'v-' + speedStatus">
              <dt>Velocidad</dt><dd>{{ sim.v.toFixed(2) }}</dd>
            </div>
            <div class="t-box"><dt>Acel. Neta</dt><dd>{{ sim.a.toFixed(2) }}</dd></div>
            <div class="t-box"><dt>Combustible</dt><dd>{{ sim.fuel.toFixed(0) }}%</dd></div>
            <div class="t-box"><dt>Acelerador</dt><dd>{{ sim.throttle.toFixed(0) }}%</dd></div>
          </dl>

          <div class="chart-wrapper">
            <svg class="chart" viewBox="0 0 300 80" preserveAspectRatio="none">
              <line x1="0" y1="70" x2="300" y2="70" stroke="rgba(255,255,255,0.15)" />
              <polyline :points="chartPoints" fill="none" stroke="#00b7ff" stroke-width="2" />
            </svg>
            <span class="chart-caption">Gráfica de Velocidad del Módulo en el Tiempo</span>
          </div>

          <div v-if="mode === 'manual' && phase === 'flight'" class="throttle-control">
            <label class="field">
              <span>Potencia de Retrocohetes: <strong>{{ sim.throttle.toFixed(0) }}%</strong></span>
              <input type="range" min="0" max="100" step="1"
                :value="sim.throttle"
                @input="setThrottle(Number($event.target.value))" />
            </label>
            <span class="hint-key">🕹️ <strong>Tip:</strong> Usa las flechas <strong>↑</strong> y <strong>↓</strong> del teclado para regular la potencia con calma.</span>
          </div>

          <div v-if="phase === 'landed' || phase === 'crashed'" class="result" :class="phase">
            <h4>{{ phase === 'landed' ? '🎉 ¡Misión Cumplida: Alunizaje Exitoso!' : '💥 ¡Oops! Demasiado rápido, el módulo colisionó' }}</h4>
            <p>Velocidad de contacto: <strong>{{ Math.abs(sim.v).toFixed(2) }} m/s</strong> (Requerido: ≤ {{ scenario.safeV }} m/s)</p>
            <button class="btn-eng run" @click="prepareMission"><span>🔄 Intentar Nueva Misión</span></button>
          </div>

          <button v-else-if="phase !== 'flight'" class="btn-eng run" @click="prepareMission">
            <span>🚀 Reiniciar Misión</span>
          </button>
        </div>

        <div class="log-card" aria-live="polite">
          <h3>📝 Bitácora de Eventos</h3>
          <ul>
            <li v-for="(entry, i) in log" :key="i">{{ entry }}</li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.lander-container {
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

.lander__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1.25rem;
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

.lander__title h2 {
  margin: 0 0 0.25rem;
  font-size: 1.35rem;
  color: #fff;
}

.subtitle {
  color: #b0c4de;
  font-size: 0.88rem;
  margin: 0;
  max-width: 50ch;
}

.lander__setup {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-end;
}

.setup-controls {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #b0c4de;
  font-weight: 600;
}

.field input, .field select {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font-family: inherit;
  font-size: 0.85rem;
  outline: none;
  cursor: pointer;
}

.field select option {
  background: #0f1422;
  color: #fff;
}

.field input:focus, .field select:focus {
  border-color: #00b7ff;
}

.mode-toggle {
  display: flex;
  gap: 0.4rem;
}

.mode-toggle button {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #b0c4de;
  padding: 0.5rem 0.85rem;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-toggle button.active {
  background: rgba(0, 183, 255, 0.12);
  border-color: #00b7ff;
  color: #00b7ff;
}

.mode-toggle button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.lander__body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .lander__body { grid-template-columns: 1fr; }
  .lander__setup { align-items: stretch; }
  .setup-controls { flex-direction: column; align-items: stretch; }
}

.viewport {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.scale-label {
  fill: #b0c4de;
  font-size: 8px;
  font-family: monospace;
}

.platform { fill: #00b7ff; }
.platform--ok { fill: #39a900; }
.platform--danger { fill: #ff4d4d; }
.module rect, .module circle { transition: fill 0.2s; }
.module.crashed rect { fill: #ff4d4d; }

.panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.calc-card, .telemetry-card, .log-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem;
}

.calc-card h3, .telemetry-card h3, .log-card h3 {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #00b7ff;
}

.hint {
  color: #b0c4de;
  font-size: 0.82rem;
  line-height: 1.4;
  margin: 0.3rem 0;
}

.mission-preview {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  border-radius: 8px;
  margin: 0.75rem 0;
  font-size: 0.82rem;
  color: #b0c4de;
}
.mission-preview p { margin: 0.25rem 0; }

.hint-key {
  display: block;
  margin-top: 0.5rem;
  color: #b0c4de;
  font-size: 0.75rem;
}

.formula-steps {
  color: #b0c4de;
  font-size: 0.8rem;
  line-height: 1.6;
  padding-left: 1.2rem;
  margin: 0.5rem 0;
}

.derived {
  font-size: 0.85rem;
  color: #00b7ff;
  font-weight: 600;
  margin: 0.4rem 0;
}

.feedback {
  font-size: 0.82rem;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  margin: 0.5rem 0;
  font-weight: 600;
}
.feedback.ok { background: rgba(57, 169, 0, 0.12); color: #39a900; border: 1px solid rgba(57, 169, 0, 0.3); }
.feedback.bad { background: rgba(255, 77, 77, 0.12); color: #ff4d4d; border: 1px solid rgba(255, 77, 77, 0.3); }

.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin: 0 0 1rem;
}

.t-box {
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.t-box dt {
  font-size: 0.65rem;
  color: #b0c4de;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.t-box dd {
  margin: 0.15rem 0 0;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
}

.v-ok dd { color: #39a900 !important; }
.v-warn dd { color: #ffb703 !important; }
.v-danger dd { color: #ff4d4d !important; }

.chart-wrapper {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1rem;
}

.chart { width: 100%; height: 70px; display: block; }
.chart-caption { color: #b0c4de; font-size: 0.68rem; display: block; text-align: center; margin-top: 0.25rem; }

.throttle-control input[type="range"] {
  accent-color: #39a900;
  width: 100%;
  margin-top: 0.3rem;
}

.result {
  margin-top: 0.75rem;
  padding: 0.85rem;
  border-radius: 8px;
}
.result.landed { background: rgba(57, 169, 0, 0.1); border: 1px solid rgba(57, 169, 0, 0.3); }
.result.crashed { background: rgba(255, 77, 77, 0.1); border: 1px solid rgba(255, 77, 77, 0.3); }
.result h4 { margin: 0 0 0.25rem; color: #fff; }
.result p { margin: 0 0 0.5rem; font-size: 0.82rem; color: #b0c4de; }

.btn-eng {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  margin-top: 0.75rem;
}

.btn-eng.run {
  background: linear-gradient(135deg, #0077ff, #39a900);
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 119, 255, 0.3);
}

.btn-eng:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.log-card ul {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 120px;
  overflow-y: auto;
  font-size: 0.73rem;
  color: #b0c4de;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: monospace;
}
</style>