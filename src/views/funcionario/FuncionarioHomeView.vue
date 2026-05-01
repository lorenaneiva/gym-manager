<script setup>
import ConteudoHomeAdmin from "@/components/funcionario/admin/ConteudoHomeAdmin.vue";
import ConteudoHomeRecepcionista from "@/components/funcionario/recepcionista/ConteudoHomeRecepcionista.vue";
import ConteudoHomeInstrutor from "@/components/funcionario/instrutor/ConteudoHomeInstrutor.vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
    <!--EXPOR COMPONENTE DE ACORDO COM O TIPO DE FUNCIONARIO-->
    <ConteudoHomeAdmin v-if="userStore.isAdmin"/>
    <ConteudoHomeInstrutor v-else-if="userStore.isInstrutor"/>
    <ConteudoHomeRecepcionista v-else-if="userStore.isRecepcionista"/>
</template>

<style scoped>

</style>
