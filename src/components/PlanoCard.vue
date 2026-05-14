<template>
  <div class="plano-card">
    <div class="conteudo-card">
      <span class="tag">Plano</span>
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
  id: [Number, String],
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
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--line-blue);
  box-shadow: var(--shadow-soft);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.plano-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px rgba(31, 101, 255, 0.13);
}

.conteudo-card {
  min-height: 310px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tag {
  width: fit-content;
  padding: 6px 12px;
  border-radius: 999px;
  color: var(--brand);
  background: var(--primary-100);
  font-size: 12px;
  font-weight: 650;
}

h3 {
  margin: 0;
  font-size: 22px;
  color: var(--text-strong);
}

.descricao {
  min-height: 64px;
  margin: 0;
  color: var(--text-soft);
  line-height: 1.5;
}

.valor {
  margin: auto 0 0;
  font-size: 32px;
  font-weight: bold;
  color: var(--text-strong);
}

button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--brand);
  color: white;
  font-weight: 650;
  box-shadow: var(--shadow-button);
  cursor: pointer;
}

button:hover {
  background: var(--brand-hover);
}
</style>
