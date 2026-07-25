<template>
  <div id="app-container">
    <header class="navbar">
      <div class="brand">
        <h1>OVA: Aceleración</h1>
      </div>

      <nav class="nav-links">
        <router-link to="/nivel-1" class="nav-btn">Nivel 1</router-link>
        <router-link to="/nivel-2" class="nav-btn">Nivel 2</router-link>
        <router-link to="/nivel-3" class="nav-btn">Nivel 3</router-link>
        <router-link to="/nivel-4" class="nav-btn">Nivel 4</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
#app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background-color: #00324d;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.brand h1 {
  margin: 0;
  font-size: 1.4rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.router-link-active {
  background-color: #39a900;
  font-weight: bold;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
</style>