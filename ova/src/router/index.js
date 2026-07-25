import { createRouter, createWebHistory } from 'vue-router'

// 1. Importamos las 4 vistas creadas en src/views/
import Step1Introduccion from '../views/Step1Introduccion.vue'
import Step2Contenidos from '../views/Step2Contenidos.vue'
import Step3Actividad from '../views/Step3Actividad.vue'
import Step4Evaluacion from '../views/Step4Evaluacion.vue'

// 2. Asociamos cada URL con su respectivo componente
const routes = [
  {
    path: '/',
    redirect: '/nivel-1'
  },
  {
    path: '/nivel-1',
    name: 'Nivel1',
    component: Step1Introduccion
  },
  {
    path: '/nivel-2',
    name: 'Nivel2',
    component: Step2Contenidos
  },
  {
    path: '/nivel-3',
    name: 'Nivel3',
    component: Step3Actividad
  },
  {
    path: '/nivel-4',
    name: 'Nivel4',
    component: Step4Evaluacion
  },
  // Redirección si escriben una ruta que no existe
  {
    path: '/:pathMatch(.*)*',
    redirect: '/nivel-1'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router