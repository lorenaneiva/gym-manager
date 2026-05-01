<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import MyButton from '@/components/utils/MyButton.vue'

const router = useRouter()
const treinos = ref([])
const alunos = ref([])
const carregando = ref(true)
const erro = ref('')

const buscarDados = async () => {
  try {
    const [resTreinos, resAlunos] = await Promise.all([
      axios.get('http://localhost:3000/treinos'),
      axios.get('http://localhost:3000/users?role=aluno')
    ])

    treinos.value = resTreinos.data
    alunos.value = resAlunos.data
  } catch (error) {
    console.error('Erro ao carregar treinos:', error)
    erro.value = 'Ocorreu um erro ao carregar os treinos cadastrados.'
  } finally {
    carregando.value = false
  }
}

const getNomeAluno = (alunoId) => {
  const aluno = alunos.value.find((aluno) => String(aluno.id) === String(alunoId))
  return aluno ? aluno.name : 'Aluno não encontrado'
}

const formatarData = (data) => {
  if (!data) return 'Sem data'

  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

const irParaCadastrar = () => router.push({ name: 'cadastrar-treino' })
const irParaEditar = (id) => router.push({ name: 'atualizar-treino', params: { id } })

onMounted(() => {
  buscarDados()
})
</script>

<template>
  <div class="instrutor-flow">
    <header class="acoes-topo">
      <h2>Gestão de Treinos</h2>
      <MyButton @click="irParaCadastrar">Novo Treino</MyButton>
    </header>

    <div v-if="carregando" class="msg-estado carregando">
      Carregando treinos...
    </div>

    <div v-else-if="erro" class="msg-estado erro">
      {{ erro }}
    </div>

    <div v-else-if="treinos.length === 0" class="msg-estado vazio">
      Nenhum treino cadastrado ainda.
    </div>

    <table v-else class="tabela-treinos">
      <thead>
        <tr>
          <th>Treino</th>
          <th>Aluno</th>
          <th>Objetivo</th>
          <th>Criado em</th>
          <th>Exercícios</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="treino in treinos" :key="treino.id">
          <td>{{ treino.nome }}</td>
          <td>{{ getNomeAluno(treino.alunoId) }}</td>
          <td>{{ treino.objetivo }}</td>
          <td>{{ formatarData(treino.dataCriacao) }}</td>
          <td>{{ treino.exercicios?.length || 0 }}</td>
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

.msg-estado {
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.carregando {
  color: #1E3A8A;
  background-color: #DBEAFE;
}

.erro {
  color: #DC2626;
  background-color: #FEF2F2;
}

.vazio {
  color: #047857;
  background-color: #ECFDF5;
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
