<script setup>
import { useUserStore } from '@/stores/user'

import ConteudoHomeAdmin from "@/components/funcionario/admin/ConteudoHomeAdmin.vue";
import ConteudoHomeRecepcionista from "@/components/funcionario/recepcionista/ConteudoHomeRecepcionista.vue";
import ConteudoHomeInstrutor from "@/components/funcionario/instrutor/ConteudoHomeInstrutor.vue";

const userStore = useUserStore()
</script>

<template>
  <!-- ADMIN -->
  <ConteudoHomeAdmin v-if="userStore.isAdmin" />

  <!-- INSTRUTOR -->
  <ConteudoHomeInstrutor v-else-if="userStore.isInstrutor" />

  <!-- RECEPCIONISTA -->
  <ConteudoHomeRecepcionista v-else-if="userStore.isRecepcionista" />
</template>

<style scoped>

</style>
