<script setup>
import { useUserStore } from '@/stores/user'
import ConteudoInstrutor from '@/components/funcionario/instrutor/ConteudoHomeInstrutor.vue'
import ConteudoAdm from '@/components/funcionario/admin/ConteudoHomeAdmin.vue'
import ConteudoRecep from '@/components/funcionario/recepcionista/ConteudoHomeRecepcionista.vue'

const userStore = useUserStore()
</script>

<template>
  <div class="home-wrapper">
    <header class="header-sessao">
      <h1>Painel do Funcionário</h1>
      <p>Sua role: <strong>{{ userStore.user?.role }}</strong></p>
    </header>

    <main class="conteudo-principal">
      <ConteudoAdm v-if="userStore.isAdmin" />
      <ConteudoRecep v-else-if="userStore.isRecepcionista" />
      <ConteudoInstrutor v-else-if="userStore.isInstrutor" />

      <div v-else class="alerta">
        Aguardando definição de cargo...
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-wrapper { padding: 20px; }
.header-sessao { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.conteudo-principal { min-height: 60vh; }
</style>
