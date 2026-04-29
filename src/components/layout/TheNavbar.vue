<script setup>
</script>

<template>
  <nav class="navbar">
    <div class="logo">GymSync</div>

    <button class="mobile-navbar">
      <div class="risco"></div>
      <div class="risco"></div>
      <div class="risco"></div>
    </button>

    <ul class="menu">
      <!-- se não tiver logado -->
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Cadastre-se</a></li>

      <!-- se for instrutor -->
      <li><a href="/cadastrar-treinos">Cadastrar treinos</a></li>
      <li><a href="">Atualizar treinos</a></li>
      <li><a href="">Perfil</a></li>
      <li><a href="">Sair</a></li>

      <!-- se for convidado -->
      <li><a href="">Assinar Plano</a></li>
      <li><a href="">Perfil</a></li>
      <li><a href="">Sair</a></li>

      <!-- se for aluno -->
      <li><a href="">Meus treinos</a></li>
      <li><a href="">Perfil</a></li>
      <li><a href="">Sair</a></li>

      <!-- se for recepcionista -->
      <li><a href="">Agendamentos</a></li>
      <li><a href="">Cadastrar Agendamentos</a></li>
      <li><a href="">Registrar Aluno</a></li>
      <li><a href="/alunos">Alunos</a></li>
      <li><a href="">Sair</a></li>

      <!-- se for admin -->
      <li><a href="">Dashboard</a></li>
      <!-- onde vai relatorios, quantidade de aluno e etc etc -->
      <li><a href="">Cadastrar Plano</a></li>
      <li><a href="">Cadastrar Funcionários</a></li>
      <li><a href="">Área do Administrador</a></li>
      <li><a href="">Sair</a></li>
    </ul>

  </nav>
</template>

<style scoped>
.navbar {
  background-color: #1E3A5F;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.logo {
  color: white;
  font-size: 1.25rem;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.menu {
  display: flex;
  align-items: center;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  font-family: 'Inter', sans-serif;
  color: #93C5FD;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: background-color 0.2s ease, color 0.2s ease;
}


a:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}
.mobile-navbar {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
}
.risco {
  width: 25px;
  height: 3px;
  background-color: white;
  margin: 5px 0;
  display: block;
}
/* aqui é pela responsividade */
@media screen and (max-width: 768px) {
  .menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0;
    width: 100%;
    background-color: #1E3A5F;
    padding: 1rem 0;
  }

  .menu-aberto {
    display: flex;
  }

  .menu li {
    padding: 0.5rem 2rem;
  }

  .mobile-navbar {
    display: block;
  }
}
</style>
