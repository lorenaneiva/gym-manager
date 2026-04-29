<template>
  <main class="access-denied">
    <section class="card">
      <h1>Acesso negado</h1>
      <p>Seu perfil nao tem permissao para acessar esta pagina.</p>
      <RouterLink to="/">Voltar para a pagina inicial</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.access-denied {
  min-height: calc(100vh - 64px);
  display: grid;
  place-items: center;
  padding: 32px;
  background-color: #eff6ff;
}

.card {
  width: min(100%, 480px);
  padding: 32px;
  border-radius: 16px;
  background-color: #ffffff;
  border: 1px solid #bfdbfe;
  text-align: center;
}

h1 {
  margin: 0 0 12px;
  color: #172554;
}

p {
  margin: 0 0 20px;
  color: #1e3a8a;
}

a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
</style>
