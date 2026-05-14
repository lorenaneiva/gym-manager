<template>
  <main class="home page-shell">
    <section class="container">
      <header class="page-header">
        <span class="eyebrow">FitBlue Gym Manager</span>
        <h1>Escolha o plano ideal</h1>
        <p>Planos claros para começar, evoluir e manter sua rotina de treinos.</p>
      </header>

      <div v-if="carregando" class="state-card">
        Carregando planos...
      </div>

      <div v-else-if="erro" class="state-card error">
        {{ erro }}
      </div>

      <div v-else-if="planos.length === 0" class="state-card">
        Nenhum plano disponível no momento.
      </div>

      <div v-else class="planos">
        <PlanoCard
          v-for="plano in planos"
          :key="plano.id"
          :id="plano.id"
          :nome="plano.nome"
          :descricao="plano.descricao"
          :valor="plano.valor"
          :imagem="imagemPadrao"
          @assinar="assinarPlano"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PlanoCard from '@/components/PlanoCard.vue'
import { API_URL } from '@/api'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const planos = ref([])
const carregando = ref(true)
const erro = ref('')
const imagemPadrao = 'https://placehold.co/300x190?text=Plano'
const userStore = useUserStore()
const router = useRouter()

async function buscarPlanos() {
  try {
    carregando.value = true
    erro.value = ''
    const response = await axios.get(`${API_URL}/planos`)
    planos.value = response.data.filter((plano) => plano.ativo !== false)
  } catch (error) {
    console.error(error)
    erro.value = 'Não foi possível carregar os planos.'
  } finally {
    carregando.value = false
  }
}

function assinarPlano(id) {
  const redirect = `/assinar-plano/${id}`

  if (userStore.isAdmin || userStore.isRecepcionista || userStore.isInstrutor) {
    router.push('/funcionario')
    return
  }

  if (userStore.isLogged) {
    router.push(redirect)
  } else {
    router.push({
      path: '/register',
      query: { redirect }
    })
  }
}

onMounted(() => {
  buscarPlanos()
})
</script>

<style scoped>
.home {
  background: var(--app-background);
}

.container {
  max-width: 1150px;
  margin: 0 auto;
  padding: 0;
}

.page-header {
  margin-bottom: 28px;
}

.eyebrow {
  color: var(--brand);
  font-size: 13px;
  font-weight: 650;
}

h1 {
  margin: 8px 0 8px;
  font-size: clamp(30px, 5vw, 48px);
  line-height: 1.05;
  color: var(--text-strong);
}

.page-header p {
  margin: 0;
  color: var(--text-soft);
}

.planos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;
  gap: 28px;
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

@media (max-width: 600px) {
  h1 {
    text-align: left;
  }
}
</style>
