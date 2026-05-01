<template>
  <main class="home">
    <section class="container">
      <h1>Bem-vindo à Academia</h1>

      <h2>Planos:</h2>

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
  min-height: 100vh;
  background: #f4f7f5;
  padding: 40px 20px;
}

.container {
  max-width: 1150px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 22px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}

h1 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 35px;
  color: #1f1f1f;
}

h2 {
  font-size: 24px;
  margin-bottom: 24px;
  color: #222;
}

.planos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;
  gap: 28px;
}

@media (max-width: 600px) {
  .home {
    padding: 20px 12px;
  }

  .container {
    padding: 24px 16px;
  }

  h1 {
    font-size: 28px;
    text-align: left;
  }

  h2 {
    font-size: 20px;
  }
}
</style>
>>>>>>> Stashed changes
