<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { API_URL } from '@/api'
import { useUserStore } from '@/stores/user'

const planos = ref([])
const carregando = ref(true)
const erro = ref('')
const router = useRouter()
const userStore = useUserStore()

const planosAtivos = computed(() => planos.value.filter((plano) => plano.ativo !== false))

function formatarValor(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

async function buscarPlanos() {
  try {
    const response = await axios.get(`${API_URL}/planos`)
    planos.value = response.data
  } catch (error) {
    console.error(error)
    erro.value = 'Não foi possível carregar os planos.'
  } finally {
    carregando.value = false
  }
}

function selecionarPlano(id) {
  const redirect = `/assinar-plano/${id}`

  if (userStore.isAdmin || userStore.isRecepcionista || userStore.isInstrutor) {
    router.push('/funcionario')
    return
  }

  if (userStore.isLogged) {
    router.push(redirect)
    return
  }

  router.push({
    path: '/register',
    query: { redirect }
  })
}

onMounted(() => {
  buscarPlanos()
})
</script>

<template>
  <main class="escolher-plano-container page-shell">
    <header class="page-header">
      <h1>Planos</h1>
      <p>Escolha o plano ideal</p>
    </header>

    <div v-if="carregando" class="state-card">
      Carregando planos...
    </div>

    <div v-else-if="erro" class="state-card error">
      {{ erro }}
    </div>

    <div v-else-if="planosAtivos.length === 0" class="state-card">
      Nenhum plano disponível no momento.
    </div>

    <div v-else class="planos-grid">
      <div
        v-for="(plan, index) in planosAtivos"
        :key="plan.id"
        class="plano-card"
        :class="{ destaque: index === 1 }"
      >
        <span v-if="index === 1" class="popular">Mais popular</span>

        <h2>{{ plan.nome }}</h2>

        <p>{{ plan.descricao }}</p>

        <p class="price">{{ formatarValor(plan.valor) }}</p>

        <p class="duracao">{{ plan.duracaoDias }} dias de acesso</p>

        <button type="button" class="btn-assinar" @click="selecionarPlano(plan.id)">
          Selecionar plano
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.escolher-plano-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

h1 {
  color: var(--text-strong);
  margin: 0 0 6px;
  font-size: 28px;
  font-weight: 500;
}

.page-header p {
  color: var(--text-soft);
  margin: 0;
}

.state-card {
  padding: 20px;
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-lg);
  background: var(--surface);
  color: var(--text-soft);
}

.state-card.error {
  color: var(--danger-700);
  background: var(--danger-50);
}

.planos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.plano-card {
  position: relative;
  min-height: 420px;
  display: flex;
  flex-direction: column;
  text-align: left;
  background-color: var(--card-background, #fff);
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.plano-card.destaque {
  color: #fff;
  background: linear-gradient(150deg, var(--brand), var(--brand-dark));
  box-shadow: 0 28px 52px rgba(31, 101, 255, 0.2);
}

.plano-card:hover {
  transform: translateY(-4px);
}

.plano-card h2 {
  color: inherit;
  margin: 0 0 8px;
  font-weight: 500;
}

.plano-card .price {
  font-size: clamp(34px, 5vw, 44px);
  font-weight: 750;
  color: var(--text-strong);
  margin: 24px 0 8px;
}

.plano-card.destaque .price,
.plano-card.destaque p {
  color: #fff;
}

.plano-card p {
  color: var(--text-soft);
  margin: 0;
  line-height: 1.5;
}

.duracao {
  font-size: 13px;
}

.btn-assinar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  min-height: 48px;
  padding: 0.75rem 1.5rem;
  border: 0;
  background-color: var(--button-primary-bg);
  color: var(--button-primary-text);
  border-radius: var(--radius-md);
  font-weight: 650;
  box-shadow: var(--shadow-button);
  transition: background-color 0.2s;
  cursor: pointer;
}

.btn-assinar:hover {
  background-color: var(--button-primary-hover);
}

.destaque .btn-assinar {
  background: #fff;
  color: var(--brand);
  box-shadow: none;
}

.popular {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  padding: 7px 18px;
  border-radius: 999px;
  color: var(--brand-dark);
  background: #93c5fd;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

@media (min-width: 768px) {
  .planos-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 767px) {
  .planos-grid {
    grid-template-columns: 1fr;
  }
}
</style>
