<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// Campos do formulário
const nome = ref('')
const login = ref('')
const senha = ref('')
const plano = ref('')

// Restrição de acesso
onMounted(() => {
  if (!(userStore.isAdmin || userStore.isRecepcionista)) {
    alert('Acesso negado: apenas admin e recepcionista podem cadastrar alunos.')
    router.push('/funcionario')
  }
})

// Se houver ID na rota, buscar aluno existente
onMounted(async () => {
  const id = route.params.id
  if (id) {
    try {
      const response = await axios.get(`http://localhost:3000/users/${id}`)
      const aluno = response.data
      nome.value = aluno.name
      login.value = aluno.login
      senha.value = aluno.password
      // plano será preenchido manualmente
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar aluno')
    }
  }
})

async function salvarAluno() {
  if (!nome.value.trim() || !login.value.trim() || !senha.value.trim() || !plano.value.trim()) {
    alert('Todos os campos devem ser preenchidos')
    return
  }

  try {
    const aluno = {
      name: nome.value,
      login: login.value,
      password: senha.value,
      role: 'aluno',
      plano: plano.value
    }

    if (route.params.id) {
      // Atualizar aluno existente
      await axios.put(`http://localhost:3000/users/${route.params.id}`, aluno)
    } else {
      // Cadastrar novo aluno
      await axios.post('http://localhost:3000/users', aluno)
    }

    // Redireciona para rota de funcionário
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
      <input v-model="nome" type="text" placeholder="Nome do aluno" required />
      <input v-model="login" type="text" placeholder="Login" required />
      <input v-model="senha" type="password" placeholder="Senha" required />
      <input v-model="plano" type="text" placeholder="Plano contratado" required />

      <button type="submit">Salvar</button>
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
input, button {
  margin: 8px 0;
  padding: 10px;
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
  input, button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>
