<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'

import { API_URL } from '../../../api'
import CadastrarAgendamento from '@/components/funcionario/recepcionista/CadastrarAgendamento.vue'

const agendamentos = ref([])
const alunos = ref([])
const editando = ref(null)
const loading = ref(false)
const filtroNome = ref('')
const salvandoId = ref(null)
const feedback = ref({ message: '', type: '' })

const showFeedback = (msg, type = 'success') => {
  feedback.value = { message: msg, type }
  setTimeout(() => { feedback.value = { message: '', type: '' } }, 3000)
}

const fetchData = async () => {
  try {
    loading.value = true
    const [agRes, usersRes] = await Promise.all([
      axios.get(`${API_URL}/agendamentos`),
      axios.get(`${API_URL}/users`)
    ])
    agendamentos.value = agRes.data
    alunos.value = usersRes.data.filter(u => u.role?.toLowerCase() === 'aluno')
  } catch (err) {
    console.error('Erro ao carregar agendamentos:', err)
    showFeedback('Erro ao carregar dados', 'error')
  } finally {
    setTimeout(() => { loading.value = false }, 500)
  }
}

const agendamentosFiltrados = computed(() => {
  const lista = agendamentos.value.filter(a => {
    const nome = getNomeAluno(a.alunoId).toLowerCase()
    return nome.includes(filtroNome.value.toLowerCase())
  })
  return lista.sort((a, b) => new Date(a.data) - new Date(b.data))
})

const isHoje = (data) => {
  const hoje = new Date().toISOString().split('T')[0]
  return data === hoje
}

const formatarData = (data) => {
  if (!data) return ''
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

const getNomeAluno = (id) => {
  const aluno = alunos.value.find(a => String(a.id) === String(id))
  return aluno ? aluno.name : 'Desconhecido'
}

const deletar = async (id) => {
  if (!confirm('Deseja excluir?')) return
  try {
    await axios.delete(`${API_URL}//agendamentos/${id}`)
    showFeedback('Excluído com sucesso!')
    await fetchData()
  } catch {
    showFeedback('Erro ao excluir', 'error')
  }
}

const iniciarEdicao = (ag) => { editando.value = { ...ag } }

const salvarEdicao = async () => {
  try {
    salvandoId.value = editando.value.id
    await axios.put(`${API_URL}/agendamentos/${editando.value.id}`, editando.value)
    showFeedback('Alterações salvas!')
    editando.value = null
    await fetchData()
  } catch {
    showFeedback('Erro ao salvar', 'error')
  } finally {
    salvandoId.value = null
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="view-container">
    <Transition name="toast">
      <div v-if="feedback.message" :class="['toast-notification', feedback.type]">
        {{ feedback.message }}
      </div>
    </Transition>

    <header class="page-header">
      <h1 class="title">Gestão de Agendamentos</h1>
    </header>

    <CadastrarAgendamento @created="fetchData" />

    <div class="content-wrapper">
      <div class="toolbar">
        <div class="search-box">
          <div class="search-icon-wrapper">🔍</div>
          <input
            v-model="filtroNome"
            placeholder="Buscar por nome do aluno..."
            class="search-input"
          />
        </div>
      </div>

      <div class="table-card shadow-soft">
        <table class="modern-table">
          <thead>
            <tr>
              <th>ALUNO</th>
              <th>TIPO</th>
              <th>DATA</th>
              <th>HORA</th>
              <th>OBSERVAÇÃO</th>
              <th>AÇÕES</th>
            </tr>
          </thead>

          <tbody v-if="loading">
            <tr v-for="n in 5" :key="'sk' + n" class="skeleton-row">
              <td v-for="i in 6" :key="i"><div></div></td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr
              v-for="a in agendamentosFiltrados"
              :key="a.id"
              :class="{ 'linha-hoje': isHoje(a.data) }"
            >
              <td data-label="ALUNO" class="col-aluno-destaque">
                <div class="cell-center">
                  <span v-if="isHoje(a.data)" class="hoje-tag">HOJE</span>
                  {{ getNomeAluno(a.alunoId) }}
                </div>
              </td>

              <td data-label="TIPO">
                <div class="cell-center">
                  <input v-if="editando?.id === a.id" v-model="editando.tipo" class="edit-input" />
                  <span v-else class="badge-tipo-glass">{{ a.tipo }}</span>
                </div>
              </td>

              <td data-label="DATA">
                <div class="cell-center">
                  <input v-if="editando?.id === a.id" type="date" v-model="editando.data" class="edit-input" />
                  <span v-else>{{ formatarData(a.data) }}</span>
                </div>
              </td>

              <td data-label="HORA">
                <div class="cell-center text-time">
                  <input v-if="editando?.id === a.id" type="time" v-model="editando.hora" class="edit-input" />
                  <span v-else>{{ a.hora }}</span>
                </div>
              </td>

              <td data-label="OBSERVAÇÃO" class="col-obs-muted">
                <div class="cell-center">
                  <input v-if="editando?.id === a.id" v-model="editando.observacao" class="edit-input" />
                  <span v-else>{{ a.observacao || '-' }}</span>
                </div>
              </td>

              <td data-label="AÇÕES" class="actions">
                <div class="cell-center">
                  <div v-if="editando?.id === a.id" class="edit-buttons-group">
                    <button @click="salvarEdicao" class="btn-save-grad" :disabled="salvandoId === a.id">
                      {{ salvandoId === a.id ? '...' : 'Salvar' }}
                    </button>
                    <button @click="editando = null" class="btn-cancel-link">Cancelar</button>
                  </div>
                  <div v-else class="action-buttons-group">
                    <button @click="iniciarEdicao(a)" class="btn-action edit">Editar</button>
                    <button @click="deletar(a.id)" class="btn-action delete">Excluir</button>
                  </div>
                </div>
              </td>
            </tr>

            <tr v-if="agendamentosFiltrados.length === 0">
              <td colspan="6" class="empty-state">
                Nenhum agendamento encontrado para "{{ filtroNome }}"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. FUNDO E ESTRUTURA */
.view-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
}

.page-header {
  padding: 25px 40px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
}

.title { font-size: 1.6rem; color: #1e293b; font-weight: 800; }

.content-wrapper { padding: 20px; max-width: 1200px; margin: 0 auto; }

/* 2. TABELA E CENTRALIZAÇÃO */
.shadow-soft { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }

.table-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.modern-table { width: 100%; border-collapse: collapse; }

.modern-table th {
  background: linear-gradient(to bottom, #ffffff, #f8fafc);
  border-bottom: 2px solid #f1f5f9;
  text-align: center;
  padding: 18px;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.cell-center {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;
  min-height: 45px;
}

/* 3. DESIGN DOS DADOS */
.col-aluno-destaque { color: #1e293b; font-weight: 700; }
.col-obs-muted { color: #94a3b8; font-size: 0.85rem; font-style: italic; }
.text-time { color: #475569; font-weight: 600; }

.badge-tipo-glass {
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
  padding: 4px 14px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
}

.hoje-tag {
  background: #2563eb;
  color: white;
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 4px;
}

/* 4. BUSCA E LUPA */
.toolbar { margin-bottom: 30px; display: flex; justify-content: center; }
.search-box { position: relative; width: 100%; max-width: 500px; display: flex; align-items: center; }
.search-icon-wrapper {
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  height: 100%;
}
.search-input {
  width: 100%;
  padding: 14px 15px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  outline: none;
  text-align: center;
}

/* 5. RESPONSIVIDADE (CARDS) */
@media (max-width: 768px) {
  .modern-table thead { display: none; } /* Esconde o topo da tabela */

  .modern-table tr {
    display: block;
    border-bottom: 8px solid #f1f5f9; /* Espaço entre os cards */
    padding: 15px 0;
  }

  .modern-table td {
    display: block;
    text-align: center;
    padding: 10px 15px;
    border: none;
  }

  .modern-table td::before {
    content: attr(data-label);
    display: block;
    font-size: 0.7rem;
    font-weight: 800;
    color: #94a3b8;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .cell-center {
    justify-content: center; /* Mantém as informações no centro do card */
    min-height: auto;
  }

  .hoje-tag { display: inline-block; margin-bottom: 5px; }

  .table-card { border: none; background: transparent; box-shadow: none; }
  .modern-table tr { background: white; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
}

/* BOTÕES E OUTROS */
.btn-action { background: none; border: none; font-weight: 700; cursor: pointer; }
.btn-action.edit { color: #2563eb; margin-right: 10px;}
.btn-action.delete { color: #ef4444; }

.btn-save-grad {
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  color: white; border: none; padding: 8px 16px; border-radius: 8px; font-weight: 600;
}

.toast-notification {
  position: fixed; top: 25px; right: 25px; padding: 14px 28px;
  border-radius: 12px; background: #1e293b; color: white; z-index: 1000;
}
</style>
