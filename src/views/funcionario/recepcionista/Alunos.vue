<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'AlunosView'
});

const router = useRouter();

const usuarios = ref([]);
const planos = ref([]);
const carregando = ref(true);
const erro = ref('');

// Campos de busca
const buscaAluno = ref('');
const buscaUsuario = ref('');

// Buscar todos os usuários e os planos para podermos traduzir o ID do plano para o Nome
const buscarDados = async () => {
  try {
    const [resUsuarios, resPlanos] = await Promise.all([
      axios.get('http://localhost:3000/users'),
      axios.get('http://localhost:3000/planos')
    ]);
    
    usuarios.value = resUsuarios.data;
    planos.value = resPlanos.data;
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    erro.value = 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.';
  } finally {
    carregando.value = false;
  }
};

// Helper para pegar o nome do plano
const getNomePlano = (planoId) => {
  if (!planoId) return 'Sem plano ativo';
  const plano = planos.value.find(p => p.id === planoId);
  return plano ? plano.nome : 'Plano não encontrado';
};

// Computed Properties para separar e filtrar as listas
const alunosFiltrados = computed(() => {
  const alunos = usuarios.value.filter(u => u.role === 'aluno');
  if (!buscaAluno.value) return alunos;
  
  const termo = buscaAluno.value.toLowerCase();
  return alunos.filter(a => a.name.toLowerCase().includes(termo));
});

const usuariosFiltrados = computed(() => {
  // Aqui filtramos quem NÃO É aluno, admin, instrutor ou recepcionista (geralmente 'guest')
  const guests = usuarios.value.filter(u => u.role === 'guest' || !u.role);
  if (!buscaUsuario.value) return guests;
  
  const termo = buscaUsuario.value.toLowerCase();
  return guests.filter(u => u.name.toLowerCase().includes(termo));
});

// Ações dos botões
const irParaAgendamento = (alunoId) => {
  // Usando query params para não quebrar a rota existente (ex: /cadastrar-agendamento?alunoId=2)
  router.push({ path: '/cadastrar-agendamento', query: { alunoId } });
};

const tornarAluno = (usuarioId) => {
  // A rota de edição/cadastro que você já criou que recebe :id
  router.push(`/cadastrar-aluno/${usuarioId}`);
};

onMounted(() => {
  buscarDados();
});
</script>

<template>
  <main>
    <div id="cabecalho">
      <h3>Gestão de Alunos e Usuários</h3>
      <p id="subtitulo">Acompanhe a base de alunos ativos e converta novos usuários.</p>
    </div>

    <!-- Feedback de Estado -->
    <div v-if="carregando" class="msg-estado carregando">
      Carregando dados do sistema...
    </div>
    
    <div v-else-if="erro" class="msg-estado erro">
      {{ erro }}
    </div>

    <div v-else class="conteudo-tabelas">
      
      <!-- TABELA DE ALUNOS -->
      <section class="tabela-section">
        <div class="section-header">
          <h4>Alunos Matriculados ({{ alunosFiltrados.length }})</h4>
          <div class="busca-container">
            <input 
              type="text" 
              v-model="buscaAluno" 
              placeholder="Buscar aluno por nome..." 
              class="input-busca"
            />
          </div>
        </div>

        <div class="table-responsive">
          <table class="tabela">
            <thead>
              <tr>
                <th>Nome do Aluno</th>
                <th>Plano Atual</th>
                <th class="col-acao">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="alunosFiltrados.length === 0">
                <td colspan="3" class="empty-state">Nenhum aluno encontrado.</td>
              </tr>
              <tr v-for="aluno in alunosFiltrados" :key="aluno.id">
                <td class="col-nome">{{ aluno.name }}</td>
                <td>
                  <span class="plano-badge">{{ getNomePlano(aluno.planoId) }}</span>
                </td>
                <td class="col-acao">
                  <button class="btn-agendar" @click="irParaAgendamento(aluno.id)">
                    Agendar Aula
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- TABELA DE USUÁRIOS (GUESTS) -->
      <section class="tabela-section">
        <div class="section-header">
          <h4>Usuários / Visitantes ({{ usuariosFiltrados.length }})</h4>
          <div class="busca-container">
            <input 
              type="text" 
              v-model="buscaUsuario" 
              placeholder="Buscar usuário por nome..." 
              class="input-busca"
            />
          </div>
        </div>

        <div class="table-responsive">
          <table class="tabela">
            <thead>
              <tr>
                <th>Nome do Usuário</th>
                <th class="col-acao">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="2" class="empty-state">Nenhum usuário pendente encontrado.</td>
              </tr>
              <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
                <td class="col-nome">{{ usuario.name }}</td>
                <td class="col-acao">
                  <button class="btn-tornar-aluno" @click="tornarAluno(usuario.id)">
                    Tornar Aluno
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
main {
  background-color: #EFF6FF;
  min-height: 100vh;
  padding: 32px;
}

#cabecalho {
  margin-bottom: 24px;
}

h3 {
  color: #172554;
  font-size: 22px;
  margin: 0 0 4px;
}

#subtitulo {
  color: #2563EB;
  font-size: 13px;
  margin: 0;
}

.msg-estado {
  padding: 16px; border-radius: 8px; font-size: 14px; font-weight: 500; max-width: 720px;
}
.carregando { color: #1E3A8A; background-color: #DBEAFE; }
.erro { color: #DC2626; background-color: #FEF2F2; }

.conteudo-tabelas {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1000px;
}

.tabela-section {
  background-color: #fff;
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header h4 {
  margin: 0;
  color: #1E3A8A;
  font-size: 18px;
}

.input-busca {
  padding: 8px 12px;
  border: 1px solid #BFDBFE;
  border-radius: 6px;
  font-size: 13px;
  color: #172554;
  outline: none;
  width: 250px;
  transition: border-color 0.2s;
}

.input-busca:focus {
  border-color: #2563EB;
}

/* Responsividade da Tabela */
.table-responsive {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  min-width: 500px;
}

.tabela th, .tabela td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #E2E8F0;
  font-size: 14px;
}

.tabela th {
  color: #64748B;
  font-weight: 600;
  background-color: #F8FAFC;
}

.col-nome { color: #0F172A; font-weight: 500; }
.col-acao { text-align: right; width: 140px; }

.empty-state { text-align: center !important; color: #64748B; font-style: italic; padding: 24px !important; }

.plano-badge { background-color: #DBEAFE; color: #1D4ED8; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }

button { border: none; border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; }

.btn-agendar { background-color: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE; }
.btn-agendar:hover { background-color: #DBEAFE; }

.btn-tornar-aluno { background-color: #2563EB; color: #fff; }
.btn-tornar-aluno:hover { background-color: #1D4ED8; }

@media (max-width: 600px) {
  main { padding: 16px; }
  .input-busca { width: 100%; }
  .section-header { flex-direction: column; align-items: flex-start; }
  .busca-container { width: 100%; }
}
</style>
