<script setup>
import { useUserStore } from '@/stores/user';
//eu usaria oimport ref aqui se não fosse usado o pinia mas como estamos usando pinia que é reativa por padrao, nao vou precisar importar aqui
//@ aponta para a pasta src, onde tem a pasta stores e o arquivo user.js que tem os usuyarios que eu vou usar aquiu
//devo colocar condições para mostrar os links de acordo com o tipo de usuário, se for instrutor, aluno, recepcionista ou admin

const userStore = useUserStore();
//recebe a instância da store, ou seja, quando mudar lá vai mudar aqui, ou seja, é reativo, entao quando o usuario fizer login, a navbar vai mudar automaticamente para mostrar os links de acordo com o tipo de usuário que fez login.
//a partir daqui posso acessar os dados do arquivo e controlar o tipo de navbar que sera exibida.

import {ref} from 'vue';
//isso se refere aop menu toggle do mobile que eu ainda não implementei, mas vou deixar aqui para quando for implementar, para controlar o estado do menu, se ele está aberto ou fechado, e ai eu posso usar isso para mostrar ou esconder o menu quando clicar no botão do mobile
const menuAberto = ref(false);
//vai começar como falso, ou seja, o menu vai estar fechado por padrão

function toggleMenu() {
  menuAberto.value = !menuAberto.value;
}
//abrir menu, muda o estado para diferente do valor que inicialmente era falso.
</script>

<template>
  <nav class="navbar">
    <div class="logo">GymSync</div>

    <button class="mobile-navbar" @click="toggleMenu">
      <div class="risco"></div>
      <div class="risco"></div>
      <div class="risco"></div>
    </button>

    <ul class="menu" :class="{'menu-aberto': menuAberto}">
      <template v-if="!userStore.isLogged">
      <!-- se não tiver logado -->
        <li><RouterLink to="/login">Login</RouterLink></li>
        <li><RouterLink to="/register">Cadastre-se</RouterLink></li>
      </template>
      <!-- se for instrutor -->
      <template v-else-if="userStore.isInstrutor">
        <li><RouterLink to="/cadastrar-treino">Cadastrar treinos</RouterLink></li>
        <li><RouterLink to="/listar-treinos">Gerenciar treinos</RouterLink></li>
        <li><RouterLink to="/perfil">Perfil</RouterLink></li>
        <li><a href="#" @click.prevent="userStore.logout()">Sair</a></li>
        <!-- .prevent evita de recarregar a página quando clicar, e depois disso eu chamo a função da store diretamente -->
      </template>

      <!-- se for convidado -->
      <template v-else-if="userStore.isGuest">
      <li><RouterLink to="/planos">Assinar Plano</RouterLink></li>
      <li><RouterLink to="/perfil">Perfil</RouterLink></li>
      <li><a href="#" @click.prevent="userStore.logout()">Sair</a></li>

      </template>

      <template v-else-if="userStore.isAluno">
      <!-- se for aluno -->
      <li><RouterLink to="/treinos">Meus treinos</RouterLink></li>
      <li><RouterLink to="/perfil">Perfil</RouterLink></li>
      <li><a href="#" @click.prevent="userStore.logout()">Sair</a></li>

      </template>
      <!-- se for recepcionista -->

      <template v-else-if="userStore.isRecepcionista">
        <li><RouterLink to="/agendamentos">Agendamentos</RouterLink></li>
        <li><RouterLink to="/cadastrar-agendamento">Cadastrar Agendamentos</RouterLink></li>
        <li><RouterLink to="/cadastrar-aluno">Registrar Aluno</RouterLink></li>
        <li><RouterLink to="/alunos">Alunos</RouterLink></li>
        <li><a href="#" @click.prevent="userStore.logout()">Sair</a></li>

      </template>
      <template v-else-if="userStore.isAdmin">
      <!-- se for admin -->
      <!-- <li><RouterLink to="# ">Dashboard</RouterLink></li> -->
      <!-- onde vai relatorios, quantidade de aluno e etc etc -->
      <li><RouterLink to="/cadastrar-plano">Cadastrar Plano</RouterLink></li>
      <li><RouterLink to="/cadastrar-funcionario">Cadastrar Funcionários</RouterLink></li>
      <!-- <li><RouterLink to="#">Área do Administrador</RouterLink></li> -->
      <li><a href="#" @click.prevent="userStore.logout()">Sair</a></li>
      </template>
    </ul>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #1E3A5F;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  height: 64px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.logo {
  color: white;
  font-size: 20px;
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
li a, li .router-link-active {
  color: #93C5FD;
  text-decoration: none;
}
a {
  font-family: 'Inter', sans-serif;
  color: #93C5FD;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 15px;
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
    padding: 16px 0;
  }

  .menu-aberto {
    display: flex;
  }

  .menu li {
    padding: 8px 32px;
  }

  .mobile-navbar {
    display: block;
  }
}
</style>
