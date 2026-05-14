<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { API_URL } from '@/api'

const login = ref('')
const senha = ref('')
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

function destinoPadrao(role) {
  if (['admin', 'instrutor', 'recepcionista'].includes(role)) return '/funcionario'
  if (role === 'guest') return '/planos'
  return '/'
}

async function doLogin() {
  try {
    const response = await axios.get(`${API_URL}/users?login=${login.value}`)

    if (response.data.length > 0) {
      const usuario = response.data.find((item) => item.password === senha.value)

      if (usuario) {
        userStore.setUser(usuario)

        router.push(route.query.redirect || destinoPadrao(usuario.role))
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
  <main class="auth-page">
    <section class="login-container">
      <RouterLink to="/" class="auth-brand">
        <span class="brand-mark">⌁</span>
        <strong>FitBlue</strong>
      </RouterLink>

      <header>
        <h1>Bem-vindo de volta</h1>
        <p>Acesse sua conta para continuar.</p>
      </header>

      <div class="auth-tabs">
        <span class="tab active">Entrar</span>
        <RouterLink :to="{ path: '/register', query: route.query }" class="tab">Cadastrar</RouterLink>
      </div>

      <form @submit.prevent="doLogin">
        <label>
          <span>✉</span>
          <input v-model="login" type="text" placeholder="E-mail ou login" required />
        </label>

        <label>
          <span>□</span>
          <input v-model="senha" type="password" placeholder="Senha" required />
        </label>

        <button type="submit">
          Entrar
          <span>→</span>
        </button>
      </form>

      <aside class="demo-card">
        <strong>Contas de demonstração:</strong>
        <p>Admin → admin1 / 123</p>
        <p>Recepção → lorena / 1234</p>
        <p>Instrutor → pedro / 12345</p>
        <p>Aluno → leticia / 12345</p>
        <p>Visitante → lorena123 / 123</p>
      </aside>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 40px clamp(18px, 8vw, 72px);
  background: var(--app-background);
}

.login-container {
  width: min(100%, 448px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  color: var(--text-strong);
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(145deg, #2f82ff, #1757f0);
  box-shadow: var(--shadow-button);
  font-size: 24px;
}

.auth-brand strong {
  font-size: 21px;
  font-weight: 650;
}

header h1 {
  margin: 0 0 8px;
  color: var(--text-strong);
  font-size: clamp(28px, 5vw, 36px);
  line-height: 1.1;
}

header p,
.demo-card p {
  margin: 0;
  color: var(--text-soft);
}

.auth-tabs {
  display: inline-flex;
  width: fit-content;
  padding: 4px;
  border-radius: var(--radius-md);
  background: #e6f0ff;
}

.tab {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  height: 36px;
  border-radius: 10px;
  color: var(--brand);
  text-decoration: none;
  font-size: 14px;
}

.tab.active {
  color: #fff;
  background: var(--brand);
  box-shadow: var(--shadow-button);
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 48px;
  padding: 0 16px;
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  color: var(--brand);
}

label input {
  width: 100%;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 48px;
  margin-top: 2px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--brand);
  color: white;
  font-weight: 650;
  box-shadow: var(--shadow-button);
  cursor: pointer;
}

button:hover {
  background: var(--brand-hover);
}

.demo-card {
  display: grid;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-lg);
  background: var(--surface-soft);
  color: var(--brand);
  font-size: 13px;
}

@media (max-width: 600px) {
  .auth-page {
    align-items: flex-start;
    padding: 32px 16px;
  }

  .login-container {
    padding: 0;
  }
}
</style>
