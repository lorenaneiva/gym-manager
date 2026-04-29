<script setup>
defineProps({
  label: String,
  tipo: {
    type: String,
    default: 'primary'
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button :class="['btn', tipo, { 'full-width': fullWidth }]">
    <slot>{{ label }}</slot>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: transform 0.1s ease, background-color 0.2s;
  cursor: pointer;
  white-space: nowrap;
}

.full-width {
  width: 100%;
}

.primary { background-color: #42b983; color: white; }
.secondary { background-color: #35495e; color: white; }
.danger { background-color: #e74c3c; color: white; }

button:hover { filter: brightness(0.9); }
button:active { transform: scale(0.96); }
</style>
