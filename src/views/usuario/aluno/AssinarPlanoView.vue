<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { API_URL } from '@/api'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const formaPagamento = ref('credito')
const cvv = ref('')
const referencia = ref('')
const variasLetras = ref('')
const dataVencimento = ref('')
const plano = ref(null)
const carregando = ref(true)
const erro = ref('')
const usarNovoCartao = ref(false)

const cartaoSalvo = computed(() => userStore.user?.cartao || null)
const precisaInformarCartao = computed(() => !cartaoSalvo.value || usarNovoCartao.value)
const tituloFluxo = computed(() => userStore.isAluno ? 'Atualizar assinatura' : 'Assinar plano')
const textoBotao = computed(() => userStore.isAluno ? 'Atualizar plano' : 'Confirmar assinatura')

function dadosCartao() {
  if (!precisaInformarCartao.value && cartaoSalvo.value) {
    return cartaoSalvo.value
  }

  return {
    formaPagamento: formaPagamento.value,
    final: referencia.value.slice(-4),
    nome: variasLetras.value.trim(),
    validade: dataVencimento.value
  }
}

async function buscarPlano() {
  try {
    const response = await axios.get(`${API_URL}/planos/${route.params.id}`)
    plano.value = response.data
  } catch {
    erro.value = 'Plano não encontrado.'
  } finally {
    carregando.value = false
  }
}

const atualizarRolePatch = async () => {
  try {
    if (!userStore.user) {
      alert('Você precisa estar logado para assinar um plano.')
      router.push('/login')
      return
    }

    const planoId = route.params.id
    const deveValidarCartao = precisaInformarCartao.value
    const eraAluno = userStore.isAluno

    if (deveValidarCartao && (!referencia.value || referencia.value.length < 12 || !variasLetras.value.trim() || !dataVencimento.value || !cvv.value)) {
      alert('Preencha os dados do cartão para continuar.')
      return
    }

    const response = await axios.patch(`${API_URL}/users/${userStore.user.id}`, {
      role: 'aluno',
      plano: planoId,
      planoId,
      cartao: dadosCartao(),
      ativo: true
    })

    userStore.setUser(response.data)

    router.push({
      path: '/perfil',
      query: {
        sucesso: eraAluno ? 'plano-atualizado' : 'plano-assinado'
      }
    })
  } catch (error) {
    console.error('Erro ao confirmar a assinatura', error)

    if (error.code === 'ERR_NETWORK') {
      alert('Erro de conexão: o servidor JSON Server parece estar desligado.')
    } else if (error.response && error.response.status === 404) {
      alert(`Erro 404: o usuário com ID ${userStore.user?.id} não foi encontrado no banco de dados.`)
    } else {
      alert('Ocorreu um erro ao processar o pagamento: ' + error.message)
    }
  }
}

const formatarDataVencimento = (event) => {
  let value = event.target.value

  value = value.replace(/\D/g, '')

  if (value.length > 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }

  dataVencimento.value = value
}

const soLetras = (e) => {
  const char = String.fromCharCode(e.keyCode)

  if (/^[a-zA-Z ]+$/.test(char)) {
    return true
  }

  e.preventDefault()
}

const soNumeros = (e) => {
  const char = String.fromCharCode(e.keyCode)

  if (/^[0-9]+$/.test(char)) {
    return true
  }

  e.preventDefault()
}

const valido = computed(() => {
  return /^[0-9]*$/.test(referencia.value)
})

const cvvValido = computed(() => {
  return /^[0-9]*$/.test(cvv.value)
})

const letrasCertas = computed(() => {
  return /^[a-zA-Z ]*$/.test(variasLetras.value)
})

onMounted(() => {
  buscarPlano()
})
</script>

<template>
  <main>
    <div id="cabecalho">
      <h3>{{ tituloFluxo }}</h3>
      <p v-if="plano" id="subtitulo">
        {{ plano.nome }} - R$ {{ Number(plano.valor).toFixed(2).replace('.', ',') }}
      </p>
    </div>

    <div v-if="carregando" class="msg-estado carregando">
      Carregando assinatura...
    </div>

    <div v-else-if="erro" class="msg-estado erro">
      {{ erro }}
    </div>

    <div v-else id="form">
      <div v-if="cartaoSalvo && !usarNovoCartao" class="cartao-salvo">
        <span>Cartão salvo</span>
        <strong>{{ cartaoSalvo.formaPagamento }} final {{ cartaoSalvo.final }}</strong>
        <button type="button" @click="usarNovoCartao = true">
          Usar outro cartão
        </button>
      </div>

      <template v-if="precisaInformarCartao">
        <div class="checkbox-item">
        <input
          v-model="formaPagamento"
          value="credito"
          id="pagamento-credito"
          class="radio"
          type="radio"
        />

        <label for="pagamento-credito">
          Cartão de crédito
        </label>
        </div>

        <div class="checkbox-item">
        <input
          v-model="formaPagamento"
          value="debito"
          id="pagamento-debito"
          class="radio"
          type="radio"
        />

        <label for="pagamento-debito">
          Cartão de débito
        </label>
        </div>

        <div class="campo">
        <label>Número do cartão</label>

        <input
          type="text"
          v-model="referencia"
          maxlength="16"
          @keypress="soNumeros($event)"
          placeholder="Ex: 0123456789012345"
        />

        <p v-if="!valido" class="erro-validacao">
          Formato de referência inválido.
        </p>
        </div>

        <div class="campo">
        <label>Nome do cartão</label>

        <input
          type="text"
          v-model="variasLetras"
          @keypress="soLetras($event)"
          placeholder="Jorge Centelha dos Santos"
        />

        <p v-if="!letrasCertas" class="erro-validacao">
          Formato de referência inválido.
        </p>
        </div>

        <div id="duplo">
        <div class="inputs">
          <label>Data de vencimento</label>

          <input
            type="text"
            v-model="dataVencimento"
            @input="formatarDataVencimento"
            maxlength="5"
            placeholder="Ex: MM/AA"
          />
        </div>

        <div class="inputs">
          <label>CVV</label>

          <input
            type="text"
            v-model="cvv"
            maxlength="3"
            @keypress="soNumeros($event)"
            placeholder="Ex: 000"
          />

          <p v-if="!cvvValido" class="erro-validacao">
            Formato de referência inválido.
          </p>
        </div>
        </div>
      </template>

      <div id="botoes">
        <button
          type="button"
          id="cadastrar"
          @click.prevent="atualizarRolePatch"
        >
          {{ textoBotao }}
        </button>

        <button
          type="button"
          id="cancelar"
          @click="router.push(userStore.isAluno ? '/perfil' : '/planos')"
        >
          Cancelar
        </button>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: #eff6ff;
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
  color: #2563eb;
  font-size: 13px;
  margin: 0;
}

#form {
  background-color: #fff;
  border: 0.5px solid #bfdbfe;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cartao-salvo {
  display: grid;
  gap: 6px;
  padding: 16px;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  background: #eff6ff;
}

.cartao-salvo span {
  color: #2563eb;
  font-size: 12px;
  font-weight: 700;
}

.cartao-salvo strong {
  color: #172554;
}

.cartao-salvo button {
  width: fit-content;
  padding: 8px 12px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: #fff;
  color: #2563eb;
  cursor: pointer;
}

.msg-estado {
  max-width: 640px;
  padding: 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
}

.carregando {
  color: #1e3a8a;
  background-color: #dbeafe;
}

.erro {
  color: #dc2626;
  background-color: #fef2f2;
}

label {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: #1e3a8a;
  margin-bottom: 6px;
}

input[type="text"],
input[type="number"],
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  border: 0.5px solid #bfdbfe;
  border-radius: 8px;
  font-size: 14px;
  color: #172554;
  background-color: #eff6ff;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

#duplo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

#duplo .inputs {
  flex: 1;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1e3a8a;
  font-size: 13px;
}

.checkbox-item label {
  margin: 0;
  color: #1e3a8a;
  cursor: pointer;
}

.checkbox-item input {
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
}

#botoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

#cadastrar {
  flex: 1;
  background-color: #2563eb;
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
  color: #2563eb;
  border: 0.5px solid #bfdbfe;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
}

.erro-validacao {
  color: red;
  margin: 6px 0 0;
  font-size: 13px;
}

@media (min-width: 768px) {
  #duplo,
  #botoes {
    flex-direction: row;
  }
}
</style>
