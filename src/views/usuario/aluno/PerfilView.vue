<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { API_URL } from '@/api'
import { useUserStore } from '@/stores/user'
import { RouterLink } from 'vue-router'

const userStore = useUserStore()

const usuario = ref(null)
const plano = ref(null)
const mensalidade = ref(null)
const treinos = ref([])
const agendamentos = ref([])
const assinatura = ref(null)
const instrutor = ref(null)

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

const roleClass = computed(() => {
  return `role-${usuario.value?.role || 'guest'}`
})

const statusUsuario = computed(() => {
  if (usuario.value?.role === 'aluno') {
    return 'Aluno ativo'
  }

  if (usuario.value?.role === 'guest') {
    return 'Aguardando aprovação'
  }

  return 'Funcionário'
})

const planoIdUsuario = computed(() => {
  return usuario.value?.planoId || usuario.value?.plano || null
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
    userStore.setUser(responseUsuario.data)

    if (planoIdUsuario.value) {
      const responsePlanos = await axios.get(`${API_URL}/planos`)
      plano.value = responsePlanos.data.find(
        (item) => String(item.id) === String(planoIdUsuario.value)
      ) || null
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

      const instrutorId = treinos.value.find((treino) => treino.instrutorId)?.instrutorId

      if (instrutorId) {
        try {
          const responseInstrutor = await axios.get(`${API_URL}/users/${instrutorId}`)
          instrutor.value = responseInstrutor.data
        } catch {
          instrutor.value = null
        }
      }

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
  } catch {
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
        <section class="cabecalho-perfil" :class="roleClass">
          <div class="avatar-area">
            <div class="avatar">
              {{ inicialUsuario }}
            </div>

            <span class="role-badge">
              {{ roleFormatada }}
            </span>
          </div>

          <div class="profile-copy">
            <span class="eyebrow">Sessão atual</span>
            <h1>{{ usuario.name }}</h1>
            <p class="subtitulo">
              {{ statusUsuario }} usando o acesso {{ usuario.login }}
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

            <RouterLink v-if="usuario.role === 'aluno'" to="/planos" class="link-plano">
              Atualizar plano
            </RouterLink>
          </div>

          <div v-else class="card vazio">
            Nenhum plano vinculado ao usuário.
          </div>
        </section>

        <section v-if="usuario.role === 'aluno'" class="secao">
          <h2>Instrutor designado</h2>

          <div v-if="instrutor" class="card detalhes">
            <p>
              <strong>{{ instrutor.name }}</strong>
            </p>

            <p>
              Login: {{ instrutor.login }}
            </p>
          </div>

          <div v-else class="card vazio">
            Nenhum instrutor designado ainda.
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
  background: var(--app-background);
  padding: 32px clamp(16px, 4vw, 48px);
}

.container {
  max-width: 1150px;
  margin: 0 auto;
}

.cabecalho-perfil {
  position: relative;
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 172px;
  margin-bottom: 24px;
  padding: 32px;
  overflow: hidden;
  border-radius: var(--radius-xl);
  color: #fff;
  background: linear-gradient(135deg, var(--brand), var(--brand-dark));
  box-shadow: 0 24px 48px rgba(31, 101, 255, 0.2);
}

.cabecalho-perfil::after {
  content: "";
  position: absolute;
  inset: auto -60px -90px auto;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
}

.cabecalho-perfil.role-admin {
  background: linear-gradient(135deg, #1f65ff, #172554);
}

.cabecalho-perfil.role-instrutor {
  background: linear-gradient(135deg, #0ea5e9, #1d4ed8);
}

.cabecalho-perfil.role-recepcionista {
  background: linear-gradient(135deg, #2563eb, #0f766e);
}

.cabecalho-perfil.role-aluno {
  background: linear-gradient(135deg, #2f82ff, #1e40af);
}

.avatar-area,
.profile-copy {
  position: relative;
  z-index: 1;
}

.avatar-area {
  display: grid;
  justify-items: center;
  gap: 10px;
}

.avatar {
  width: 96px;
  height: 96px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.16);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 700;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.role-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.eyebrow {
  display: block;
  margin-bottom: 8px;
  color: #bfdbfe;
  font-size: 13px;
  font-weight: 700;
}

h1 {
  font-size: clamp(30px, 5vw, 44px);
  margin: 0 0 8px;
  color: #fff;
}

.subtitulo {
  max-width: 560px;
  margin: 0;
  color: #dbeafe;
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
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-lg);
  padding: 22px;
  box-shadow: var(--shadow-soft);
}

.card.destaque {
  background: var(--surface-soft);
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

.link-plano {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 16px;
  border-radius: var(--radius-md);
  background: var(--brand);
  color: #fff;
  text-decoration: none;
  font-weight: 700;
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
    padding: 24px;
  }

  .avatar {
    width: 78px;
    height: 78px;
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
