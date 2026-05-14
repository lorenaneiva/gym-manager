<script setup>

</script>

<template>
  <div class="AppCard">
    <slot></slot>
  </div>
</template>

<style scoped>
.AppCard {
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-lg);
  padding: 24px;
  margin: 0;
  background: var(--surface);
  box-shadow: var(--shadow-soft);
}

</style>
