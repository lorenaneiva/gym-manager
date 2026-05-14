<script setup>
import { RouterView } from 'vue-router'
import TheNavbar from "./components/layout/TheNavbar.vue";
</script>

<template>
  <div class="app-shell">
    <TheNavbar/>
    <RouterView />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--app-background);
}
</style>
