<template>
  <div class="plano-card">
    <div class="imagem-area">
      <img :src="imagem" :alt="nome" />
    </div>

    <div class="conteudo-card">
      <h3>{{ nome }}</h3>

      <p class="descricao">
        {{ descricao }}
      </p>

      <p class="valor">
        R$ {{ Number(valor).toFixed(2).replace('.', ',') }}
      </p>

      <button @click="$emit('assinar', id)">
        Assinar plano
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: Number,
  imagem: String,
  nome: String,
  descricao: String,
  valor: Number
})

defineEmits(['assinar'])
</script>

<style scoped>
.plano-card {
  width: 100%;
  max-width: 340px;
  background: #ffffff;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid #ddd;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.08);
  transition: 0.3s ease;
}

.plano-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.14);
}

.imagem-area {
  width: 100%;
  height: 190px;
  background: #e9f4ef;
}

.imagem-area img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.conteudo-card {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

h3 {
  font-size: 22px;
  color: #1f1f1f;
}

.descricao {
  min-height: 70px;
  color: #555;
  line-height: 1.5;
}

.valor {
  font-size: 24px;
  font-weight: bold;
  color: #0b7a4b;
}

button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #0b7a4b;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

button:hover {
  background: #095f3b;
}
</style>
