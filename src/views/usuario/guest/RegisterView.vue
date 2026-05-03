<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const nome = ref('')
const login = ref('')
const senha = ref('')
const userStore = useUserStore()
const router = useRouter()

async function doRegister() {
  if (!nome.value.trim() || !login.value.trim() || !senha.value.trim()) {
    alert('Todos os campos devem ser preenchidos')
    return
  }

  try {
    const novoUsuario = {
      name: nome.value,
      login: login.value,
      password: senha.value,
      role: 'guest',
      plano: 0
    }

    const response = await axios.post('http://localhost:3000/users', novoUsuario)

    // salva no store
    userStore.setUser(response.data)

    // redireciona direto para a rota da role escolhida
    router.push('/')

  } catch (error) {
    console.error(error)
    alert('Erro ao registrar usuário')
  }
}
</script>

<template>
  <main class="register-container">
    <h1>Cadastro</h1>
    <form @submit.prevent="doRegister">
      <input v-model="nome" type="text" placeholder="Digite seu nome" required />
      <input v-model="login" type="text" placeholder="Digite seu login" required />
      <input v-model="senha" type="password" placeholder="Digite sua senha" required />
      <button type="submit">Registrar</button>
    </form>
  </main>
</template>

<style scoped>
.register-container {
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
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
button:hover {
  background: #218838;
}
</style>
