<script setup>
import { useRouter } from 'vue-router'
import MyButton from '@/components/utils/MyButton.vue'

const router = useRouter()

// simulaçao do dados, depois add odb.json)
const treinos = [
  { id: 1, aluno: 'João Silva', objetivo: 'Hipertrofia', data: '20/04/2026' },
  { id: 2, aluno: 'Maria Souza', objetivo: 'Emagrecimento', data: '21/04/2026' },
]

const irParaCadastrar = () => router.push({ name: 'cadastrar-treino' })
const irParaEditar = (id) => router.push({ name: 'atualizar-treino', params: { id } })
</script>

<template>
  <div class="instrutor-flow">
    <header class="acoes-topo">
      <h2>Gestão de Treinos</h2>
      <MyButton @click="irParaCadastrar">Novo Treino</MyButton>
    </header>

    <table class="tabela-treinos">
      <thead>
        <tr>
          <th>Aluno</th>
          <th>Objetivo</th>
          <th>Data</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="treino in treinos" :key="treino.id">
          <td>{{ treino.aluno }}</td>
          <td>{{ treino.objetivo }}</td>
          <td>{{ treino.data }}</td>
          <td>
            <MyButton @click="irParaEditar(treino.id)" class="btn-pelo-tamanho">
              Editar
            </MyButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.acoes-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tabela-treinos {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.btn-pelo-tamanho {
  padding: 5px 10px;
  font-size: 14px;
}
</style>
