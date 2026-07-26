<template>
  <div class="intro-container">
    <!-- Encabezado -->
    <div class="intro-header">
      <span class="badge-pill">Guía 1 · Cinemática</span>
      <h2>Tema 3: Aceleración</h2>
      <p class="intro-lead">Cómo cambia la velocidad en el tiempo — y por qué importa.</p>
    </div>

    <!-- Pestañas: Contexto / Competencia con animación en los botones -->
    <div class="context-card">
      <div class="context-toggle" role="tablist" aria-label="Contexto del tema">
        <button
          v-for="(tab, i) in tabs"
          :key="tab.id"
          type="button"
          class="toggle-btn"
          :class="{ 'is-active': activeTab === i }"
          role="tab"
          :aria-selected="activeTab === i"
          @click="selectTab(i, $event)"
        >
          <span aria-hidden="true">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
        <div
          class="toggle-indicator"
          :style="{ transform: `translateX(${activeTab * 100}%)` }"
          aria-hidden="true"
        ></div>
      </div>

      <transition name="fade-swap" mode="out-in">
        <p class="tab-panel" :key="activeTab">{{ tabs[activeTab].text }}</p>
      </transition>
    </div>

    <!-- Ruta formativa: tarjetas que giran al tocarlas -->
    <div class="roadmap-grid">
      <button
        v-for="(item, i) in roadmap"
        :key="item.step"
        type="button"
        class="flip-card"
        :class="{ 'is-flipped': flipped[i] }"
        @click="toggleFlip(i)"
        :aria-pressed="flipped[i]"
        :aria-label="`Paso ${item.step}: ${item.title}. Toca para ver el detalle.`"
      >
        <div class="flip-inner">
          <div class="flip-face flip-front">
            <span class="step-num">{{ item.step }}</span>
            <h4>{{ item.title }}</h4>
            <span class="tap-hint">Toca ↻</span>
          </div>
          <div class="flip-face flip-back">
            <p>{{ item.detail }}</p>
          </div>
        </div>
      </button>
    </div>

    <!-- Llamado a la acción -->
    <div class="action-banner">
      <h4>¿Listo para empezar?</h4>
      <router-link to="/nivel-2" class="btn-launch">
        <span>Contenidos</span>
        <span class="arrow" aria-hidden="true">→</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { animate, utils } from 'animejs'

const tabs = [
  {
    id: 'contexto',
    icon: '📍',
    label: 'Contexto',
    text: 'Rapidez y aceleración no son lo mismo: la aceleración mide qué tan rápido cambia la velocidad. Clave en transporte y control de movimiento.',
  },
  {
    id: 'competencia',
    icon: '⚙️',
    label: 'Competencia',
    text: 'Aplicar magnitudes escalares y vectoriales de la cinemática, con énfasis en el cálculo de la aceleración.',
  },
]

const activeTab = ref(0)

const roadmap = [
  { step: '01', title: 'Introducción', detail: 'Objetivos y conceptos base del tema.' },
  { step: '02', title: 'Contenidos', detail: 'Fórmulas y gráficos velocidad-tiempo.' },
  { step: '03', title: 'Actividad', detail: 'Simulación interactiva con sliders.' },
  { step: '04', title: 'Evaluación', detail: '10 problemas con vehículos de la región.' },
]

const flipped = reactive(roadmap.map(() => false))
function toggleFlip(i) {
  flipped[i] = !flipped[i]
}

// Función para cambiar de pestaña y aplicar la animación elástica al botón clickeado
function selectTab(i, event) {
  activeTab.value = i
  
  const buttonElement = event.currentTarget

  animate(buttonElement, {
    scale: [0.85, 1.05, 1],
    rotate: [utils.random(-10, 10), 0],
    duration: 1200,
    ease: 'outElastic(1, .5)',
  })
}
</script>

<style scoped>
.intro-container {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Encabezado */
.intro-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.badge-pill {
  display: inline-block;
  padding: 0.35rem 1rem;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.4px;
  color: var(--accent-neon);
  background: rgba(57, 255, 20, 0.1);
  border: 1px solid rgba(57, 255, 20, 0.35);
  border-radius: 50px;
  margin-bottom: 0.85rem;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.15);
}

.intro-header h2 {
  font-family: var(--fuente-principal);
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  font-weight: 800;
  color: #ffffff;
  margin: 0 0 0.5rem;
  letter-spacing: -0.3px;
}

.intro-lead {
  font-size: 1rem;
  color: var(--texto-secundario);
  margin: 0;
  font-weight: 500;
}

/* Tarjeta de pestañas contexto/competencia (Glassmorphism) */
.context-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radio-sm, 14px);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.context-toggle {
  position: relative;
  display: flex;
  background: rgba(0, 119, 255, 0.12);
  border: 1px solid rgba(0, 183, 255, 0.2);
  border-radius: 999px;
  padding: 4px;
  margin-bottom: 1rem;
}

.toggle-indicator {
  position: absolute;
  top: 4px;
  left: 4px;
  width: calc(50% - 4px);
  height: calc(100% - 8px);
  background: rgba(0, 119, 255, 0.4);
  border: 1px solid rgba(0, 183, 255, 0.5);
  border-radius: 999px;
  box-shadow: 0 0 15px rgba(0, 119, 255, 0.3);
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.toggle-btn {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border: none;
  background: transparent;
  font-family: var(--fuente-principal);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--texto-secundario);
  cursor: pointer;
  border-radius: 999px;
  transition: color 0.3s ease;
  transform-origin: center center;
}

.toggle-btn.is-active {
  color: #ffffff;
  font-weight: 700;
}

.tab-panel {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #f8fafc;
}

.fade-swap-enter-active,
.fade-swap-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-swap-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-swap-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Ruta formativa: tarjetas flip */
.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  perspective: 1200px;
}

.flip-card {
  position: relative;
  height: 150px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  text-align: left;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform-style: preserve-3d;
}

.flip-card:hover .flip-inner {
  transform: translateY(-3px);
}

.flip-card.is-flipped .flip-inner {
  transform: rotateY(180deg);
}

.flip-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: var(--radio-sm, 14px);
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.flip-front {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.step-num {
  font-family: var(--fuente-codigo);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--accent-neon);
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.4);
}

.flip-front h4 {
  margin: 0.2rem 0 0.4rem;
  font-family: var(--fuente-principal);
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
}

.tap-hint {
  font-size: 0.72rem;
  color: var(--texto-secundario);
  font-weight: 600;
}

.flip-back {
  background: linear-gradient(135deg, rgba(0, 119, 255, 0.35), rgba(6, 15, 35, 0.9));
  border: 1px solid rgba(0, 183, 255, 0.4);
  color: #fff;
  transform: rotateY(180deg);
  backdrop-filter: blur(12px);
}

.flip-back p {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.45;
  color: #e2e8f0;
}

/* Llamado a la acción */
.action-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(0, 119, 255, 0.2), rgba(57, 255, 20, 0.08));
  border: 1px solid rgba(0, 183, 255, 0.3);
  border-radius: var(--radio-sm, 14px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.action-banner h4 {
  margin: 0;
  color: #fff;
  font-family: var(--fuente-principal);
  font-size: 1.15rem;
  font-weight: 800;
}

.btn-launch {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.75rem;
  background: linear-gradient(135deg, #0077ff, #00b7ff);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  text-decoration: none;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 119, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.btn-launch:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 183, 255, 0.6);
  background: linear-gradient(135deg, #0085ff, #00d2ff);
}

.arrow {
  display: inline-block;
  transition: transform 0.3s ease;
}

.btn-launch:hover .arrow {
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .action-banner {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  .btn-launch {
    justify-content: center;
  }
}
</style>