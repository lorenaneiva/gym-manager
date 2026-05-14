<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { API_URL } from '../../../api'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

//  proteção de acesso
if (!userStore.isAdmin) {
  router.push('/')
}

const form = ref({
  login: '',
  name: '',
  password: '',
  role: 'recepcionista'
})

const loading = ref(false)

async function cadastrarFuncionario() {
  // validação simples
  if (!form.value.login || !form.value.name || !form.value.password) {
    alert('Preencha todos os campos!')
    return
  }

  try {
    loading.value = true

    await axios.post(`${API_URL}/users`, {
      ...form.value,
      plano: 0
    })

    alert('Funcionário cadastrado com sucesso!')

    form.value = {
      login: '',
      name: '',
      password: '',
      role: 'recepcionista'
    }

  } catch (error) {
    console.error(error)
    alert('Erro ao cadastrar funcionário')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <h1>Cadastrar Funcionário</h1>

      <form @submit.prevent="cadastrarFuncionario">

        <div class="input-group">
          <label>Login</label>
          <input v-model="form.login" placeholder="Digite o login" />
        </div>

        <div class="input-group">
          <label>Nome</label>
          <input v-model="form.name" placeholder="Nome completo" />
        </div>

        <div class="input-group">
          <label>Senha</label>
          <input v-model="form.password" type="password" placeholder="Senha" />
        </div>

        <div class="input-group">
          <label>Função</label>
          <select v-model="form.role">
            <option value="admin">Admin</option>
            <option value="recepcionista">Recepcionista</option>
            <option value="instrutor">Instrutor</option>
          </select>
        </div>

        <button :disabled="loading">
          {{ loading ? 'Cadastrando...' : 'Cadastrar Funcionário' }}
        </button>

      </form>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f1f5f9;
  padding: 24px;
}

.card {
  max-width: 600px;
  background: #ffffff;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

h1 {
  font-size: 22px;
  margin-bottom: 4px;
  color: #1e293b;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  margin-bottom: 4px;
  color: #334155;
}

input, select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  background: #f8fafc;
}

input::placeholder {
  color: #94a3b8;
}

input:focus, select:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
}

button {
  margin-top: 10px;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  font-weight: 500;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .card {
    padding: 16px;
  }
}
</style>
