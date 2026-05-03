<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { API_URL } from '@/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const usuario = ref(null)
const plano = ref(null)
const mensalidade = ref(null)
const treinos = ref([])
const agendamentos = ref([])
const assinatura = ref(null)

const loading = ref(true)
const erro = ref('')

const inicialUsuario = computed(() => {
  return usuario.value?.name?.charAt(0).toUpperCase() || '?'
})

const roleFormatada = computed(() => {
  const roles = {
    admin: 'Administrador',
    recepcionista: 'Recepcionista',
    instrutor: 'Instrutor',
    aluno: 'Aluno',
    guest: 'Visitante'
  }

  return roles[usuario.value?.role] || 'Não informado'
})

const statusUsuario = computed(() => {
  if (userStore.isAluno) {
    return 'Aluno ativo'
  }

  if (userStore.isGuest) {
    return 'Aguardando aprovação'
  }

  return 'Funcionário'
})

function formatarData(data) {
  if (!data) {
    return 'Não informado'
  }

  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

async function buscarPerfil() {
  try {
    loading.value = true
    erro.value = ''

    const userLogado = userStore.user

    if (!userLogado) {
      erro.value = 'Você precisa estar logado para acessar o perfil.'
      return
    }

    const responseUsuario = await axios.get(`${API_URL}/users/${userLogado.id}`)
    usuario.value = responseUsuario.data

    if (usuario.value.plano) {
      const responsePlano = await axios.get(`${API_URL}/planos/${usuario.value.plano}`)
      plano.value = responsePlano.data
    }

    if (usuario.value.role === 'aluno') {
      const responseMensalidades = await axios.get(
        `${API_URL}/mensalidades?alunoId=${usuario.value.id}`
      )

      mensalidade.value = responseMensalidades.data[0] || null

      const responseTreinos = await axios.get(
        `${API_URL}/treinos?alunoId=${usuario.value.id}`
      )

      treinos.value = responseTreinos.data

      const responseAgendamentos = await axios.get(
        `${API_URL}/agendamentos?alunoId=${usuario.value.id}`
      )

      agendamentos.value = responseAgendamentos.data
    }

    if (usuario.value.role === 'guest') {
      const responseAssinaturas = await axios.get(
        `${API_URL}/assinaturas?guestId=${usuario.value.id}`
      )

      assinatura.value = responseAssinaturas.data[0] || null
    }
  } catch (error) {
    erro.value = 'Não foi possível carregar os dados do perfil.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  buscarPerfil()
})
</script>


<template>
  <main class="perfil">
    <section class="container">
      <div v-if="loading" class="mensagem">
        Carregando perfil...
      </div>

      <div v-else-if="erro" class="mensagem erro">
        {{ erro }}
      </div>

      <div v-else-if="usuario" class="conteudo-perfil">
        <section class="cabecalho-perfil">
          <div class="avatar">
            {{ inicialUsuario }}
          </div>

          <div>
            <h1>Meu Perfil</h1>
            <p class="subtitulo">
              Informações da conta e situação na academia
            </p>
          </div>
        </section>

        <section class="grid-info">
          <div class="card destaque">
            <span class="label">Nome</span>
            <strong>{{ usuario.name }}</strong>
          </div>

          <div class="card">
            <span class="label">Login</span>
            <strong>{{ usuario.login }}</strong>
          </div>

          <div class="card">
            <span class="label">Perfil de acesso</span>
            <strong>{{ roleFormatada }}</strong>
          </div>

          <div class="card">
            <span class="label">Status</span>
            <strong>{{ statusUsuario }}</strong>
          </div>
        </section>

        <section class="secao">
          <h2>Plano</h2>

          <div v-if="plano" class="card plano-card">
            <div>
              <span class="label">Plano atual</span>
              <strong>{{ plano.nome }}</strong>
              <p>{{ plano.descricao }}</p>
            </div>

            <div class="valor">
              R$ {{ plano.valor.toFixed(2).replace('.', ',') }}
            </div>
          </div>

          <div v-else class="card vazio">
            Nenhum plano vinculado ao usuário.
          </div>
        </section>

        <section v-if="mensalidade" class="secao">
          <h2>Mensalidade</h2>

          <div class="card detalhes">
            <p>
              <strong>Status:</strong>
              {{ mensalidade.status }}
            </p>

            <p>
              <strong>Data de pagamento:</strong>
              {{ formatarData(mensalidade.dataPagamento) }}
            </p>

            <p>
              <strong>Vencimento:</strong>
              {{ formatarData(mensalidade.dataVencimento) }}
            </p>
          </div>
        </section>

        <section v-if="treinos.length" class="secao">
          <h2>Treinos</h2>

          <div class="lista">
            <div
              v-for="treino in treinos"
              :key="treino.id"
              class="card treino-card"
            >
              <h3>{{ treino.nome }}</h3>
              <p>{{ treino.objetivo }}</p>

              <ul>
                <li
                  v-for="exercicio in treino.exercicios"
                  :key="exercicio.nome"
                >
                  {{ exercicio.nome }} -
                  {{ exercicio.series }} séries de
                  {{ exercicio.repeticoes }} repetições
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section v-if="agendamentos.length" class="secao">
          <h2>Agendamentos</h2>

          <div class="lista">
            <div
              v-for="agendamento in agendamentos"
              :key="agendamento.id"
              class="card detalhes"
            >
              <p>
                <strong>Tipo:</strong>
                {{ agendamento.tipo }}
              </p>

              <p>
                <strong>Data:</strong>
                {{ formatarData(agendamento.data) }} às {{ agendamento.hora }}
              </p>

              <p>
                <strong>Status:</strong>
                {{ agendamento.status }}
              </p>

              <p v-if="agendamento.observacao">
                <strong>Observação:</strong>
                {{ agendamento.observacao }}
              </p>
            </div>
          </div>
        </section>

        <section v-if="assinatura" class="secao">
          <h2>Assinatura</h2>

          <div class="card detalhes">
            <p>
              <strong>Status:</strong>
              {{ assinatura.status }}
            </p>

            <p>
              <strong>Data da solicitação:</strong>
              {{ formatarData(assinatura.dataSolicitacao) }}
            </p>
          </div>
        </section>
      </div>

      <div v-else class="mensagem">
        Nenhum usuário logado encontrado.
      </div>
    </section>
  </main>
</template>


<style scoped>
.perfil {
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

.cabecalho-perfil {
  display: flex;
  align-items: center;
  gap: 22px;
  margin-bottom: 35px;
}

.avatar {
  width: 86px;
  height: 86px;
  border-radius: 50%;
  background: #1f1f1f;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38px;
  font-weight: 700;
}

h1 {
  font-size: 36px;
  margin-bottom: 8px;
  color: #1f1f1f;
}

.subtitulo {
  color: #666;
  font-size: 16px;
}

h2 {
  font-size: 24px;
  margin-bottom: 18px;
  color: #222;
}

.grid-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 22px;
  margin-bottom: 34px;
}

.card {
  background: #ffffff;
  border: 1px solid #e6ebe8;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.card.destaque {
  background: #f4f7f5;
}

.label {
  display: block;
  font-size: 14px;
  color: #6b6b6b;
  margin-bottom: 8px;
}

.card strong {
  font-size: 20px;
  color: #1f1f1f;
}

.secao {
  margin-top: 34px;
}

.plano-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.plano-card p {
  margin-top: 10px;
  color: #555;
}

.valor {
  font-size: 26px;
  font-weight: 700;
  color: #1f1f1f;
  white-space: nowrap;
}

.lista {
  display: grid;
  gap: 18px;
}

.treino-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #1f1f1f;
}

.treino-card p {
  color: #555;
  margin-bottom: 14px;
}

.treino-card ul {
  padding-left: 20px;
  color: #444;
}

.treino-card li {
  margin-bottom: 6px;
}

.detalhes p {
  margin-bottom: 8px;
  color: #444;
}

.detalhes p:last-child {
  margin-bottom: 0;
}

.vazio {
  color: #666;
  background: #f9faf9;
}

.mensagem {
  text-align: center;
  font-size: 18px;
  color: #333;
  padding: 40px 20px;
}

.erro {
  color: #b42318;
}

@media (max-width: 600px) {
  .perfil {
    padding: 20px 12px;
  }

  .container {
    padding: 24px 16px;
  }

  .cabecalho-perfil {
    align-items: flex-start;
    flex-direction: column;
  }

  .avatar {
    width: 74px;
    height: 74px;
    font-size: 32px;
  }

  h1 {
    font-size: 28px;
  }

  h2 {
    font-size: 20px;
  }

  .plano-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .valor {
    font-size: 22px;
  }
}
</style>
