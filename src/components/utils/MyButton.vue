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
  min-height: 40px;
  padding: 8px 18px;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 650;
  transition: transform 0.1s ease, background-color 0.2s, box-shadow 0.2s;
  cursor: pointer;
  white-space: nowrap;
}

.full-width {
  width: 100%;
}

.primary {
  background-color: var(--brand);
  color: white;
  box-shadow: var(--shadow-button);
}
.secondary { background-color: var(--brand-dark); color: white; }
.danger { background-color: var(--danger-600); color: white; }

button:hover { filter: brightness(0.96); }
button:active { transform: scale(0.96); }
</style>
