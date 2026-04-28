<script setup>
defineProps({
  label: String,
  tipo: {
    type: String,
    default: 'primary'
  }
})
</script>

<template>
  <button :class="['btn', tipo]">
    {{ label }}
  </button>
</template>

<style scoped>
.btn {
  padding: 10px 10px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  width: 10%;
}
.primary { background-color: #42b983; color: white; }
.secondary { background-color: #35495e; color: white; }
.danger { background-color: #e74c3c; color: white; }
</style>
