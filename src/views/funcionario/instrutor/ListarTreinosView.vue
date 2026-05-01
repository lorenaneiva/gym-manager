<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const treinos = ref([]);
const alunos = ref([]);
const carregando = ref(true);
const erro = ref('');

// Busca todos os treinos e os usuários com a role de aluno simultaneamente
const buscarDados = async () => {
  try {
    const [resTreinos, resAlunos] = await Promise.all([
      axios.get('http://localhost:3000/treinos'),
      axios.get('http://localhost:3000/users?role=aluno')
    ]);
    
    treinos.value = resTreinos.data;
    alunos.value = resAlunos.data;
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    erro.value = 'Ocorreu um erro ao carregar os treinos. Tente novamente mais tarde.';
  } finally {
    carregando.value = false;
  }
};

// Função auxiliar para pegar o nome do aluno baseado no alunoId salvo no treino
const getNomeAluno = (id) => {
  const aluno = alunos.value.find(a => a.id === id);
  return aluno ? aluno.name : 'Aluno não encontrado';
};

// Redireciona para a página de atualização (a que já criamos) com o ID correto
const editarTreino = (id) => {
  router.push(`/atualizar-treino/${id}`);
};

// Remove um treino permanentemente do JSON Server
const excluirTreino = async (id) => {
  if (confirm('Tem certeza que deseja excluir este treino permanentemente?')) {
    try {
      await axios.delete(`http://localhost:3000/treinos/${id}`);
      treinos.value = treinos.value.filter(t => t.id !== id);
      alert('Treino excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir treino:', err);
      alert('Ocorreu um erro ao excluir o treino.');
    }
  }
};

onMounted(() => {
  buscarDados();
});
</script>

<template>
  <main>
    <div id="cabecalho">
      <h3>Gerenciar Treinos</h3>
      <p id="subtitulo">Visualize, edite ou exclua os treinos cadastrados para os alunos.</p>
    </div>

    <!-- Feedback de Estado -->
    <div v-if="carregando" class="msg-estado carregando">
      Carregando lista de treinos...
    </div>
    
    <div v-else-if="erro" class="msg-estado erro">
      {{ erro }}
    </div>
    
    <div v-else-if="treinos.length === 0" class="msg-estado vazio">
      Não há nenhum treino cadastrado no momento.
    </div>

    <!-- Listagem de Treinos -->
    <div v-else id="lista-treinos">
      <div v-for="treino in treinos" :key="treino.id" class="treino-card">
        <div class="treino-info">
          <div class="header-card">
            <h4>{{ treino.nome }}</h4>
            <span :class="['status-badge', treino.ativo ? 'ativo' : 'inativo']">
              {{ treino.ativo ? 'Ativo' : 'Inativo' }}
            </span>
          </div>
          <p class="aluno-nome"><strong>Aluno:</strong> {{ getNomeAluno(treino.alunoId) }}</p>
          <p class="treino-objetivo">{{ treino.objetivo }}</p>
          <p class="qtd-exercicios">{{ treino.exercicios?.length || 0 }} exercício(s) cadastrado(s)</p>
        </div>
        
        <div class="treino-acoes">
          <button class="btn-editar" @click="editarTreino(treino.id)">Editar</button>
          <button class="btn-excluir" @click="excluirTreino(treino.id)">Excluir</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: #EFF6FF;
  min-height: 100vh;
  padding: 32px;
}

#cabecalho { margin-bottom: 24px; }
h3 { color: #172554; font-size: 22px; margin: 0 0 4px; }
#subtitulo { color: #2563EB; font-size: 13px; margin: 0; }

.msg-estado {
  padding: 16px; border-radius: 8px; font-size: 14px; font-weight: 500; max-width: 720px;
}
.carregando { color: #1E3A8A; background-color: #DBEAFE; }
.erro { color: #DC2626; background-color: #FEF2F2; }
.vazio { color: #047857; background-color: #ECFDF5; }

#lista-treinos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  max-width: 1000px;
}

.treino-card {
  background-color: #fff;
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-card {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;
}

.header-card h4 { margin: 0; color: #1E3A8A; font-size: 18px; line-height: 1.2; }

.status-badge {
  font-size: 11px; font-weight: 600; padding: 4px 8px; border-radius: 12px; text-transform: uppercase;
}
.ativo { background-color: #D1FAE5; color: #065F46; }
.inativo { background-color: #FEE2E2; color: #991B1B; }

.aluno-nome { margin: 0 0 8px 0; color: #334155; font-size: 14px; }
.treino-objetivo { margin: 0 0 12px 0; color: #64748B; font-size: 13px; line-height: 1.4; }
.qtd-exercicios { margin: 0 0 16px 0; color: #1D4ED8; font-size: 13px; font-weight: 500; }

.treino-acoes {
  display: flex; gap: 8px; border-top: 1px solid #E2E8F0; padding-top: 16px;
}

button {
  flex: 1; padding: 8px 0; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none;
}

.btn-editar {
  background-color: #EFF6FF; color: #2563EB; border: 1px solid #BFDBFE;
}
.btn-editar:hover { background-color: #DBEAFE; }

.btn-excluir {
  background-color: #FEF2F2; color: #DC2626; border: 1px solid #FECACA;
}
.btn-excluir:hover { background-color: #FEE2E2; }

@media (max-width: 600px) {
  main { padding: 16px; }
  #lista-treinos { grid-template-columns: 1fr; }
}
</style>