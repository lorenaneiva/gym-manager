<script setup>
import { useUserStore } from '@/stores/user'
import ConteudoHomeAdmin from "@/components/funcionario/admin/ConteudoHomeAdmin.vue";
import ConteudoHomeRecepcionista from "@/components/funcionario/recepcionista/ConteudoHomeRecepcionista.vue";
import ConteudoHomeInstrutor from "@/components/funcionario/instrutor/ConteudoHomeInstrutor.vue";

const userStore = useUserStore()
</script>

<template>
  <main class="funcionario-home page-shell">
    <header class="page-header">
      <h1>Dashboard</h1>
      <p>Visão geral da sua academia</p>
    </header>

    <ConteudoHomeAdmin v-if="userStore.isAdmin" />

    <ConteudoHomeInstrutor v-else-if="userStore.isInstrutor" />

    <ConteudoHomeRecepcionista v-else-if="userStore.isRecepcionista" />
  </main>
</template>

<style scoped>
.funcionario-home {
  display: grid;
  gap: 24px;
}

.page-header h1 {
  margin: 0 0 6px;
  color: var(--text-strong);
  font-size: 28px;
  font-weight: 500;
}

.page-header p {
  margin: 0;
  color: var(--text-soft);
}
</style>
