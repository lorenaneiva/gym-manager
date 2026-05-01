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
    const res = await api.get('/users')
    // Filtra aqui também!
    alunos.value = res.data.filter(u => u.role === 'aluno')
  } catch {
    alert('Erro ao carregar alunos')
  }
}
onMounted(fetchAlunos)

const submit = async () => {
  try {
    loading.value = true

    const agendamentoParaEnviar = {
      ...form.value,
      alunoId: String(form.value.alunoId),
      funcionarioId: String(userStore.user.id),
      dataCriacao: new Date().toISOString().split('T')[0]
    }

    await api.post('/agendamentos', agendamentoParaEnviar)


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
    alert('Agendamento realizado com sucesso!')

  } catch (error) {
    console.error('Erro detalhado:', error)
    alert('Erro ao criar agendamento. Verifique se o banco está rodando.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-container">
    <form @submit.prevent="submit" class="agendamento-form">
      <div class="fields-group">
        <select v-model="form.alunoId" required class="custom-input">
          <option disabled value="">Selecione o aluno</option>
          <option v-for="a in alunos" :key="a.id" :value="a.id">{{ a.name }}</option>
        </select>

        <input v-model="form.tipo" placeholder="Tipo" required class="custom-input" />
        <input type="date" v-model="form.data" required class="custom-input" />
        <input type="time" v-model="form.hora" required class="custom-input" />

        <!-- Campo de Observação adicionado ao fluxo horizontal -->
        <input v-model="form.observacao" placeholder="Obs." class="custom-input" />
      </div>

      <button type="submit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Salvando...' : 'CADASTRAR AGENDAMENTO' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  background-color: var(--neutral-50);
  padding: 20px;
  border-bottom: 1px solid var(--neutral-200);
  margin-bottom: 20px;
}

.agendamento-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap; /* Para telas menores */
}

.fields-group {
  display: flex;
  gap: 10px;
  flex-grow: 1;
}

.custom-input {
  padding: 10px 15px;
  border: 1px solid var(--neutral-300);
  border-radius: 8px; /* Bordas arredondadas como no desenho */
  background-color: var(--input-background);
  color: var(--neutral-900);
  font-size: 0.9rem;
  flex: 1;
  min-width: 120px;
}

.custom-input:focus {
  outline: none;
  border-color: var(--primary-600);
  box-shadow: 0 0 0 2px var(--primary-100);
}

.btn-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-primary:hover {
  background-color: var(--button-primary-hover);
}

.btn-primary:disabled {
  background-color: var(--neutral-400);
}
</style>
