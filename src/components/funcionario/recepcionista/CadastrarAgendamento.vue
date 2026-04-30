<script setup>
import { ref, onMounted } from 'vue'
import { api } from '@/services/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const emit = defineEmits(['created'])

const alunos = ref([])
const loading = ref(false)

const form = ref({
  alunoId: '',
  funcionarioId: '',
  tipo: '',
  data: '',
  hora: '',
  status: 'agendado',
  observacao: ''
})

const fetchAlunos = async () => {
  try {
    // O json-server permite filtrar direto na URL
    const res = await api.get('/users?role=aluno')
    alunos.value = res.data
  } catch {
    alert('Erro ao carregar alunos')
  }
}
onMounted(fetchAlunos)

const submit = async () => {
  try {
    loading.value = true

    form.value.funcionarioId = userStore.user.id

    await api.post('/agendamentos', form.value)

    form.value = {
      alunoId: '',
      funcionarioId: '',
      tipo: '',
      data: '',
      hora: '',
      status: 'agendado',
      observacao: ''
    }

    emit('created')

  } catch {
    alert('Erro ao criar agendamento')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="form">
    <select v-model="form.alunoId" required>
      <option disabled value="">Selecione o aluno</option>
      <option v-for="a in alunos" :key="a.id" :value="a.id">
        {{ a.name }}
      </option>
    </select>

    <input v-model="form.tipo" placeholder="Tipo" required />
    <input type="date" v-model="form.data" required />
    <input type="time" v-model="form.hora" required />

    <textarea v-model="form.observacao" placeholder="Observação"></textarea>

    <button type="submit" :disabled="loading">
      {{ loading ? 'Salvando...' : 'Agendar' }}
    </button>
  </form>
</template>
