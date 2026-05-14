<script setup>
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const route = useRoute()
const menuAberto = ref(false)

const esconderNavbar = computed(() => ['login', 'register'].includes(route.name))

const displayName = computed(() => userStore.user?.name || userStore.user?.login || 'Visitante')
const displayRole = computed(() => {
  const roles = {
    admin: 'Administrador',
    recepcionista: 'Recepção',
    instrutor: 'Instrutor',
    aluno: 'Aluno',
    guest: 'Visitante'
  }

  return roles[userStore.user?.role] || 'Gym Manager'
})

const initials = computed(() => {
  const parts = displayName.value.trim().split(' ').filter(Boolean)
  if (!parts.length) return 'FB'

  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
})

const navLinks = computed(() => {
  if (!userStore.isLogged) {
    return [
      { to: '/', label: 'Planos', icon: '□' },
      { to: '/login', label: 'Login', icon: '↗' },
      { to: '/register', label: 'Cadastro', icon: '+' }
    ]
  }

  if (userStore.isAdmin) {
    return [
      { to: '/funcionario', label: 'Dashboard', icon: '▦' },
      { to: '/alunos', label: 'Usuários', icon: '◌' },
      { to: '/listar-treinos', label: 'Treinos', icon: '⌘' },
      { to: '/agendamentos', label: 'Check-in', icon: '⌁' },
      { to: '/cadastrar-plano', label: 'Planos', icon: '▭' },
      { to: '/cadastrar-funcionario', label: 'Admin', icon: '◇' },
      { to: '/perfil', label: 'Perfil', icon: '○' }
    ]
  }

  if (userStore.isRecepcionista) {
    return [
      { to: '/funcionario', label: 'Dashboard', icon: '▦' },
      { to: '/alunos', label: 'Usuários', icon: '◌' },
      { to: '/agendamentos', label: 'Check-in', icon: '⌁' },
      { to: '/cadastrar-aluno', label: 'Novo aluno', icon: '+' },
      { to: '/perfil', label: 'Perfil', icon: '○' }
    ]
  }

  if (userStore.isInstrutor) {
    return [
      { to: '/funcionario', label: 'Dashboard', icon: '▦' },
      { to: '/alunos', label: 'Alunos', icon: '◌' },
      { to: '/listar-treinos', label: 'Treinos', icon: '⌘' },
      { to: '/cadastrar-treino', label: 'Novo treino', icon: '+' },
      { to: '/perfil', label: 'Perfil', icon: '○' }
    ]
  }

  if (userStore.isAluno) {
    return [
      { to: '/', label: 'Planos', icon: '▭' },
      { to: '/treinos', label: 'Treinos', icon: '⌘' },
      { to: '/perfil', label: 'Perfil', icon: '○' }
    ]
  }

  return [
    { to: '/planos', label: 'Planos', icon: '▭' },
    { to: '/perfil', label: 'Perfil', icon: '○' }
  ]
})

const newAction = computed(() => {
  if (userStore.isAdmin) return { to: '/cadastrar-funcionario', label: 'Novo' }
  if (userStore.isRecepcionista) return { to: '/cadastrar-aluno', label: 'Novo' }
  if (userStore.isInstrutor) return { to: '/cadastrar-treino', label: 'Novo' }
  return null
})

function toggleMenu() {
  menuAberto.value = !menuAberto.value
}

function fecharMenu() {
  menuAberto.value = false
}

function sair() {
  fecharMenu()
  userStore.logout()
}

watch(
  () => route.fullPath,
  () => fecharMenu()
)
</script>

<template>
  <header v-if="!esconderNavbar" class="app-nav">
    <div class="brand">
      <RouterLink to="/" class="brand-link" aria-label="FitBlue">
        <span class="brand-mark">⌁</span>
        <span>
          <strong>FitBlue</strong>
          <small>Gym Manager</small>
        </span>
      </RouterLink>
    </div>

    <nav class="desktop-nav" aria-label="Navegação principal">
      <RouterLink
        v-for="item in navLinks"
        :key="item.to"
        :to="item.to"
        class="nav-item"
      >
        <span>{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="nav-actions">
      <label class="search-box" aria-label="Buscar">
        <span>⌕</span>
        <input type="search" placeholder="Buscar..." />
      </label>

      <button class="icon-button" type="button" aria-label="Notificações">
        ◦
      </button>

      <RouterLink v-if="userStore.isLogged" to="/perfil" class="session-chip" aria-label="Perfil do usuário">
        <span class="avatar compact">{{ initials }}</span>
        <span class="session-text">
          <strong>{{ displayName }}</strong>
          <small>{{ displayRole }}</small>
        </span>
      </RouterLink>

      <RouterLink v-if="newAction" class="new-button" :to="newAction.to">
        <span>+</span>
        {{ newAction.label }}
      </RouterLink>

      <button
        v-if="userStore.isLogged"
        class="logout-desktop"
        type="button"
        aria-label="Sair da conta"
        @click="sair"
      >
        Sair
      </button>

      <RouterLink v-else-if="!userStore.isLogged" to="/login" class="new-button">
        Entrar
      </RouterLink>
    </div>

    <button
      class="mobile-menu-button"
      type="button"
      :aria-expanded="menuAberto"
      aria-label="Abrir menu"
      @click="toggleMenu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>

  <div v-if="!esconderNavbar" class="mobile-overlay" :class="{ aberto: menuAberto }" @click="fecharMenu"></div>

  <aside v-if="!esconderNavbar" class="mobile-sidebar" :class="{ aberto: menuAberto }" aria-label="Menu mobile">
    <div class="sidebar-brand">
      <RouterLink to="/" class="brand-link">
        <span class="brand-mark">⌁</span>
        <span>
          <strong>FitBlue</strong>
          <small>Gym Manager</small>
        </span>
      </RouterLink>
      <button type="button" class="close-button" aria-label="Fechar menu" @click="fecharMenu">×</button>
    </div>

    <nav class="sidebar-menu">
      <RouterLink
        v-for="item in navLinks"
        :key="item.to"
        :to="item.to"
        class="nav-item"
      >
        <span>{{ item.icon }}</span>
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="sidebar-user">
      <span class="avatar">{{ initials }}</span>
      <span>
        <strong>{{ displayName }}</strong>
        <small>{{ displayRole }}</small>
      </span>
    </div>

    <button v-if="userStore.isLogged" type="button" class="logout-button" @click="sair">
      Sair
    </button>
  </aside>
</template>

<style scoped>
.app-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  display: grid;
  grid-template-columns: minmax(132px, auto) minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  height: var(--nav-height);
  padding: 0 clamp(16px, 2vw, 28px);
  border-bottom: 1px solid var(--navbar-border);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--text-strong);
  text-decoration: none;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  color: #fff;
  background: linear-gradient(145deg, #2f82ff, #1757f0);
  box-shadow: var(--shadow-button);
  font-size: 24px;
  line-height: 1;
}

.brand-link strong,
.sidebar-user strong {
  display: block;
  font-size: 18px;
  line-height: 1.1;
  font-weight: 650;
}

.brand-link small,
.sidebar-user small {
  display: block;
  margin-top: 3px;
  color: var(--text-soft);
  font-size: 12px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  min-width: 0;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.desktop-nav::-webkit-scrollbar {
  display: none;
}

.nav-item {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 40px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  color: var(--navbar-text);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.nav-item span {
  color: var(--brand);
  font-size: 16px;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #fff;
  background: var(--brand);
  box-shadow: var(--shadow-button);
}

.nav-item:hover span,
.nav-item.router-link-active span {
  color: #fff;
}

.nav-actions {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.session-chip {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 6px 10px 6px 6px;
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-md);
  background: #fff;
  color: var(--text-strong);
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(31, 101, 255, 0.06);
}

.session-text strong {
  display: block;
  max-width: 112px;
  overflow: hidden;
  color: var(--text-strong);
  font-size: 13px;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-text small {
  display: block;
  margin-top: 3px;
  color: var(--brand);
  font-size: 11px;
}

.search-box {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: clamp(128px, 12vw, 180px);
  flex: 0 1 180px;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--line-blue);
  border-radius: var(--radius-md);
  background: var(--surface-soft);
  color: var(--brand);
}

.search-box input {
  width: 100%;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  padding: 0;
  font-size: 13px;
}

.icon-button,
.mobile-menu-button,
.close-button {
  border: 0;
  background: transparent;
  color: var(--brand);
  cursor: pointer;
}

.icon-button {
  flex: 0 0 auto;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 28px;
}

.new-button,
.logout-button,
.logout-desktop {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 14px;
  border: 0;
  border-radius: var(--radius-md);
  color: #fff;
  background: var(--brand);
  box-shadow: var(--shadow-button);
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.logout-desktop {
  background: var(--brand-dark);
  box-shadow: none;
}

.logout-desktop:hover {
  background: var(--brand-darker);
}

.mobile-menu-button {
  display: none;
  width: 42px;
  height: 42px;
  padding: 10px;
  border-radius: var(--radius-md);
  background: var(--brand);
  box-shadow: var(--shadow-button);
}

.mobile-menu-button span {
  display: block;
  width: 100%;
  height: 2px;
  margin: 4px 0;
  border-radius: 999px;
  background: #fff;
}

.mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0;
  background: rgba(7, 27, 85, 0.36);
  transition: opacity 0.2s ease;
}

.mobile-overlay.aberto {
  pointer-events: auto;
  opacity: 1;
}

.mobile-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  width: min(300px, 86vw);
  padding: 24px 16px;
  background: var(--brand-darker);
  color: #fff;
  transform: translateX(-100%);
  transition: transform 0.24s ease;
}

.mobile-sidebar.aberto {
  transform: translateX(0);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-brand .brand-link,
.sidebar-user {
  color: #fff;
}

.close-button {
  color: #fff;
  font-size: 30px;
}

.sidebar-menu {
  display: grid;
  gap: 8px;
  margin-top: 24px;
}

.sidebar-menu .nav-item {
  justify-content: flex-start;
  color: #cfe0ff;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding: 12px;
  border-radius: var(--radius-md);
  background: rgba(47, 130, 255, 0.18);
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--brand);
  color: #fff;
  font-weight: 700;
}

.avatar.compact {
  width: 32px;
  height: 32px;
  font-size: 12px;
}

.logout-button {
  width: 100%;
  margin-top: 14px;
}

@media (max-width: 1500px) {
  .search-box {
    display: none;
  }
}

@media (max-width: 1320px) {
  .session-text,
  .icon-button {
    display: none;
  }

  .session-chip {
    padding: 6px;
  }
}

@media (max-width: 1180px) {
  .app-nav {
    grid-template-columns: minmax(132px, auto) minmax(0, 1fr) auto;
    gap: 10px;
    padding: 0 20px;
  }

  .nav-item {
    min-height: 38px;
    padding: 0 10px;
    font-size: 13px;
  }

  .new-button,
  .logout-desktop {
    padding: 0 12px;
  }
}

@media (max-width: 1040px) {
  .desktop-nav,
  .nav-actions {
    display: none;
  }

  .app-nav {
    grid-template-columns: 1fr auto;
    height: var(--mobile-top-height);
    padding: 0 16px;
  }

  .mobile-menu-button {
    display: block;
  }
}

@media (max-width: 760px) {
  .brand-link strong {
    font-size: 17px;
  }

  .brand-mark {
    width: 38px;
    height: 38px;
  }
}
</style>
