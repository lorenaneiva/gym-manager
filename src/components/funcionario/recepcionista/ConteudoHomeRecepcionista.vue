<script setup>
import { useRouter } from 'vue-router'
import MyCard from '@/components/utils/MyCard.vue'
import MyButton from '@/components/utils/MyButton.vue'

const router = useRouter()

const gerenciarRecep = (rota) => {
  router.push({ name: rota })
}
</script>

<template>
  <div class="container-grid">
    <MyCard>
      <h3>Cadastrar aluno</h3>
      <p>Registre um novo aluno na academia</p>
      <MyButton @click="gerenciarRecep('cadastrar-aluno')">Novo aluno</MyButton>
    </MyCard>

    <MyCard>
      <h3>Ver alunos</h3>
      <p>Liste e gerencie todos os alunos</p>
      <MyButton @click="gerenciarRecep('alunos')">Ver alunos</MyButton>
    </MyCard>

    <MyCard>
      <h3>Agendamentos</h3>
      <p>Visualize e gerencie os agendamentos</p>
      <MyButton @click="gerenciarRecep('agendamentos')">Ver agendamentos</MyButton>
    </MyCard>
  </div>
</template>

<style scoped>
.container-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
</style>
