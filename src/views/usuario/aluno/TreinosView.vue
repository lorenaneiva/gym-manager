<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';

const userStore = useUserStore();
const route = useRoute();

const treinos = ref([]);
const carregando = ref(true);
const erro = ref('');

const buscarTreinos = async () => {
  try {
    // Pega o ID do aluno. Pode ser o ID do usuário logado ou um ID passado na rota (caso um instrutor esteja acessando)
    const alunoId = route.params.id || userStore.user?.id;
    
    if (!alunoId) {
      erro.value = 'ID do aluno não identificado.';
      carregando.value = false;
      return;
    }

    const response = await axios.get(`http://localhost:3000/treinos?alunoId=${alunoId}`);

    // Filtrando apenas os treinos que possuem ativo = true e 
    // adicionando um campo 'expandido' para gerenciar a exibição na interface
    treinos.value = response.data
      .filter(treino => treino.ativo === true)
      .map(treino => ({
        ...treino,
        expandido: false
      }));

  } catch (err) {
    console.error('Erro ao buscar treinos:', err);
    erro.value = 'Ocorreu um erro ao buscar os treinos. Tente novamente mais tarde.';
  } finally {
    carregando.value = false;
  }
};

// Função para alternar a exibição dos exercícios do treino clicado
const toggleTreino = (index) => {
  treinos.value[index].expandido = !treinos.value[index].expandido;
};

onMounted(() => {
  buscarTreinos();
});
</script>

<template>
  <main>
    <div id="cabecalho">
      <h3>Treinos do Aluno</h3>
      <p id="subtitulo">Acompanhe as rotinas de exercícios ativas e as metas estruturadas.</p>
    </div>

    <!-- Feedback de Estado -->
    <div v-if="carregando" class="msg-estado carregando">
      Buscando treinos...
    </div>
    
    <div v-else-if="erro" class="msg-estado erro">
      {{ erro }}
    </div>
    
    <div v-else-if="treinos.length === 0" class="msg-estado vazio">
      Não há nenhum treino ativo cadastrado no momento.
    </div>

    <!-- Listagem de Treinos -->
    <div v-else id="lista-treinos">
      <div 
        v-for="(treino, index) in treinos" 
        :key="treino.id" 
        class="treino-card"
      >
        <!-- Cabeçalho Clicável (Ativa o Accordion) -->
        <div class="treino-header" @click="toggleTreino(index)">
          <div class="treino-info">
            <h4>{{ treino.nome }}</h4>
            <p class="treino-objetivo">Objetivo: {{ treino.objetivo }}</p>
          </div>
          <button class="icone-expandir">
            {{ treino.expandido ? '▲' : '▼' }}
          </button>
        </div>

        <!-- Área Expansível com os Exercícios -->
        <transition name="fade">
          <div v-show="treino.expandido" class="treino-body">
            <hr class="divisor" />
            <h5>Ficha de Exercícios</h5>
            <div class="exercicios-lista">
              <div v-for="(exercicio, exIndex) in treino.exercicios" :key="exIndex" class="exercicio-item">
                <span class="ex-nome">{{ exercicio.nome }}</span>
                <span class="ex-detalhes">{{ exercicio.series }} séries de {{ exercicio.repeticoes }} repetições</span>
              </div>
            </div>
          </div>
        </transition>
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
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  max-width: 640px;
}
.carregando { color: #1E3A8A; background-color: #DBEAFE; }
.erro { color: #DC2626; background-color: #FEF2F2; }
.vazio { color: #047857; background-color: #ECFDF5; }

#lista-treinos {
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.treino-card {
  background-color: #fff;
  border: 1px solid #BFDBFE;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.treino-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s ease;
}

.treino-header:hover {
  background-color: #F8FAFC;
}

.treino-info h4 {
  margin: 0;
  color: #1E3A8A;
  font-size: 18px;
}

.treino-objetivo {
  margin: 4px 0 0 0;
  color: #64748B;
  font-size: 13px;
}

.icone-expandir {
  background: none;
  border: none;
  color: #2563EB;
  font-size: 14px;
  cursor: pointer;
  padding: 8px;
}

.treino-body {
  padding: 0 20px 20px 20px;
  background-color: #FAFAFA;
}

.divisor {
  border: none;
  border-top: 1px solid #E2E8F0;
  margin: 0 0 16px 0;
}

.treino-body h5 {
  margin: 0 0 12px 0;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
}

.exercicios-lista {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercicio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
}

.ex-nome {
  font-weight: 600;
  color: #0F172A;
  font-size: 14px;
}

.ex-detalhes {
  color: #475569;
  font-size: 13px;
  background-color: #F1F5F9;
  padding: 4px 8px;
  border-radius: 4px;
}

/* Transição suave do Accordion */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Responsividade mobile */
@media (max-width: 600px) {
  main { padding: 16px; }
  
  .exercicio-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .ex-detalhes {
    align-self: flex-start;
  }
}
</style>