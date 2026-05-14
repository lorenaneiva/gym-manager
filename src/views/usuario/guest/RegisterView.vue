<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { API_URL } from '@/api'

const nome = ref('')
const login = ref('')
const senha = ref('')
const carregando = ref(false)
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

async function doRegister() {
  if (!nome.value.trim() || !login.value.trim() || !senha.value.trim()) {
    alert('Todos os campos devem ser preenchidos')
    return
  }

  try {
    carregando.value = true

    const novoUsuario = {
      name: nome.value.trim(),
      login: login.value.trim(),
      password: senha.value,
      role: 'guest',
      plano: null
    }

    const response = await axios.post(`${API_URL}/users`, novoUsuario)

    userStore.setUser(response.data)
    router.push(route.query.redirect || '/planos')
  } catch (error) {
    console.error(error)
    alert('Erro ao registrar usuário')
  } finally {
    carregando.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="register-container">
      <RouterLink to="/" class="auth-brand">
        <span class="brand-mark">⌁</span>
        <strong>FitBlue</strong>
      </RouterLink>

      <header>
        <h1>Crie sua conta</h1>
        <p>Cadastre-se para escolher um plano e começar.</p>
      </header>

      <div class="auth-tabs">
        <RouterLink :to="{ path: '/login', query: route.query }" class="tab">Entrar</RouterLink>
        <span class="tab active">Cadastrar</span>
      </div>

      <form @submit.prevent="doRegister">
        <label>
          <span>○</span>
          <input v-model="nome" type="text" placeholder="Nome completo" required />
        </label>

        <label>
          <span>✉</span>
          <input v-model="login" type="text" placeholder="E-mail ou login" required />
        </label>

        <label>
          <span>□</span>
          <input v-model="senha" type="password" placeholder="Senha" required />
        </label>

        <button type="submit" :disabled="carregando">
          {{ carregando ? 'Cadastrando...' : 'Cadastrar' }}
          <span>→</span>
        </button>
      </form>
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

.register-container {
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

header p {
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

button:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

@media (max-width: 600px) {
  .auth-page {
    align-items: flex-start;
    padding: 32px 16px;
  }

  .register-container {
    padding: 0;
  }
}
</style>
