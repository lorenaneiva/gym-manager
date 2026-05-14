<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import MyButton from '@/components/utils/MyButton.vue'
import { API_URL } from '@/api'

const router = useRouter()

const usuarios = ref([])
const planos = ref([])
const treinos = ref([])
const agendamentos = ref([])
const mensalidades = ref([])
const carregando = ref(true)
const erro = ref('')

const gerenciarAdmin = (rota) => {
  router.push({ name: rota })
}

const alunosAtivos = computed(() => {
  return usuarios.value.filter((usuario) => usuario.role === 'aluno' && usuario.plano)
})

const instrutores = computed(() => usuarios.value.filter((usuario) => usuario.role === 'instrutor'))
const recepcionistas = computed(() => usuarios.value.filter((usuario) => usuario.role === 'recepcionista'))
const visitantes = computed(() => usuarios.value.filter((usuario) => usuario.role === 'guest'))
const planosAtivos = computed(() => planos.value.filter((plano) => plano.ativo !== false))
const treinosAtivos = computed(() => treinos.value.filter((treino) => treino.ativo !== false))
const agendamentosAbertos = computed(() => {
  return agendamentos.value.filter((agendamento) => agendamento.status !== 'cancelado')
})

const receitaMensal = computed(() => {
  return alunosAtivos.value.reduce((total, aluno) => {
    const planoId = aluno.planoId || aluno.plano
    const plano = planos.value.find((item) => String(item.id) === String(planoId))

    if (!plano?.valor || !plano?.duracaoDias) return total

    return total + (Number(plano.valor) / Number(plano.duracaoDias)) * 30
  }, 0)
})

const mensalidadesPendentes = computed(() => {
  return mensalidades.value.filter((mensalidade) => mensalidade.status !== 'pago')
})

const distribuicaoPlanos = computed(() => {
  return planosAtivos.value.map((plano) => ({
    ...plano,
    alunos: alunosAtivos.value.filter((aluno) => String(aluno.planoId || aluno.plano) === String(plano.id)).length
  }))
})

const coberturaTreinos = computed(() => {
  if (!alunosAtivos.value.length) return 0

  const alunosComTreino = new Set(treinosAtivos.value.map((treino) => String(treino.alunoId)))
  return Math.round((alunosComTreino.size / alunosAtivos.value.length) * 100)
})

const proximosAgendamentos = computed(() => {
  return [...agendamentosAbertos.value]
    .sort((a, b) => `${a.data} ${a.hora}`.localeCompare(`${b.data} ${b.hora}`))
    .slice(0, 4)
})

const metricas = computed(() => [
  {
    label: 'Alunos ativos',
    valor: alunosAtivos.value.length,
    detalhe: `${visitantes.value.length} visitantes pendentes`,
    indice: '01'
  },
  {
    label: 'Receita mensal estimada',
    valor: formatarMoeda(receitaMensal.value),
    detalhe: `${planosAtivos.value.length} planos ativos`,
    indice: '02',
    destaque: true
  },
  {
    label: 'Treinos publicados',
    valor: treinosAtivos.value.length,
    detalhe: `${coberturaTreinos.value}% dos alunos com ficha`,
    indice: '03'
  },
  {
    label: 'Agendamentos abertos',
    valor: agendamentosAbertos.value.length,
    detalhe: `${mensalidadesPendentes.value.length} mensalidades pendentes`,
    indice: '04'
  }
])

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}

async function buscarDados() {
  try {
    const [resUsuarios, resPlanos, resTreinos, resAgendamentos, resMensalidades] = await Promise.all([
      axios.get(`${API_URL}/users`),
      axios.get(`${API_URL}/planos`),
      axios.get(`${API_URL}/treinos`),
      axios.get(`${API_URL}/agendamentos`),
      axios.get(`${API_URL}/mensalidades`)
    ])

    usuarios.value = resUsuarios.data
    planos.value = resPlanos.data
    treinos.value = resTreinos.data
    agendamentos.value = resAgendamentos.data
    mensalidades.value = resMensalidades.data
  } catch (error) {
    console.error('Erro ao carregar dashboard administrativo:', error)
    erro.value = 'Não foi possível carregar os indicadores administrativos.'
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  buscarDados()
})
</script>

<template>
  <section class="admin-dashboard">
    <div v-if="carregando" class="state-card">
      Carregando indicadores...
    </div>

    <div v-else-if="erro" class="state-card error">
      {{ erro }}
    </div>

    <template v-else>
      <div class="metrics-grid">
        <article
          v-for="metrica in metricas"
          :key="metrica.label"
          class="metric-card"
          :class="{ featured: metrica.destaque }"
        >
          <div class="metric-top">
            <span>{{ metrica.label }}</span>
            <i>{{ metrica.indice }}</i>
          </div>
          <strong>{{ metrica.valor }}</strong>
          <small>{{ metrica.detalhe }}</small>
        </article>
      </div>

      <div class="dashboard-grid">
        <section class="panel panel-wide">
          <header>
            <h3>Distribuição por plano</h3>
            <p>Alunos ativos por assinatura</p>
          </header>

          <div class="plan-list">
            <div v-for="plano in distribuicaoPlanos" :key="plano.id" class="plan-row">
              <div>
                <strong>{{ plano.nome }}</strong>
                <span>{{ formatarMoeda(plano.valor) }} / {{ plano.duracaoDias }} dias</span>
              </div>

              <em>{{ plano.alunos }} alunos</em>
            </div>
          </div>
        </section>

        <section class="panel">
          <header>
            <h3>Equipe</h3>
            <p>Operação disponível</p>
          </header>

          <div class="team-grid">
            <div>
              <strong>{{ instrutores.length }}</strong>
              <span>Instrutores</span>
            </div>

            <div>
              <strong>{{ recepcionistas.length }}</strong>
              <span>Recepção</span>
            </div>
          </div>
        </section>

        <section class="panel panel-wide">
          <header>
            <h3>Próximos agendamentos</h3>
            <p>Aulas e avaliações abertas</p>
          </header>

          <div class="schedule-list">
            <div v-if="proximosAgendamentos.length === 0" class="empty">
              Nenhum agendamento aberto.
            </div>

            <div v-for="agendamento in proximosAgendamentos" :key="agendamento.id" class="schedule-row">
              <span>{{ agendamento.data }} às {{ agendamento.hora }}</span>
              <strong>{{ agendamento.tipo }}</strong>
              <small>{{ agendamento.status }}</small>
            </div>
          </div>
        </section>

        <section class="panel actions-panel">
          <header>
            <h3>Ações rápidas</h3>
            <p>Gestão diária</p>
          </header>

          <div class="actions-grid">
            <MyButton @click="gerenciarAdmin('alunos')">Ver alunos</MyButton>
            <MyButton @click="gerenciarAdmin('listar-treinos')">Ver treinos</MyButton>
            <MyButton @click="gerenciarAdmin('agendamentos')">Agendamentos</MyButton>
            <MyButton @click="gerenciarAdmin('cadastrar-plano')">Novo plano</MyButton>
            <MyButton @click="gerenciarAdmin('cadastrar-funcionario')">Novo funcionário</MyButton>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<style scoped>
.admin-dashboard {
  display: grid;
  gap: 24px;
  width: 100%;
}

.state-card,
.metric-card,
.panel {
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

.state-card {
  padding: 20px;
  color: var(--text-soft);
}

.state-card.error {
  color: var(--danger-700);
  background: var(--danger-50);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;
}

.metric-card {
  display: grid;
  align-content: space-between;
  min-height: 142px;
  gap: 14px;
  padding: 22px;
  overflow: hidden;
  position: relative;
}

.metric-card::after {
  content: '';
  width: 110px;
  height: 110px;
  border-radius: 999px;
  background: rgba(31, 101, 255, 0.08);
  position: absolute;
  right: -46px;
  top: -48px;
}

.metric-card.featured {
  border-color: transparent;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
  box-shadow: 0 18px 40px rgba(31, 101, 255, 0.24);
}

.metric-card.featured::after {
  background: rgba(255, 255, 255, 0.16);
}

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.metric-top i {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  border-radius: 12px;
  background: var(--surface-soft);
  color: var(--brand);
  font-size: 12px;
  font-style: normal;
  font-weight: 800;
}

.metric-card span,
.panel p,
.plan-row span,
.schedule-row small,
.team-grid span {
  color: var(--text-soft);
  font-size: 13px;
}

.metric-card strong {
  color: var(--text-strong);
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1;
  position: relative;
  z-index: 1;
}

.metric-card small {
  color: var(--text-muted);
  position: relative;
  z-index: 1;
}

.metric-card.featured span,
.metric-card.featured strong,
.metric-card.featured small,
.metric-card.featured .metric-top i {
  color: #ffffff;
}

.metric-card.featured .metric-top i {
  background: rgba(255, 255, 255, 0.18);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.55fr);
  gap: 16px;
  align-items: start;
}

.panel {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.panel-wide {
  min-width: 0;
}

.panel header {
  display: grid;
  gap: 6px;
}

.panel h3 {
  margin: 0;
  color: var(--text-strong);
  font-size: 18px;
  font-weight: 700;
}

.panel p {
  margin: 0;
}

.plan-list,
.schedule-list,
.actions-grid {
  display: grid;
  gap: 12px;
}

.plan-row,
.schedule-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px;
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  border: 1px solid rgba(213, 230, 255, 0.72);
}

.plan-row div,
.schedule-row {
  min-width: 0;
}

.plan-row strong,
.schedule-row strong {
  display: block;
  color: var(--text-strong);
  font-weight: 700;
}

.plan-row em {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 8px 12px;
  border-radius: 999px;
  background: #ffffff;
  color: var(--brand);
  font-style: normal;
  font-weight: 700;
  white-space: nowrap;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.team-grid div {
  display: grid;
  gap: 6px;
  padding: 18px;
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  border: 1px solid rgba(213, 230, 255, 0.72);
}

.team-grid strong {
  color: var(--brand);
  font-size: 32px;
  line-height: 1;
}

.schedule-row {
  display: grid;
  grid-template-columns: 130px 1fr auto;
  min-height: 58px;
}

.schedule-row span {
  color: var(--text-soft);
  font-size: 13px;
  white-space: nowrap;
}

.empty {
  padding: 16px;
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  color: var(--text-muted);
}

.actions-grid {
  align-items: start;
}

.actions-grid :deep(.button),
.actions-grid :deep(button),
.actions-grid :deep(a) {
  width: 100%;
  justify-content: flex-start;
}

@media (max-width: 1050px) {
  .metrics-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .metrics-grid,
  .dashboard-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .plan-row,
  .schedule-row {
    align-items: flex-start;
    grid-template-columns: 1fr;
    flex-direction: column;
  }
}
</style>
