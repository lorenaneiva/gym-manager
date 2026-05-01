<template>
  <div class="home">
    <h1>Planos disponíveis</h1>

    <div class="planos">
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
  </div>
</template>

<script setup>
<<<<<<< Updated upstream
import { useUserStore } from '@/stores/user'
import ConteudoInstrutor from '@/components/funcionario/instrutor/ConteudoHomeInstrutor.vue'
import ConteudoAdm from '@/components/funcionario/admin/ConteudoHomeAdmin.vue'
import ConteudoRecep from '@/components/funcionario/recepcionista/ConteudoHomeRecepcionista.vue'

const userStore = useUserStore()
</script>

<template>
  <div class="home-wrapper">
    <header class="header-sessao">
      <h1>Painel do Funcionário</h1>
      <p>Sua role: <strong>{{ userStore.user?.role }}</strong></p>
    </header>

    <main class="conteudo-principal">
      <ConteudoAdm v-if="userStore.isAdmin" />
      <ConteudoRecep v-else-if="userStore.isRecepcionista" />
      <ConteudoInstrutor v-else-if="userStore.isInstrutor" />

      <div v-else class="alerta">
        Aguardando definição de cargo...
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-wrapper { padding: 20px; }
.header-sessao { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
.conteudo-principal { min-height: 60vh; }
</style>
=======
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PlanoCard from '@/components/PlanoCard.vue'
import { API_URL } from '../../api'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const planos = ref([])
const imagemPadrao = 'https://via.placeholder.com/300'
const userStore = useUserStore()
const router = useRouter()

async function buscarPlanos() {
  const response = await axios.get(`${API_URL}/planos`)
  planos.value = response.data
}

function assinarPlano(id) {
  if (userStore.isLogged) {
    router.push(`/pagamento/${id}`)
  } else {
    router.push('/registro')
  }
}

onMounted(() => {
  buscarPlanos()
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.planos {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
>>>>>>> Stashed changes
