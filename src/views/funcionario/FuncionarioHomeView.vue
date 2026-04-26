<script setup>
import ConteudoHomeAdmin from "@/components/funcionario/admin/ConteudoHomeAdmin.vue";
import ConteudoHomeRecepcionista from "@/components/funcionario/recepcionista/ConteudoHomeRecepcionista.vue";
import ConteudoHomeInstrutor from "@/components/funcionario/instrutor/ConteudoHomeInstrutor.vue";
</script>

<template>
    <!--EXPOR COMPONENTE DE ACORDO COM O TIPO DE FUNCIONARIO-->
    <ConteudoHomeAdmin/>
    <ConteudoHomeInstrutor/>
    <ConteudoHomeRecepcionista/>
</template>

<style scoped>

</style>
