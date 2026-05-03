<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { API_URL } from '@/api'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const nome = ref('')
const login = ref('')
const senha = ref('')
const plano = ref('')

const planos = ref([])

async function buscarPlanos() {
  try {
    const response = await axios.get(`${API_URL}/planos`)
    planos.value = response.data
  } catch (error) {
    console.error(error)
    alert('Erro ao carregar planos')
  }
}

async function buscarAluno() {
  const id = route.params.id

  if (!id) {
    return
  }

  try {
    const response = await axios.get(`${API_URL}/users/${id}`)
    const aluno = response.data

    nome.value = aluno.name
    login.value = aluno.login
    senha.value = aluno.password
    plano.value = aluno.plano
  } catch (error) {
    console.error(error)
    alert('Erro ao carregar aluno')
  }
}

onMounted(async () => {
  if (!(userStore.isAdmin || userStore.isRecepcionista)) {
    alert('Acesso negado: apenas admin e recepcionista podem cadastrar alunos.')
    router.push('/funcionario')
    return
  }

  await buscarPlanos()
  await buscarAluno()
})

async function salvarAluno() {
  if (!nome.value.trim() || !login.value.trim() || !senha.value.trim() || !plano.value) {
    alert('Todos os campos devem ser preenchidos')
    return
  }

  try {
    const aluno = {
      name: nome.value,
      login: login.value,
      password: senha.value,
      role: 'aluno',
      plano: Number(plano.value)
    }

    if (route.params.id) {
      await axios.put(`${API_URL}/users/${route.params.id}`, aluno)
    } else {
      await axios.post(`${API_URL}/users`, aluno)
    }

    router.push('/funcionario')
  } catch (error) {
    console.error(error)
    alert('Erro ao salvar aluno')
  }
}
</script>

<template>
  <main class="cadastro-aluno-container">
    <h1>Cadastro de Aluno</h1>

    <form @submit.prevent="salvarAluno">
      <input
        v-model="nome"
        type="text"
        placeholder="Nome do aluno"
        required
      />

      <input
        v-model="login"
        type="text"
        placeholder="Login"
        required
      />

      <input
        v-model="senha"
        type="password"
        placeholder="Senha"
        required
      />

      <select v-model="plano" required>
        <option value="" disabled>
          Selecione um plano
        </option>

        <option
          v-for="item in planos"
          :key="item.id"
          :value="item.id"
        >
          {{ item.nome }} - R$ {{ Number(item.valor).toFixed(2).replace('.', ',') }}
        </option>
      </select>

      <button type="submit">
        Salvar
      </button>
    </form>
  </main>
</template>

<style scoped>
.cadastro-aluno-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

form {
  display: flex;
  flex-direction: column;
}

input,
select,
button {
  margin: 8px 0;
  padding: 10px;
}

select {
  background: white;
  border: 1px solid #999;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

@media (max-width: 600px) {
  .cadastro-aluno-container {
    padding: 10px;
  }

  input,
  select,
  button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
