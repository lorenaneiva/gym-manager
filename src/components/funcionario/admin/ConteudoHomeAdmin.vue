<script setup>
import { useRouter } from 'vue-router'
import MyCard from '@/components/utils/MyCard.vue'
import MyButton from '@/components/utils/MyButton.vue'

const router = useRouter()

const gerenciarAdmin = (rota) => {
  router.push({ name: rota })
}
</script>

<template>
  <div class="container-grid">
    <MyCard class="card-destaque">
      <h3>Cadastrar funcionários</h3>
      <p>Adicione novos funcionários no sistema</p>
      <MyButton @click="gerenciarAdmin('cadastrar-funcionario')">Novo funcionário</MyButton>
    </MyCard>

    <MyCard class="card-destaque">
      <h3>Cadastrar plano</h3>
      <p>Crie e configure os planos de assinatura</p>
      <MyButton @click="gerenciarAdmin('cadastrar-plano')">Novo plano</MyButton>
    </MyCard>

    <MyCard>
      <h3>Visualizar alunos</h3>
      <p>Visualize os alunos cadastrados</p>
      <MyButton @click="gerenciarAdmin('alunos')">Ver alunos</MyButton>
    </MyCard>

    <MyCard>
      <h3>Agendamentos</h3>
      <p>Consulte os agendamentos</p>
      <MyButton @click="gerenciarAdmin('agendamentos')">Ver agendamentos</MyButton>
    </MyCard>

<!--    <MyCard>-->
<!--      <h3>Relatorios</h3>-->
<!--      <p>Acesse os relatorios</p>-->
<!--      <MyButton @click="gerenciarAdmin('relatorios')">Ver relatórios</MyButton>-->
<!--    </MyCard>-->

<!--    <MyCard>-->
<!--      <h3>Mensalidades</h3>-->
<!--      <p>Acompanhe os pagamentos dos alunos</p>-->
<!--      <MyButton @click="gerenciarAdmin('mensalidades')">Ver mensalidades</MyButton>-->
<!--    </MyCard>-->
  </div>
</template>

<style scoped>
.container-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.card-destaque { border: 2px solid #4f46e5; }
</style>
