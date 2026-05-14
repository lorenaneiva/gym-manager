<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { API_URL } from '../../../api'

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
    const res = await axios.get(`${API_URL}/users`)
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

    await axios.post(`${API_URL}/agendamentos`, agendamentoParaEnviar)


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
        <select v-model="form.alunoId" required class="custom-input aluno-field">
          <option disabled value="">Selecione o aluno</option>
          <option v-for="a in alunos" :key="a.id" :value="a.id">
            {{ a.name }}
          </option>
        </select>

        <input
          v-model="form.tipo"
          placeholder="Tipo"
          required
          class="custom-input tipo-field"
        />

        <input
          type="date"
          v-model="form.data"
          required
          class="custom-input date-field"
        />

        <input
          type="time"
          v-model="form.hora"
          required
          class="custom-input time-field"
        />

        <input
          v-model="form.observacao"
          placeholder="Obs."
          class="custom-input obs-field"
        />
      </div>

      <button type="submit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Salvando...' : 'Cadastrar agendamento' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.form-container {
  width: 100%;
  background-color: var(--neutral-50);
  padding: 20px;
  border-bottom: 1px solid var(--neutral-200);
  margin-bottom: 20px;
  box-sizing: border-box;
}

.agendamento-form {
  width: 100%;
  display: flex;
  align-items: stretch;
  gap: 15px;
}

.fields-group {
  flex: 1;
  display: grid;
  grid-template-columns: 1.4fr 1fr 0.9fr 0.8fr 1.2fr;
  gap: 10px;
}

.custom-input {
  width: 100%;
  min-width: 0;
  padding: 11px 14px;
  border: 1px solid var(--neutral-300);
  border-radius: 8px;
  background-color: var(--input-background);
  color: var(--neutral-900);
  font-size: 0.9rem;
  box-sizing: border-box;
}

.custom-input:focus {
  outline: none;
  border-color: var(--primary-600);
  box-shadow: 0 0 0 2px var(--primary-100);
}

.btn-primary {
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
  padding: 11px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  white-space: nowrap;
  text-transform: uppercase;
}

.btn-primary:hover {
  background-color: var(--button-primary-hover);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background-color: var(--neutral-400);
  cursor: not-allowed;
  transform: none;
}

/* Tablet */
@media (max-width: 1024px) {
  .agendamento-form {
    flex-direction: column;
  }

  .fields-group {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .aluno-field,
  .obs-field {
    grid-column: span 2;
  }

  .btn-primary {
    width: 100%;
  }
}

/* Mobile */
@media (max-width: 600px) {
  .form-container {
    padding: 14px;
    margin-bottom: 16px;
  }

  .agendamento-form {
    gap: 12px;
  }

  .fields-group {
    grid-template-columns: 1fr;
    gap: 9px;
  }

  .aluno-field,
  .obs-field {
    grid-column: auto;
  }

  .custom-input {
    min-height: 44px;
    font-size: 0.95rem;
    padding: 12px 14px;
  }

  .btn-primary {
    width: 100%;
    min-height: 46px;
    font-size: 0.85rem;
    padding: 12px 14px;
  }
}

/* Mobile bem estreito */
@media (max-width: 360px) {
  .form-container {
    padding: 12px;
  }

  .custom-input,
  .btn-primary {
    font-size: 0.82rem;
  }
}
</style>
