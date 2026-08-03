 <template>
  <div class="acceleration-container">
    <!-- Encabezado -->
    <header class="acc__header">
      <div class="acc__title">
        <span class="badge-pill">Física · Cinemática Espacial</span>
        <h2>Tema 3: Aceleración de Propulsión Lineal</h2>
        <p class="subtitle">Ajusta los parámetros de velocidad y tiempo con los sliders para simular la aceleración de la nave en la pista de lanzamiento.</p>
      </div>
    </header>

    <!-- Cuerpo de la actividad -->
    <div class="acc__body">
      <!-- Visor SVG (Pista espacial y Nave) -->
      <section class="viewport" aria-label="Visor visual de aceleración espacial">
        <svg viewBox="0 0 600 200" preserveAspectRatio="xMidYMid meet">
          <!-- Fondo espacial con estrellas -->
          <rect x="0" y="0" width="600" height="120" fill="#030712" />
          <circle cx="100" cy="30" r="1" fill="#fff" opacity="0.5" />
          <circle cx="250" cy="50" r="1.5" fill="#fff" opacity="0.8" />
          <circle cx="400" cy="25" r="1" fill="#fff" opacity="0.6" />
          <circle cx="520" cy="70" r="1.2" fill="#fff" opacity="0.4" />
          
          <!-- Pista de lanzamiento horizontal -->
          <rect x="0" y="120" width="600" height="80" fill="#0f172a" />
          <line x1="0" y1="160" x2="600" y2="160" stroke="#38bdf8" stroke-width="2" stroke-dasharray="15, 10" opacity="0.6" />

          <!-- Balizas de distancia -->
          <line x1="50" y1="110" x2="50" y2="190" stroke="rgba(56, 189, 248, 0.3)" stroke-dasharray="2,2" />
          <text x="50" y="105" text-anchor="middle" class="scale-label">0 m (Ignición)</text>

          <line x1="550" y1="110" x2="550" y2="190" stroke="rgba(56, 189, 248, 0.3)" stroke-dasharray="2,2" />
          <text x="550" y="105" text-anchor="middle" class="scale-label">500 m (Despegue)</text>

          <!-- Nave espacial animada con cinemática real -->
          <g :transform="`translate(${posicionXNave}, 125)`" class="vehicle-group">
            <!-- Cuerpo de la nave -->
            <path d="M 0 15 L 45 5 L 60 15 L 45 25 Z" fill="#38bdf8" />
            <!-- Propulsor / Fuego dinámico según aceleración -->
            <polygon points="0,12 -15,15 0,18" fill="#f97316" v-if="progreso > 0 && progreso < 1" />
            <!-- Cabina -->
            <ellipse cx="30" cy="15" rx="8" ry="4" fill="#030712" />
            <!-- Alas -->
            <path d="M 15 18 L 10 30 L 25 24 Z" fill="#0284c7" />
            <path d="M 15 12 L 10 0 L 25 6 Z" fill="#0284c7" />
          </g>
        </svg>
      </section>

      <!-- Panel de Control con Sliders -->
      <section class="panel">
        <div class="calc-card">
          <h3>🎛️ Controles de Propulsión (Sliders)</h3>
          
          <label class="field">
            <span>Velocidad Inicial ($v_0$): <strong>{{ v0 }} m/s</strong></span>
            <input type="range" min="0" max="20" step="1" v-model.number="v0" @input="ejecutarSimulacion" />
          </label>

          <label class="field">
            <span>Velocidad Final ($v_f$): <strong>{{ vf }} m/s</strong></span>
            <input type="range" min="0" max="60" step="1" v-model.number="vf" @input="ejecutarSimulacion" />
          </label>

          <label class="field">
            <span>Tiempo de Aceleración ($t$): <strong>{{ tiempo }} s</strong></span>
            <input type="range" min="1" max="15" step="1" v-model.number="tiempo" @input="ejecutarSimulacion" />
          </label>
        </div>

        <!-- Resultados y Fórmula -->
        <div class="telemetry-card">
          <h3>📊 Datos de Aceleración</h3>
          <div class="formula-box">
            <p>Fórmula: $a = \frac{v_f - v_0}{t}$</p>
          </div>
          <div class="results-grid">
            <div class="t-box">
              <dt>Aceleración ($a$)</dt>
              <dd>{{ aceleracion.toFixed(2) }} m/s²</dd>
            </div>
            <div class="t-box">
              <dt>Distancia Total</dt>
              <dd>{{ distancia.toFixed(1) }} m</dd>
            </div>
          </div>

          <button class="btn-eng run" @click="reproducirAnimacion">
            <span>🚀 Lanzar Propulsión</span>
          </button>
        </div>
      </section>
    </div>

    <!-- Navegación corregida -->
    <footer class="navigation-footer">
      <router-link to="/nivel-2" class="btn-nav secondary">
        <span>← Volver a Contenidos</span>
      </router-link>
      <router-link to="/nivel-4" class="btn-nav primary">
        <span>Ir a la Evaluación</span>
        <span class="arrow">→</span>
      </router-link>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const v0 = ref(0)
const vf = ref(30)
const tiempo = ref(5)

const progreso = ref(0)
let idAnimacion = null

const aceleracion = computed(() => {
  if (tiempo.value <= 0) return 0
  return (vf.value - v0.value) / tiempo.value
})

const distancia = computed(() => {
  return v0.value * tiempo.value + 0.5 * aceleracion.value * (tiempo.value ** 2)
})

// Cinemática real: x(t) = v₀·t + 0.5·a·t² mapeado a los píxeles de la pista (50px a 500px)
const posicionXNave = computed(() => {
  const tActual = progreso.value * tiempo.value
  const distanciaActual = v0.value * tActual + 0.5 * aceleracion.value * (tActual ** 2)
  const distanciaMaxima = v0.value * tiempo.value + 0.5 * aceleracion.value * (tiempo.value ** 2) || 1
  const fraccionRecorrida = Math.min(Math.max(distanciaActual / distanciaMaxima, 0), 1)
  return 50 + fraccionRecorrida * 450
})

function ejecutarSimulacion() {
  if (vf.value < v0.value) {
    vf.value = v0.value
  }
}

function reproducirAnimacion() {
  progreso.value = 0
  let marcaTiempoInicio = null
  const duracion = tiempo.value * 1000

  function paso(marcaTiempo) {
    if (!marcaTiempoInicio) marcaTiempoInicio = marcaTiempo
    const transcurrido = marcaTiempo - marcaTiempoInicio
    progreso.value = Math.min(transcurrido / duracion, 1)

    if (progreso.value < 1) {
      idAnimacion = requestAnimationFrame(paso)
    }
  }

  if (idAnimacion) cancelAnimationFrame(idAnimacion)
  idAnimacion = requestAnimationFrame(paso)
}
</script>

<style scoped>
.acceleration-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  background: rgba(3, 7, 18, 0.9);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 16px;
  padding: 1.75rem;
  color: #f8fafc;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);
}

.acc__header {
  border-bottom: 1px solid rgba(56, 189, 248, 0.15);
  padding-bottom: 1rem;
}

.badge-pill {
  display: inline-block;
  padding: 0.35rem 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 50px;
  margin-bottom: 0.6rem;
}

.acc__title h2 {
  margin: 0 0 0.25rem;
  font-size: 1.4rem;
  color: #fff;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.88rem;
  margin: 0;
}

.acc__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.viewport {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 12px;
  overflow: hidden;
  padding: 0.5rem;
}

.scale-label {
  fill: #94a3b8;
  font-size: 10px;
  font-family: monospace;
}

.panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 768px) {
  .panel { grid-template-columns: 1fr; }
}

.calc-card, .telemetry-card {
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.15);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.calc-card h3, .telemetry-card h3 {
  margin: 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #38bdf8;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.8rem;
  color: #cbd5e1;
  font-weight: 600;
}

.field input[type="range"] {
  accent-color: #38bdf8;
  width: 100%;
}

.formula-box {
  background: rgba(56, 189, 248, 0.05);
  border-left: 3px solid #38bdf8;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: #fff;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.t-box {
  background: rgba(3, 7, 18, 0.5);
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
}

.t-box dt {
  font-size: 0.65rem;
  color: #94a3b8;
  text-transform: uppercase;
}

.t-box dd {
  margin: 0.2rem 0 0;
  font-size: 1rem;
  font-weight: bold;
  color: #38bdf8;
}

.btn-eng {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  margin-top: auto;
}

.btn-eng.run {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #030712;
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
}

.btn-eng:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.navigation-footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(56, 189, 248, 0.15);
  padding-top: 1.25rem;
}

.btn-nav {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-nav.secondary {
  background: rgba(15, 23, 42, 0.65);
  color: #cbd5e1;
  border: 1px solid rgba(56, 189, 248, 0.2);
}

.btn-nav.secondary:hover {
  background: rgba(56, 189, 248, 0.1);
  color: #fff;
}

.btn-nav.primary {
  background: linear-gradient(135deg, #0284c7, #38bdf8);
  color: #030712;
  box-shadow: 0 4px 15px rgba(56, 189, 248, 0.3);
}

.btn-nav.primary:hover {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(56, 189, 248, 0.5);
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