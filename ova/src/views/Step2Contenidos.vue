<template>
  <div class="content-container">
    <!-- Encabezado Multimedia Dinámico y Funcional -->
    <div class="content-header" ref="headerRef">
      <div class="header-badge-group">
        <span class="badge-pill">Núcleo Explicativo · Teoría y Fórmulas</span>
        <div class="live-status-indicator">
          <span class="pulse-dot"></span>
          <span>Simulador Activo</span>
        </div>
      </div>
      <h2>La Dinámica de la Aceleración</h2>
      <p class="content-lead">
        Explora en tiempo real cómo un cambio de velocidad en el tiempo transforma radicalmente la trayectoria de los cuerpos en el espacio.
      </p>
    </div>

    <!-- Banner Multimedia Interactivo 3D con Efectos Visuales -->
    <div class="hero-media-banner" ref="bannerRef">
      <div class="cyber-grid-overlay"></div>
      <div class="particle-effect"></div>
      <div class="banner-content-box">
        <div class="banner-badge">🚀 Módulo Espacial en Directo</div>
        <h3>Vector de Aceleración y Gravedad Cero</h3>
        <p>Interactúa con los controles inferiores para modificar los parámetros en vivo.</p>
      </div>
      <div class="live-vector-preview">
        <div class="vector-line"></div>
        <span class="vector-label">a = 3.5 m/s²</span>
      </div>
    </div>

    <!-- Tarjetas Interactivas con Visor 360° Avanzado -->
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
            <div class="object-core" :style="{ backgroundImage: `url(${card.bgImage})` }">
              <span class="object-icon">{{ card.icon }}</span>
              <div class="object-ring"></div>
            </div>
          </div>
          <div class="drag-hint" :class="{ 'is-hidden': activeDraggingIndex === index }">
            <span>↔️ Arrastra para girar 360°</span>
          </div>
        </div>

        <h3>{{ card.title }}</h3>
        <p>{{ card.text }}</p>
      </div>
    </div>

    <!-- Sección Interactiva: Tipos de Aceleración (Conmutador Visual Real) -->
    <div class="accel-types-section" ref="typesRef">
      <div class="section-title-wrapper">
        <span class="formula-tag">Clasificación Cinemática Interactiva</span>
        <h3>Selecciona un Estado Físico para Analizar</h3>
      </div>
      <div class="types-grid">
        <div 
          v-for="type in accelerationTypes" 
          :key="type.id"
          class="type-card" 
          @click="selectType(type.id)" 
          :class="{ active: activeType === type.id }"
        >
          <div class="type-icon">{{ type.icon }}</div>
          <h4>{{ type.title }}</h4>
          <p>{{ type.desc }}</p>
          <div class="active-glow-border"></div>
        </div>
      </div>
      <!-- Panel de Detalles Dinámico según la selección -->
      <div class="dynamic-info-panel" v-if="currentTypeData">
        <span class="panel-tag">Análisis en tiempo real:</span>
        <p><strong>Efecto Visual:</strong> {{ currentTypeData.detail }}</p>
      </div>
    </div>

    <!-- Caso Práctico Guiado en Formato Infográfico Paso a Paso -->
    <div class="guided-example-card" ref="exampleRef">
      <div class="example-header-flex">
        <div class="example-tag">💡 Infografía Interactiva · Caso Práctico</div>
        <span class="badge-difficulty">Nivel: Introductorio</span>
      </div>
      <h3>¿Cómo calcular la aceleración de despegue?</h3>
      <p>Si una sonda espacial aumenta su velocidad de <strong>4 m/s</strong> a <strong>18 m/s</strong> en un intervalo de <strong>4 segundos</strong>:</p>
      <div class="mini-formula-steps">
        <div class="step-item"><span>1. Sustituimos valores:</span> <code>a = (18 - 4) / 4</code></div>
        <div class="step-item"><span>2. Resolvemos la diferencia:</span> <code>a = 14 / 4</code></div>
        <div class="step-item highlight-result"><span>3. Resultado final:</span> <strong>a = 3.5 m/s² (Aceleración positiva constante)</strong></div>
      </div>
    </div>

    <!-- Sección de Fórmula y Gráfico Teórico SVG Dinámico -->
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
          <strong>a</strong> = aceleración (m/s²) · <strong>v<sub>f</sub></strong> = velocidad final (m/s) ·
          <strong>v<sub>0</sub></strong> = velocidad inicial (m/s) · <strong>t</strong> = tiempo (s).
        </p>
      </div>

      <!-- Gráfico Teórico Explicativo (Velocidad vs Tiempo) -->
      <div class="theory-graph-card">
        <div class="graph-header">
          <h3>📈 Comportamiento en el Gráfico Velocidad vs. Tiempo</h3>
          <p>La pendiente de la línea recta representa visualmente la aceleración constante del objeto.</p>
        </div>
        <div class="graph-viewport">
          <svg viewBox="0 0 500 180" preserveAspectRatio="xMidYMid meet">
            <line x1="50" y1="140" x2="450" y2="140" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
            <line x1="50" y1="20" x2="50" y2="140" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
            
            <text x="460" y="144" fill="#b0c4de" font-size="11">t (s)</text>
            <text x="35" y="25" fill="#b0c4de" font-size="11">v (m/s)</text>

            <!-- Línea que cambia dinámicamente según el tipo seleccionado -->
            <line 
              x1="50" 
              :y1="currentGraphLine.y1" 
              x2="380" 
              :y2="currentGraphLine.y2" 
              stroke="#00ffcc" 
              stroke-width="3" 
              class="animated-graph-line"
            />
            
            <circle cx="50" :cy="currentGraphLine.y1" r="5" fill="#00ffcc" />
            <text x="30" :y="currentGraphLine.y1 + 4" fill="#00ffcc" font-size="10">v₀</text>

            <circle cx="380" :cy="currentGraphLine.y2" r="5" fill="#00ffcc" />
            <text x="390" :y="currentGraphLine.y2 + 4" fill="#00ffcc" font-size="10">v_f</text>

            <line x1="380" :y1="currentGraphLine.y2" x2="380" y2="140" stroke="rgba(0, 255, 204, 0.3)" stroke-dasharray="4,4" />
            <text x="375" y="155" fill="#b0c4de" font-size="10">t</text>
          </svg>
        </div>
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

const activeType = ref('positive')

const accelerationTypes = [
  {
    id: 'positive',
    icon: '🚀',
    title: 'Positiva (Aceleración)',
    desc: 'El cuerpo aumenta su velocidad módulo por segundo.',
    detail: 'La velocidad final es mayor que la inicial ($v_f > v_0$). La pendiente del gráfico es ascendente.'
  },
  {
    id: 'negative',
    icon: '⚓',
    title: 'Negativa (Frenado)',
    desc: 'Reduce su velocidad progresivamente en el tiempo.',
    detail: 'La velocidad final es menor que la inicial ($v_f < v_0$). La pendiente del gráfico es descendente (desaceleración).'
  },
  {
    id: 'centripetal',
    icon: '🔄',
    title: 'Centrípeta (Dirección)',
    desc: 'Cambia la dirección de la trayectoria manteniendo el módulo.',
    detail: 'El vector de velocidad cambia de rumbo constantemente apuntando siempre hacia el centro de la curvatura.'
  }
]

const currentTypeData = computed(() => {
  return accelerationTypes.find(t => t.id === activeType.value)
})

const currentGraphLine = computed(() => {
  if (activeType.value === 'positive') return { y1: 120, y2: 50 }
  if (activeType.value === 'negative') return { y1: 50, y2: 120 }
  return { y1: 85, y2: 85 } // Constante / centrípeta neutra
})

function selectType(id) {
  activeType.value = id
}

const explanationCards = [
  {
    icon: '⚡',
    title: '¿Qué es la Aceleración?',
    text: 'Magnitud vectorial que mide cómo cambia la velocidad en el tiempo. Un resultado positivo indica ganancia de velocidad; uno negativo, desaceleración.',
    bgImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=400&auto=format&fit=crop'
  },
  {
    icon: '📈',
    title: 'Gráficos Velocidad vs. Tiempo',
    text: 'La pendiente de la recta en el gráfico representa la aceleración. Una línea ascendente denota aumento de velocidad constante.',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=400&auto=format&fit=crop'
  },
  {
    icon: '🌌',
    title: 'Contexto de Ingeniería',
    text: 'Fundamental para calcular la fuerza de empuje en propulsores espaciales y asegurar transiciones seguras en trayectorias orbitales.',
    bgImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop'
  },
]

const rotations = reactive([0, 0, 0])
const activeDraggingIndex = ref(null)
let startX = 0

const headerRef = ref(null)
const bannerRef = ref(null)
const cardsRef = ref([])
const typesRef = ref(null)
const exampleRef = ref(null)
const formulaSectionRef = ref(null)

onMounted(() => {
  animate(headerRef.value, {
    opacity: [0, 1],
    translateY: [-30, 0],
    duration: 1000,
    ease: 'outExpo',
  })

  if (bannerRef.value) {
    animate(bannerRef.value, {
      opacity: [0, 1],
      scale: [0.96, 1],
      delay: 200,
      duration: 1000,
      ease: 'outQuad',
    })
  }

  animate(cardsRef.value, {
    opacity: [0, 1],
    translateY: [50, 0],
    scale: [0.9, 1],
    delay: utils.stagger(150, { start: 400 }),
    duration: 1200,
    ease: 'outElastic(1, .6)',
  })

  if (typesRef.value) {
    animate(typesRef.value, {
      opacity: [0, 1],
      translateY: [30, 0],
      delay: 600,
      duration: 1000,
      ease: 'outQuad',
    })
  }

  if (exampleRef.value) {
    animate(exampleRef.value, {
      opacity: [0, 1],
      translateY: [30, 0],
      delay: 750,
      duration: 1000,
      ease: 'outQuad',
    })
  }

  animate(formulaSectionRef.value, {
    opacity: [0, 1],
    scale: [0.95, 1],
    delay: 900,
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
</script>

<style scoped>
.content-container {
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
  max-width: 1000px;
  margin: 0 auto;
}

/* Encabezado y Estado en Vivo */
.content-header {
  text-align: center;
}

.header-badge-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.85rem;
}

.badge-pill {
  display: inline-block;
  padding: 0.35rem 1rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: #00ffcc;
  background: rgba(0, 255, 204, 0.12);
  border: 1px solid rgba(0, 255, 204, 0.35);
  border-radius: 50px;
}

.live-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 255, 204, 0.08);
  border: 1px solid rgba(0, 255, 204, 0.3);
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.7rem;
  color: #00ffcc;
  font-weight: 700;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background-color: #00ffcc;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ffcc;
  animation: pulseGlow 1.5s infinite;
}

@keyframes pulseGlow {
  0% { transform: scale(0.95); opacity: 0.8; }
  50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 16px #00ffcc; }
  100% { transform: scale(0.95); opacity: 0.8; }
}

.content-header h2 {
  font-size: clamp(1.7rem, 3vw, 2.3rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.5rem;
  letter-spacing: 0.5px;
}

.content-lead {
  font-size: 1rem;
  color: #b0c4de;
  max-width: 620px;
  margin: 0 auto;
}

/* Banner Multimedia 3D Profundo */
.hero-media-banner {
  position: relative;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(0, 255, 204, 0.4);
  background: radial-gradient(circle at 70% 30%, rgba(0, 119, 255, 0.4) 0%, rgba(6, 15, 35, 0.95) 70%);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6), inset 0 0 30px rgba(0, 255, 204, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
}

.cyber-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(0, 255, 204, 0.05) 1px, transparent 1px), 
                    linear-gradient(90deg, rgba(0, 255, 204, 0.05) 1px, transparent 1px);
  background-size: 25px 25px;
  pointer-events: none;
}

.banner-content-box {
  z-index: 2;
  max-width: 550px;
}

.banner-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  color: #00ffcc;
  font-weight: 700;
  letter-spacing: 1.2px;
  background: rgba(0, 255, 204, 0.15);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(0, 255, 204, 0.3);
}

.banner-content-box h3 {
  color: #ffffff;
  font-size: 1.4rem;
  margin: 0 0 0.4rem;
  font-weight: 800;
}

.banner-content-box p {
  color: #b0c4de;
  font-size: 0.9rem;
  margin: 0;
}

.live-vector-preview {
  position: relative;
  width: 120px;
  height: 120px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px dashed rgba(0, 255, 204, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
}

.vector-line {
  position: absolute;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #0077ff, #00ffcc);
  box-shadow: 0 0 10px #00ffcc;
  transform: rotate(-35deg);
}

.vector-label {
  position: absolute;
  bottom: 12px;
  font-size: 0.7rem;
  color: #00ffcc;
  font-weight: 700;
  background: rgba(6, 15, 35, 0.8);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

/* Tarjetas con translúcidos estilo sci-fi */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: rgba(6, 15, 35, 0.75);
  border: 1px solid rgba(0, 255, 204, 0.25);
  border-radius: 14px;
  padding: 1.4rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-card:hover {
  border-color: rgba(0, 255, 204, 0.7);
  background: rgba(10, 25, 50, 0.9);
  box-shadow: 0 10px 30px rgba(0, 255, 204, 0.25);
  transform: translateY(-4px);
}

.card-stage-360 {
  position: relative;
  height: 150px;
  background: radial-gradient(circle at center, rgba(0, 255, 204, 0.15) 0%, rgba(6, 15, 35, 0.85) 80%);
  border: 1px solid rgba(0, 255, 204, 0.3);
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
  background: radial-gradient(circle, rgba(0, 255, 204, 0.35) 0%, transparent 70%);
  border: 1px dashed rgba(0, 255, 204, 0.5);
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
  width: 68px;
  height: 68px;
  background-size: cover;
  background-position: center;
  border: 2px solid rgba(0, 255, 204, 0.7);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px rgba(0, 255, 204, 0.4);
}

.object-icon {
  font-size: 1.6rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
  z-index: 2;
}

.object-ring {
  position: absolute;
  inset: -6px;
  border: 2px dotted rgba(0, 255, 204, 0.6);
  border-radius: 50%;
  animation: spinRing 8s linear infinite;
}

@keyframes spinRing {
  to { transform: rotate(360deg); }
}

.drag-hint {
  position: absolute;
  bottom: 8px;
  background: rgba(0, 0, 0, 0.7);
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

/* Tipos de Aceleración Interactivos Reales */
.accel-types-section {
  background: rgba(6, 15, 35, 0.75);
  border: 1px solid rgba(0, 255, 204, 0.3);
  border-radius: 14px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.section-title-wrapper {
  margin-bottom: 0.2rem;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.type-card {
  position: relative;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  padding: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.type-card:hover {
  border-color: rgba(0, 255, 204, 0.5);
  background: rgba(0, 255, 204, 0.08);
  transform: translateY(-2px);
}

.type-card.active {
  border-color: #00ffcc;
  background: rgba(0, 255, 204, 0.15);
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
}

.type-icon {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}

.type-card h4 {
  color: #ffffff;
  font-size: 0.95rem;
  margin: 0 0 0.3rem;
  font-weight: 700;
}

.type-card p {
  color: #b0c4de;
  font-size: 0.8rem;
  margin: 0;
}

.dynamic-info-panel {
  background: rgba(0, 0, 0, 0.5);
  border-left: 3px solid #00ffcc;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.88rem;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.panel-tag {
  font-size: 0.68rem;
  text-transform: uppercase;
  color: #00ffcc;
  font-weight: 700;
  letter-spacing: 1px;
}

/* Caso Práctico Guiado (Infografía) */
.guided-example-card {
  background: rgba(6, 15, 35, 0.75);
  border: 1px solid rgba(0, 255, 204, 0.35);
  border-radius: 14px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.example-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.example-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #00ffcc;
  letter-spacing: 1.2px;
}

.badge-difficulty {
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  color: #b0c4de;
}

.guided-example-card h3 {
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0;
}

.guided-example-card p {
  font-size: 0.88rem;
  color: #b0c4de;
  margin: 0;
}

.mini-formula-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #00ffcc;
  font-size: 0.88rem;
  color: #e2e8f0;
}

.step-item code {
  font-family: monospace;
  color: #00ffcc;
  background: rgba(0, 255, 204, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.highlight-result {
  color: #00ffcc;
  font-weight: 700;
  border-top: 1px dashed rgba(0, 255, 204, 0.2);
  padding-top: 0.4rem;
}

/* Fórmula con fondo translúcido */
.formula-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.formula-box {
  background: rgba(6, 15, 35, 0.75);
  border: 1px solid rgba(0, 255, 204, 0.25);
  border-radius: 14px;
  padding: 2rem;
  text-align: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.formula-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #00ffcc;
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

/* Tarjeta Gráfica Teórica */
.theory-graph-card {
  background: rgba(6, 15, 35, 0.75);
  border: 1px solid rgba(0, 255, 204, 0.25);
  border-radius: 14px;
  padding: 1.75rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.graph-header h3 {
  color: #ffffff;
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.graph-header p {
  margin: 0;
  font-size: 0.88rem;
  color: #b0c4de;
}

.graph-viewport {
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 204, 0.2);
  border-radius: 10px;
  padding: 0.5rem;
}

.animated-graph-line {
  transition: all 0.4s ease-in-out;
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
  background: rgba(6, 15, 35, 0.65);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
}

.btn-nav.secondary:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-nav.primary {
  background: linear-gradient(135deg, #0077ff, #00ffcc);
  color: #060f23;
  box-shadow: 0 6px 20px rgba(0, 255, 204, 0.3);
}

.btn-nav.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 255, 204, 0.5);
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
  .hero-media-banner {
    flex-direction: column;
    height: auto;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem;
  }
  .live-vector-preview {
    margin: 0 auto;
  }
}
</style>