 <template>
  <div id="app-shell">
    <!-- Fondo ambiental espacial con estrellas móviles y aurora boreal -->
    <div class="ambient-bg" aria-hidden="true">
      <div class="glow glow-blue"></div>
      <div class="glow glow-green"></div>
      <div class="glow glow-accent"></div>
    </div>

    <!-- Partículas flotantes de energía -->
    <div class="particles" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span><span></span>
    </div>

    <!-- Barra de navegación con efecto Glassmorphism espacial -->
    <header class="site-header" :class="{ 'is-compact': isScrolled }" role="banner">
      <div class="header-inner">
        <div class="brand">
          <div class="brand-mark-container">
            <span class="brand-mark" aria-hidden="true">🚀</span>
          </div>
          <div class="brand-text">
            <h1>OVA · Módulo de Estudio</h1>
            <span class="sub-brand">Objeto Virtual de Aprendizaje</span>
          </div>
        </div>

        <button
          class="menu-toggle"
          :class="{ 'active': menuOpen }"
          type="button"
          @click="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-controls="stepper-nav"
          aria-label="Abrir menú de navegación de pasos"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Navegación por Pasos del OVA (Sin línea central atravesada) -->
      <nav
        id="stepper-nav"
        class="stepper"
        :class="{ 'is-open': menuOpen }"
        role="navigation"
        aria-label="Pasos del objeto virtual de aprendizaje"
      >
        <router-link
          v-for="(step, i) in steps"
          :key="step.path"
          :to="step.path"
          class="step"
          :class="{ 'is-active': i === activeIndex, 'is-completed': i < activeIndex }"
          :aria-label="`Ir al Paso ${i + 1}: ${step.label}`"
          @click="menuOpen = false"
        >
          <span class="step-circle">
            <span v-if="i < activeIndex" class="check-icon">✓</span>
            <span v-else>{{ String(i + 1).padStart(2, '0') }}</span>
          </span>
          <div class="step-text-wrap">
            <span class="step-subtitle">Paso 0{{ i + 1 }}</span>
            <span class="step-label">{{ step.label }}</span>
          </div>
        </router-link>
      </nav>
    </header>

    <!-- Contenedor principal con tarjeta de cristal y brillo recorriendo -->
    <main class="content-area" role="main">
      <div class="content-card">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Pie de página general -->
    <footer class="site-footer">
      <div class="footer-line" aria-hidden="true"></div>
      <p>Plataforma Educativa Interactiva · Todos los derechos reservados</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const steps = [
  { path: '/nivel-1', label: 'Introducción' },
  { path: '/nivel-2', label: 'Contenidos' },
  { path: '/nivel-3', label: 'Actividad' },
  { path: '/nivel-4', label: 'Evaluación' },
]

const activeIndex = computed(() => {
  const idx = steps.findIndex((s) => route.path.startsWith(s.path))
  return idx === -1 ? 0 : idx
})

const menuOpen = ref(false)
const isScrolled = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* ===== Estilos Globales & Variables ===== */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

:root {
  --primary-glow: #0077ff;
  --accent-neon: #39ff14;
  
  --fondo: #020611;
  --superficie: rgba(255, 255, 255, 0.08);
  --texto: #f8fafc;
  --texto-secundario: #94a3b8;

  --sombra-md: 0 12px 35px rgba(0, 119, 255, 0.25);
  --sombra-lg: 0 25px 60px rgba(0, 0, 0, 0.6);
  --sombra-neon: 0 0 25px rgba(57, 255, 20, 0.7);

  --radio: 20px;
  --radio-sm: 14px;

  --fuente-principal: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --fuente-codigo: 'JetBrains Mono', monospace;

  --duracion: 0.4s;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--fuente-principal);
  background-color: var(--fondo);
  color: var(--texto);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

.content-card h2,
.content-card h3 {
  font-family: var(--fuente-principal);
  color: #ffffff;
  font-weight: 800;
}

.content-card a {
  color: var(--accent-neon);
  font-weight: 700;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
</style>

<style scoped>
#app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at top, #0d2d52 0%, #020611 70%, #000 100%);
}

/* ===== Fondo Estelar ===== */
#app-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: 
    radial-gradient(white 1px, transparent 1px),
    radial-gradient(#58ffca 1px, transparent 1px),
    radial-gradient(#2fa8ff 1px, transparent 1px);
  background-size: 120px 120px, 180px 180px, 260px 260px;
  animation: starsMove 80s linear infinite;
  opacity: 0.45;
  pointer-events: none;
  z-index: -2;
}

@keyframes starsMove {
  from { transform: translateY(0); }
  to { transform: translateY(-800px); }
}

/* ===== Aurora Boreal Animada ===== */
.ambient-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
}

.ambient-bg::before {
  content: "";
  position: absolute;
  width: 1200px;
  height: 1200px;
  background: radial-gradient(circle, rgba(0, 255, 200, 0.25), transparent 70%);
  filter: blur(120px);
  animation: aurora 14s ease-in-out infinite alternate;
}

@keyframes aurora {
  0% { transform: translate(-20%, 0%) rotate(0deg); }
  100% { transform: translate(25%, 20%) rotate(40deg); }
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
}

.glow-blue {
  width: 500px;
  height: 500px;
  background: #0077ff;
  top: -150px;
  left: -100px;
}

.glow-green {
  width: 450px;
  height: 450px;
  background: var(--accent-neon);
  bottom: -150px;
  right: -80px;
  opacity: 0.25;
}

.glow-accent {
  width: 350px;
  height: 350px;
  background: #00e5ff;
  top: 35%;
  left: 35%;
  opacity: 0.15;
}

/* ===== Partículas Flotantes ===== */
.particles span {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-neon);
  box-shadow: 0 0 20px var(--accent-neon);
  animation: particle 12s linear infinite;
  z-index: 0;
  pointer-events: none;
}

.particles span:nth-child(1) { left: 10%; animation-delay: 0s; top: 100%; }
.particles span:nth-child(2) { left: 30%; animation-delay: 3s; top: 100%; }
.particles span:nth-child(3) { left: 50%; animation-delay: 1s; top: 100%; }
.particles span:nth-child(4) { left: 70%; animation-delay: 4s; top: 100%; }
.particles span:nth-child(5) { left: 85%; animation-delay: 2s; top: 100%; }
.particles span:nth-child(6) { left: 95%; animation-delay: 5s; top: 100%; }

@keyframes particle {
  0% { transform: translateY(0) scale(1); opacity: 0; }
  20% { opacity: 0.8; }
  80% { opacity: 0.8; }
  100% { transform: translateY(-100vh) scale(0.2); opacity: 0; }
}

/* ===== Header Glassmorphism con Brillo ===== */
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(6, 15, 35, 0.65);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: var(--sombra-md);
  overflow: hidden;
  transition: all var(--duracion) cubic-bezier(0.16, 1, 0.3, 1);
}

.site-header::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(255, 255, 255, 0.12), transparent);
  animation: shine 8s infinite;
  pointer-events: none;
}

@keyframes shine {
  0% { transform: translateX(-100%); }
  20%, 100% { transform: translateX(100%); }
}

.header-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2.5rem 1rem;
  transition: padding var(--duracion) ease;
}

.site-header.is-compact .header-inner {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* ===== Logo Flotando ===== */
.brand-mark {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 14px;
  font-size: 1.3rem;
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.3), rgba(0, 119, 255, 0.5));
  border: 1px solid var(--accent-neon);
  box-shadow: var(--sombra-neon);
  animation: floatLogo 4s ease-in-out infinite;
}

@keyframes floatLogo {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.brand-text h1 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: -0.3px;
  color: #ffffff;
}

.sub-brand {
  display: block;
  font-size: 0.75rem;
  color: #76e4ff;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
  margin-top: 0.2rem;
}

/* ===== Botón Hamburguesa Animado ===== */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  z-index: 10;
}

.menu-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 2px;
  transition: 0.4s;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ===== Stepper limpio en formato de Tarjetas/Píldoras Flotantes ===== */
.stepper {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 2.5rem 1.25rem;
  max-width: 1200px;
  margin: 0 auto;
}

.step {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.65rem 1.15rem;
  text-decoration: none;
  color: #b3e0ff;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radio-sm);
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.step::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, #00f5ff, #00ff88, #0066ff, #00f5ff);
  background-size: 300%;
  animation: borderMove 5s linear infinite;
  opacity: 0;
  transition: 0.4s;
  z-index: -1;
  border-radius: var(--radio-sm);
}

@keyframes borderMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.step:hover::before {
  opacity: 1;
}

.step:hover {
  transform: translateY(-5px) scale(1.02);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.step-circle {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-family: var(--fuente-codigo);
  font-weight: 700;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.step:hover .step-circle {
  transform: scale(1.1);
  box-shadow: 0 0 20px #39ff14, 0 0 35px #00b7ff;
}

.step-text-wrap {
  display: flex;
  flex-direction: column;
}

.step-subtitle {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #76e4ff;
  font-weight: 800;
}

.step-label {
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: -0.2px;
  color: #ffffff;
  white-space: nowrap;
}

.step.is-active {
  background: rgba(0, 119, 255, 0.2);
  border-color: rgba(0, 183, 255, 0.6);
  box-shadow: 0 8px 25px rgba(0, 119, 255, 0.3);
  animation: pulseActive 2.5s infinite;
}

@keyframes pulseActive {
  0% { box-shadow: 0 0 0 0 rgba(0, 183, 255, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(0, 183, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 183, 255, 0); }
}

.step.is-active .step-label {
  color: #ffffff;
  font-weight: 800;
}

.step.is-active .step-subtitle {
  color: var(--accent-neon);
}

.step.is-active .step-circle {
  background: #0077ff;
  border-color: var(--accent-neon);
  color: #fff;
  box-shadow: var(--sombra-neon);
}

.step.is-completed .step-circle {
  background: rgba(57, 255, 20, 0.15);
  border-color: var(--accent-neon);
  color: var(--accent-neon);
}

.check-icon {
  font-size: 0.9rem;
  font-weight: 800;
}

/* ===== Tarjeta Tipo Cristal con Brillo Recorriendo ===== */
.content-area {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 2rem 4rem;
  position: relative;
  z-index: 1;
}

.content-card {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radio);
  box-shadow: var(--sombra-lg);
  padding: clamp(2rem, 5vw, 3.5rem);
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #0077ff, var(--accent-neon));
}

.content-card::after {
  content: "";
  position: absolute;
  left: -40%;
  top: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.18), transparent);
  transform: skewX(-25deg);
  animation: shineCard 7s infinite;
  pointer-events: none;
}

@keyframes shineCard {
  0% { left: -40%; }
  20%, 100% { left: 140%; }
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 35px 80px rgba(0, 119, 255, 0.3);
}

/* Transiciones modernas de páginas con desenfoque */
.page-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  filter: blur(15px);
  transform: translateY(40px) scale(0.96);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ===== Footer ===== */
.site-footer {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem 1rem 2.5rem;
  color: var(--texto-secundario);
  font-size: 0.85rem;
  font-weight: 600;
}

.footer-line {
  width: 80px;
  height: 3px;
  margin: 0 auto 1rem;
  background: linear-gradient(90deg, #0077ff, var(--accent-neon));
  border-radius: 4px;
}

/* ===== Responsive Móvil ===== */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .header-inner {
    padding: 1rem 1.25rem;
  }

  .stepper {
    flex-direction: column;
    align-items: stretch;
    max-height: 0;
    overflow: hidden;
    padding: 0 1.25rem;
    transition: max-height 0.45s ease, padding 0.45s ease;
    background: rgba(2, 6, 17, 0.95);
  }

  .stepper.is-open {
    max-height: 360px;
    padding: 1rem 1.25rem 1.25rem;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .step {
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: var(--radio-sm);
    border-left: 4px solid transparent;
    margin-bottom: 0.35rem;
  }

  .step-label {
    color: #ffffff;
    font-size: 0.95rem;
  }

  .step.is-active {
    background: rgba(57, 255, 20, 0.2);
    border-left-color: var(--accent-neon);
    border-color: rgba(57, 255, 20, 0.4);
  }

  .content-area {
    padding: 1.5rem 1rem 3rem;
  }

  .content-card {
    padding: 1.5rem;
  }
}
</style>