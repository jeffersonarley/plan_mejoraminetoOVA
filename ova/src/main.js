import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'


const app = createApp(App)
const pinia = createPinia()

// Instalamos Pinia y Vue Router en la app
app.use(pinia)
app.use(router)

// Montamos la aplicación en el DOM
app.mount('#app')