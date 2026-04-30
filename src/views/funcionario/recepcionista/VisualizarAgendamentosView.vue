<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/services/api.js'
import CadastrarAgendamento from '@/components/funcionario/recepcionista/CadastrarAgendamento.vue'

const agendamentos = ref([])
const alunos = ref([])
const editando = ref(null)

const loading = ref(false)
const error = ref(null)

const fetchData = async () => {
  try {
    loading.value = true
    error.value = null

    const [agRes, usersRes] = await Promise.all([
      api.get('/agendamentos'),
      api.get('/users')
    ])

    agendamentos.value = agRes.data
    alunos.value = usersRes.data.filter(u => u.role === 'aluno')

  } catch (error) {
    error.value = 'Erro ao carregar dados'
  } finally {
    loading.value = false
  }
}

const getNomeAluno = (id) => {
  const aluno = alunos.value.find(a => a.id == id)
  return aluno ? aluno.name : 'Desconhecido'
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
  <div class="container">
    <h1>Agendamentos</h1>

    <CadastrarAgendamento @created="fetchData" />

    <p v-if="loading">Carregando...</p>
    <p v-if="error">{{ error }}</p>

    <div class="table-container" v-if="!loading && !error">
      <table>
        <thead>
          <tr>
            <th>Aluno</th>
            <th>Tipo</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="a in agendamentos" :key="a.id">
            <td>{{ getNomeAluno(a.alunoId) }}</td>

            <td>
              <input v-if="editando?.id === a.id" v-model="editando.tipo" />
              <span v-else>{{ a.tipo }}</span>
            </td>

            <td>
              <input v-if="editando?.id === a.id" type="date" v-model="editando.data" />
              <span v-else>{{ a.data }}</span>
            </td>

            <td>
              <input v-if="editando?.id === a.id" type="time" v-model="editando.hora" />
              <span v-else>{{ a.hora }}</span>
            </td>

            <td>
              <button v-if="editando?.id !== a.id" @click="iniciarEdicao(a)">
                Editar
              </button>

              <button v-if="editando?.id === a.id" @click="salvarEdicao">
                Salvar
              </button>

              <button @click="deletar(a.id)">
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

</style>
