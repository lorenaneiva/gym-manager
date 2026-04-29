<script setup>
import { ref } from 'vue'
//variaveis reativas para armazenar os valores dos inputs do formulário, e também para controlar as mensagens de feedback

import { useRouter } from 'vue-router'
//navegação entre as páginas
import axios from 'axios'
//para fazer a requisição de cadastro do plano para o backend
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
//aqui a gente acessa cada uma das instancias la do router pra ca pra dentro

// variáveis INICUIAS ligadas aos inputs
const nome = ref('')
const descricao = ref('')
const valor = ref('')
const duracaoDias = ref('')
const ativo = ref(true)

// mensagens de feedback
const sucesso = ref(false)
const erro = ref(false)

async function cadastrarPlano() {
  // verifica se está logado como admin
  if (!userStore.isAdmin) return

  try {
    await axios.post('http://localhost:3000/planos', {
      //requisição post e usando number pra poder converter os valores, É NO INICIO E NAO NO FINAL QUE NEM FLUTTER
      nome: nome.value,
      descricao: descricao.value,
      valor: Number(valor.value),
      duracaoDias: Number(duracaoDias.value),
      ativo: ativo.value
    })
    sucesso.value = true
    erro.value = false
  } catch (erro) {
    erro.value = true
    sucesso.value = false
  }
}

function cancelar() {
  router.back()
  // literalmente rota anterior
}
</script>

<template>
  <main v-if="userStore.isAdmin">
    <div id="cabecalho">
      <h3>Cadastrar Plano</h3>
      <p id="subtitulo">Crie um novo plano para os alunos GymSync</p>
    </div>

    <p v-if="sucesso" class="msg-sucesso">Plano cadastrado com sucesso!</p>
    <p v-if="erro" class="msg-erro">Erro ao cadastrar plano. Tente novamente.</p>

    <div id="form">
      <div class="campo">
        <label>Nome do plano</label>
        <input type="text" v-model="nome" placeholder="Ex: Plano Mensal" />
        <!-- v-model é um MODELO de ligação entre o input e a variável reativa, ou seja, qualquer mudança no input vaiu atingitr a variável-->
      </div>

      <div class="campo">
        <label>Descrição</label>
        <textarea v-model="descricao" placeholder="Descreva aqui o plano que deseja implementar."></textarea>
      </div>

      <div id="duplo">
        <div class="inputs">
          <label>Valor (R$)</label>
          <input type="number" v-model="valor" placeholder="Ex: 99,99" />
        </div>
        <div class="inputs">
          <label>Duração (dias)</label>
          <input type="number" v-model="duracaoDias" placeholder="30" />
        </div>
      </div>

      <div id="checkbox">
        <input type="checkbox" v-model="ativo" />
        <label>Plano ativo <strong>(visível para alunos)</strong></label>
      </div>

      <div id="botoes">
        <button type="submit" id="cadastrar" @click="cadastrarPlano">Cadastrar plano</button>
        <button id="cancelar" @click="cancelar">Cancelar</button>
      </div>
    </div>
  </main>

  <main v-else>
    <p class="msg-erro">Você não tem permissão para acessar essa página.</p>
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

.msg-sucesso {
  color: #047857;
  background-color: #ECFDF5;
  border: 0.5px solid #047857;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  font-size: 14px;
  max-width: 640px;
}

.msg-erro {
  color: #DC2626;
  background-color: #FEF2F2;
  border: 0.5px solid #DC2626;
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 16px;
  font-size: 14px;
  max-width: 640px;
}

#form {
  background-color: #fff;
  border: 0.5px solid #BFDBFE;
  border-radius: 12px;
  padding: 24px;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #1E3A8A;
  margin-bottom: 6px;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: 0.5px solid #BFDBFE;
  border-radius: 8px;
  font-size: 14px;
  color: #172554;
  background-color: #EFF6FF;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

#duplo {
  display: flex;
  gap: 16px;
}

#duplo .inputs {
  flex: 1;
}

#checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1E3A8A;
  font-size: 13px;
}

#checkbox label {
  margin: 0;
  color: #1E3A8A;
}

#checkbox input {
  width: 16px;
  height: 16px;
  accent-color: #2563EB;
}

#botoes {
  display: flex;
  gap: 12px;
}

#cadastrar {
  flex: 1;
  background-color: #2563EB;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

#cancelar {
  background-color: transparent;
  color: #2563EB;
  border: 0.5px solid #BFDBFE;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  main {
    padding: 16px;
  }

  #duplo {
    flex-direction: column;
    gap: 0;
  }

  #botoes {
    flex-direction: column;
  }

  #cadastrar {
    width: 100%;
  }
}
</style>
