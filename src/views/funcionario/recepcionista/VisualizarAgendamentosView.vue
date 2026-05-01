<script setup>
import { onMounted, ref, computed} from 'vue'
import { api } from '@/services/api.js'
import CadastrarAgendamento from '@/components/funcionario/recepcionista/CadastrarAgendamento.vue'

const agendamentos = ref([])
const alunos = ref([])
const editando = ref(null)

const loading = ref(false)
const error = ref(null)

const agendamentosOrdenados = computed(() => {
  return [...agendamentos.value].sort((a, b) => {
    return new Date(a.data) - new Date(b.data)
  })
})

const formatarData = (data) => {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    const [agRes, usersRes] = await Promise.all([
      api.get('/agendamentos'),
      api.get('/users')
    ])

    agendamentos.value = agRes.data

    alunos.value = usersRes.data.filter(u => u.role?.toLowerCase() === 'aluno')

    console.log('Alunos carregados com sucesso:', alunos.value.length)

  } catch (err) {
    console.error('Erro ao buscar dados:', err)
    error.value = 'Erro ao carregar dados'
  } finally {
    loading.value = false
  }
}

const getNomeAluno = (id) => {
  if (!alunos.value.length) return 'Carregando...'

  const aluno = alunos.value.find(a => String(a.id) === String(id))

  return aluno ? aluno.name : 'Aluno não encontrado'
}


const deletar = async (id) => {
  if (!confirm('Deseja excluir este agendamento?')) return

  try {
    await api.delete(`/agendamentos/${id}`)
    await fetchData()
  } catch {
    alert('Erro ao excluir')
  }
}

const iniciarEdicao = (ag) => {
  editando.value = { ...ag }
}

const salvarEdicao = async () => {
  try {
    await api.put(`/agendamentos/${editando.value.id}`, editando.value)
    editando.value = null
    await fetchData()
  } catch {
    alert('Erro ao salvar')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="view-container">
    <header class="page-header">
      <h1 class="title">Agendamentos</h1>
    </header>

    <CadastrarAgendamento @created="fetchData" />

    <div class="table-card">
      <table class="modern-table">
        <thead>
          <tr>
            <th>ALUNO</th>
            <th>TIPO</th>
            <th>DATA</th>
            <th>HORA</th>
            <th>OBSERVAÇÃO</th>
            <th>AÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in agendamentosOrdenados" :key="a.id">
            <td class="font-bold">{{ getNomeAluno(a.alunoId) }}</td>

            <!-- Coluna Tipo -->
            <td>
              <input v-if="editando?.id === a.id" v-model="editando.tipo" class="edit-input" />
              <span v-else class="badge-tipo">{{ a.tipo }}</span>
            </td>

            <!-- Coluna Data -->
            <td>
              <input v-if="editando?.id === a.id" type="date" v-model="editando.data" class="edit-input" />
              <span v-else>{{ formatarData(a.data) }}</span>
            </td>

            <!-- Coluna Hora -->
            <td>
              <input v-if="editando?.id === a.id" type="time" v-model="editando.hora" class="edit-input" />
              <span v-else>{{ a.hora }}</span>
            </td>

            <!-- Coluna Observação -->
            <td>
              <input v-if="editando?.id === a.id" v-model="editando.observacao" class="edit-input" />
              <span v-else class="obs-cell">{{ a.observacao || '-' }}</span>
            </td>

            <!-- Coluna Ações -->
            <td class="actions">
              <div v-if="editando?.id === a.id">
                <button @click="salvarEdicao" class="btn-save">Salvar</button>
                <button @click="editando = null" class="btn-cancel">Cancelar</button>
              </div>
              <div v-else>
                <button @click="iniciarEdicao(a)" class="btn-edit">Editar</button>
                <button @click="deletar(a.id)" class="btn-icon-danger">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  background-color: var(--neutral-50);
  min-height: 100vh;
  padding: 0;
}

.page-header {
  padding: 20px;
  background: white;
  border-bottom: 1px solid var(--neutral-200);
}

.title {
  color: var(--neutral-900);
  font-size: 1.5rem;
  margin: 0;
}

.table-card {
  margin: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--neutral-200);
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.modern-table th {
  background-color: var(--neutral-50);
  color: var(--neutral-600);
  padding: 15px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid var(--neutral-200);
}

.modern-table td {
  padding: 15px;
  border-bottom: 1px solid var(--neutral-100);
  color: var(--neutral-700);
  font-size: 0.9rem;
}

.font-bold {
  font-weight: 600;
  color: var(--neutral-900);
}

.badge-tipo {
  background-color: var(--primary-100);
  color: var(--primary-800);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.obs-cell {
  max-width: 250px;
  color: var(--neutral-500);
  font-style: italic;
}

.btn-icon-danger {
  color: var(--danger-600);
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-icon-danger:hover {
  color: var(--danger-800);
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-edit {
  color: var(--primary-600);
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-save {
  background-color: var(--success-100);
  color: var(--success-700);
  border: 1px solid var(--success-200);
  padding: 5px 10px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: none;
  border: none;
  color: var(--neutral-500);
  cursor: pointer;
  font-size: 0.85rem;
}

.edit-input {
  width: 100%;
  padding: 6px;
  border: 1px solid var(--primary-200);
  border-radius: 4px;
  background-color: var(--primary-50);
}
</style>
