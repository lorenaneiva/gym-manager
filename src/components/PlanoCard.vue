<template>
  <div class="plano-card">
    <img :src="imagem" :alt="nome" />

    <h3>{{ nome }}</h3>
    <p>{{ descricao }}</p>
    <strong>R$ {{ valor }}</strong>

    <button @click="$emit('assinar', id)">
      Assinar plano
    </button>
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
  padding: 20px;
  border-radius: 10px;
  background: white;
}
</style>