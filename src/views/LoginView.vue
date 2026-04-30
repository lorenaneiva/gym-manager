<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const login = ref('')
const senha = ref('')
const userStore = useUserStore()
const router = useRouter()

async function doLogin() {
  try {
    // busca só pelo login
    const response = await axios.get(`http://localhost:3000/users?login=${login.value}`)

    if (response.data.length > 0) {
      const usuario = response.data[0]

      // compara senha manualmente
      if (usuario.password === senha.value) {
        userStore.setUser(usuario)

        // redireciona conforme role
        switch (usuario.role) {
          case 'aluno':
            router.push('/aluno')
            break
          case 'admin':
          case 'instrutor':
          case 'recepcionista':
            router.push('/funcionario')
            break
          case 'guest':
            router.push('/')
            break
          default:
            alert('Role não reconhecida')
        }
      } else {
        alert('Senha inválida')
      }
    } else {
      alert('Login não encontrado')
    }
  } catch (error) {
    console.error(error)
    alert('Erro ao conectar com o servidor')
  }
}

</script>

<template>
  <main class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="doLogin">
      <input v-model="login" type="text" placeholder="Digite seu login" required />
      <input v-model="senha" type="password" placeholder="Digite sua senha" required />
      <button type="submit">Entrar</button>
    </form>
    <p class="register-link">
      Não tem login? <a href="/cadastro">Cadastre-se aqui</a>
    </p>
  </main>
</template>

<style scoped>
.login-container {
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
.register-link {
  margin-top: 15px;
  text-align: center;
}
@media (max-width: 600px) {
  .login-container {
    width: 90%;
  }
}
</style>
