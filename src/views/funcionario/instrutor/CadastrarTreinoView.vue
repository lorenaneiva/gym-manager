<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();

const alunoId = ref('');
const alunos = ref([]); 

const nomeTreino = ref('');
const objetivo = ref('');
const exercicios = ref([
  { nome: '', series: '', repeticoes: '' } 
]);

const erros = ref({}); 

const buscarAlunos = async () => {
  try {
    // Busca na API apenas os usuários que têm a role "aluno"
    const response = await axios.get('http://localhost:3000/users?role=aluno');
    alunos.value = response.data;
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
  }
};

const adicionarExercicio = () => {
  exercicios.value.push({ nome: '', series: '', repeticoes: '' });
};

const removerExercicio = (index) => {
  exercicios.value.splice(index, 1);
};

const validarESalvar = async () => {
  erros.value = {}; // Limpa os erros anteriores

  if (!alunoId.value) erros.value.aluno = 'Por favor, selecione um aluno.';
  if (!nomeTreino.value.trim()) erros.value.nomeTreino = 'O nome do treino é obrigatório.';
  if (!objetivo.value.trim()) erros.value.objetivo = 'O objetivo do treino é obrigatório.';
  
  if (exercicios.value.length === 0) {
    erros.value.exerciciosGeral = 'Adicione pelo menos um exercício ao treino.';
  } else {
    const temExercicioInvalido = exercicios.value.some(ex => !ex.nome.trim() || !ex.series || !ex.repeticoes.trim());
    if (temExercicioInvalido) {
      erros.value.exercicios = 'Preencha todos os campos de todos os exercícios inseridos.';
    }
  }

  // Se o objeto de erros continuar vazio, significa que passou na validação
  if (Object.keys(erros.value).length === 0) {
    try {
      await axios.post('http://localhost:3000/treinos', {
        alunoId: alunoId.value,
        nome: nomeTreino.value,
        objetivo: objetivo.value,
        exercicios: exercicios.value,
        ativo: true
      });
      alert('Treino cadastrado com sucesso!');
      // Limpa os dados do formulário
      alunoId.value = '';
      nomeTreino.value = '';
      objetivo.value = '';
      exercicios.value = [{ nome: '', series: '', repeticoes: '' }];
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert('Ocorreu um erro ao salvar o treino. Tente novamente.');
    }
  }
};

onMounted(() => {
  alunoId.value = route.params.id || '';
  buscarAlunos(); 
});
</script>

<template>
  <main>
    <div id="cabecalho">
      <h3>Cadastrar Novo Treino</h3>
      <p id="subtitulo">Preencha os dados e monte a ficha de exercícios do aluno.</p>
    </div>

    <div id="form">
      <!-- Dados do Treino -->
      <div class="campo">
        <label>Selecione o Aluno</label>
        <select v-model="alunoId" :class="{'input-error': erros.aluno}">
          <option value="" disabled selected>Selecione um aluno...</option>
          <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
            {{ aluno.name }}
          </option>
        </select>
        <p v-if="erros.aluno" class="error-msg">{{ erros.aluno }}</p>
      </div>

      <div class="campo">
        <label>Nome do Treino</label>
        <input type="text" v-model="nomeTreino" placeholder="Ex: Treino A - Inferiores" :class="{'input-error': erros.nomeTreino}" />
        <p v-if="erros.nomeTreino" class="error-msg">{{ erros.nomeTreino }}</p>
      </div>

      <div class="campo">
        <label>Objetivo</label>
        <textarea v-model="objetivo" placeholder="Ex: Foco em ganho de força e hipertrofia..." :class="{'input-error': erros.objetivo}"></textarea>
        <p v-if="erros.objetivo" class="error-msg">{{ erros.objetivo }}</p>
      </div>

      <hr class="divisor" />

      <!-- Seção de Exercícios -->
      <div class="exercicios-section">
        <div class="exercicios-header">
          <h4>Exercícios</h4>
          <button class="btn-adicionar" @click.prevent="adicionarExercicio">+ Adicionar Exercício</button>
        </div>
        <p v-if="erros.exerciciosGeral" class="error-msg" style="margin-bottom: 12px;">{{ erros.exerciciosGeral }}</p>
        <p v-if="erros.exercicios" class="error-msg" style="margin-bottom: 12px;">{{ erros.exercicios }}</p>

        <!-- Lista Dinâmica de Exercícios -->
        <div v-for="(exercicio, index) in exercicios" :key="index" class="exercicio-card">
          <div class="exercicio-inputs">
            <div class="campo flex-2">
              <label>Nome do Exercício</label>
              <input type="text" v-model="exercicio.nome" placeholder="Ex: Agachamento Livre" :class="{'input-error': erros.exercicios && !exercicio.nome.trim()}" />
            </div>
            <div class="campo flex-1">
              <label>Séries</label>
              <input type="number" v-model="exercicio.series" min="1" placeholder="Ex: 4" :class="{'input-error': erros.exercicios && !exercicio.series}" />
            </div>
            <div class="campo flex-1">
              <label>Repetições</label>
              <input type="text" v-model="exercicio.repeticoes" placeholder="Ex: 10 a 12" :class="{'input-error': erros.exercicios && !exercicio.repeticoes.trim()}" />
            </div>
          </div>
          <button class="btn-remover" @click.prevent="removerExercicio(index)">Remover</button>
        </div>
      </div>

      <!-- Botões de Ação -->
      <div id="botoes">
        <button type="submit" id="cadastrar" @click.prevent="validarESalvar">Salvar Treino</button>
        <button type="button" id="cancelar" @click="$router.push('/funcionario')">Cancelar</button>
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

#form {
  background-color: #fff;
  border: 0.5px solid #BFDBFE;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1E3A8A;
  margin-bottom: 6px;
}

input[type="text"],
input[type="number"],
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #BFDBFE;
  border-radius: 8px;
  font-size: 14px;
  color: #172554;
  background-color: #EFF6FF;
  outline: none;
  transition: border-color 0.2s;
}

input:focus, select:focus, textarea:focus {
  border-color: #2563EB;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.input-error {
  border-color: #DC2626 !important;
}

.error-msg {
  color: #DC2626;
  font-size: 12px;
  margin: 4px 0 0 0;
}

.divisor {
  border: none;
  border-top: 1px solid #DBEAFE;
  margin: 10px 0;
}

/* Seção de Exercícios */
.exercicios-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.exercicios-header h4 {
  margin: 0;
  color: #1E3A8A;
  font-size: 18px;
}

.btn-adicionar {
  background-color: #DBEAFE;
  color: #1D4ED8;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-adicionar:hover {
  background-color: #BFDBFE;
}

.exercicio-card {
  background-color: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.exercicio-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-remover {
  align-self: flex-end;
  background-color: transparent;
  color: #DC2626;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-remover:hover {
  text-decoration: underline;
}

/* Botões de Ação do Formulário */
#botoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 10px;
}

#cadastrar {
  flex: 1;
  background-color: #2563EB;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

#cadastrar:hover {
  background-color: #1D4ED8;
}

#cancelar {
  background-color: transparent;
  color: #2563EB;
  border: 1px solid #BFDBFE;
  border-radius: 8px;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

/* Responsividade para Desktop */
@media (min-width: 768px) {
  .exercicio-inputs {
    flex-direction: row;
  }
  
  .flex-2 {
    flex: 2;
  }
  
  .flex-1 {
    flex: 1;
  }

  #botoes {
    flex-direction: row;
  }
}
</style>
