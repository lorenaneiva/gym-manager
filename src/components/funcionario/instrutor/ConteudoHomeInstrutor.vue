<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import MyButton from '@/components/utils/MyButton.vue'
import { API_URL } from '@/api'

const router = useRouter()
const treinos = ref([])
const alunos = ref([])
const carregando = ref(true)
const erro = ref('')

const buscarDados = async () => {
  try {
    const [resTreinos, resAlunos] = await Promise.all([
      axios.get(`${API_URL}/treinos`),
      axios.get(`${API_URL}/users?role=aluno`)
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
      <MyButton @click="irParaCadastrar" class="btn-novo">
        Novo Treino
      </MyButton>
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

    <div v-else class="treinos-wrapper">
      <table class="tabela-treinos">
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
          <td data-label="Treino">{{ treino.nome }}</td>
          <td data-label="Aluno">{{ getNomeAluno(treino.alunoId) }}</td>
          <td data-label="Objetivo">{{ treino.objetivo }}</td>
          <td data-label="Criado em">{{ formatarData(treino.dataCriacao) }}</td>
          <td data-label="Exercícios">{{ treino.exercicios?.length || 0 }}</td>
          <td data-label="Ações">
            <MyButton @click="irParaEditar(treino.id)" class="btn-pelo-tamanho">
              Editar
            </MyButton>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.instrutor-flow {
  width: 100%;
  box-sizing: border-box;
}

.acoes-topo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.acoes-topo h2 {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.2;
}

.btn-novo {
  white-space: nowrap;
}

.msg-estado {
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-sizing: border-box;
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

.treinos-wrapper {
  width: 100%;
  overflow-x: auto;
}

.tabela-treinos {
  width: 100%;
  min-width: 760px;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

th,
td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
}

th {
  font-size: 0.85rem;
  font-weight: 700;
  color: #374151;
  background-color: #f9fafb;
}

td {
  font-size: 0.9rem;
  color: #111827;
}

.btn-pelo-tamanho {
  padding: 5px 10px;
  font-size: 14px;
  white-space: nowrap;
}

/* Tablet */
@media (max-width: 900px) {
  .acoes-topo {
    align-items: flex-start;
  }

  .acoes-topo h2 {
    font-size: 1.35rem;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .instrutor-flow {
    padding: 20px;
  }

  .acoes-topo {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 16px;
  }

  .acoes-topo h2 {
    font-size: 1.25rem;
  }

  .btn-novo {
    width: 100%;
  }

  .msg-estado {
    padding: 14px;
    font-size: 13px;
  }

  .treinos-wrapper {
    overflow-x: visible;
  }

  .tabela-treinos {
    min-width: 0;
    width: 100%;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
  }

  .tabela-treinos thead {
    display: none;
  }

  .tabela-treinos,
  .tabela-treinos tbody,
  .tabela-treinos tr,
  .tabela-treinos td {
    display: block;
    width: 100%;
  }

  .tabela-treinos tr {
    background: white;
    border-radius: 12px;
    margin-bottom: 14px;
    padding: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
    box-sizing: border-box;
  }

  .tabela-treinos td {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid #f1f1f1;
    font-size: 0.9rem;
    text-align: right;
    word-break: break-word;
  }

  .tabela-treinos td:last-child {
    border-bottom: none;
    padding-top: 12px;
  }

  .tabela-treinos td::before {
    content: attr(data-label);
    flex-shrink: 0;
    font-weight: 700;
    color: #374151;
    text-align: left;
  }

  .btn-pelo-tamanho {
    width: 100%;
    padding: 10px 12px;
    font-size: 14px;
  }
}

/* Mobile bem estreito */
@media (max-width: 360px) {
  .acoes-topo h2 {
    font-size: 1.15rem;
  }

  .tabela-treinos tr {
    padding: 10px;
  }

  .tabela-treinos td {
    font-size: 0.82rem;
    gap: 8px;
  }
}
</style>
