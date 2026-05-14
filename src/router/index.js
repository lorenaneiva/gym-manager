import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { pinia } from '@/stores/pinia'
import { API_URL } from '@/api'

const AUTH_ROLES = ['admin', 'recepcionista', 'instrutor', 'aluno', 'guest']

function defaultRouteForRole(role) {
  if (['admin', 'recepcionista', 'instrutor'].includes(role)) {
    return '/funcionario'
  }

  if (role === 'guest') {
    return '/planos'
  }

  return '/'
}

async function refreshSession(userStore) {
  const storedUser = userStore.user

  if (!storedUser?.id || !AUTH_ROLES.includes(storedUser?.role)) {
    userStore.clearUser()
    return null
  }

  try {
    const response = await axios.get(`${API_URL}/users/${storedUser.id}`)
    const freshUser = response.data

    if (!AUTH_ROLES.includes(freshUser?.role)) {
      userStore.clearUser()
      return null
    }

    userStore.setUser(freshUser)
    return freshUser
  } catch {
    userStore.clearUser()
    return null
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // GUESTS E ALUNOS
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: { publicOnly: true },
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: { publicOnly: true },
      component: () => import('../views/usuario/guest/RegisterView.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      meta: { requiresAuth: true },
      component: () => import('../views/usuario/aluno/PerfilView.vue')
    },
    {
      path: '/planos',
      name: 'planos',
      meta: { requiresAuth: false, roles: ['guest', 'aluno', 'admin'] },
      component: () => import('../views/usuario/guest/EscolherPlanoView.vue')
    },
    {
      path: '/assinar-plano/:id',
      name: 'assinar-plano',
      meta: { requiresAuth: true, roles: ['guest', 'aluno'] },
      component: () => import('../views/usuario/aluno/AssinarPlanoView.vue')
    },
    {
      path: '/treinos',
      name: 'treinos',
      meta: { requiresAuth: true, roles: ['aluno', 'admin'] },
      component: () => import('../views/usuario/aluno/TreinosView.vue')
    },

    // FUNCIONARIOS
    {
      path: '/funcionario',
      name: 'funcionario',
      meta: { requiresAuth: true, roles: ['admin', 'recepcionista', 'instrutor'] },
      component: () => import('../views/funcionario/FuncionarioHomeView.vue')
    },
    // ADMIN
    {
      path: '/cadastrar-funcionario',
      name: 'cadastrar-funcionario',
      meta: { requiresAuth: true, roles: ['admin'] },
      component: () => import('../views/funcionario/admin/CadastrarFuncionarioView.vue')
    },
    {
      path: '/cadastrar-plano',
      name: 'cadastrar-plano',
      meta: { requiresAuth: true, roles: ['admin'] },
      component: () => import('../views/funcionario/admin/CadastrarPlanoView.vue')
    },
    // INSTRUTOR
    {
      path: '/cadastrar-treino',
      name: 'cadastrar-treino',
      meta: { requiresAuth: true, roles: ['instrutor', 'admin'] },
      component: () => import('../views/funcionario/instrutor/CadastrarTreinoView.vue')
    },
    {
      path: '/listar-treinos',
      name: 'listar-treinos',
      meta: { requiresAuth: true, roles: ['instrutor', 'admin'] },
      component: () => import('../views/funcionario/instrutor/ListarTreinosView.vue')
    },
    {
      path: '/atualizar-treino/:id',
      name: 'atualizar-treino',
      meta: { requiresAuth: true, roles: ['instrutor', 'admin'] },
      component: () => import('../views/funcionario/instrutor/AtualizarTreinoView.vue')
    },
    // RECEPCIONISTA
    {
      path: '/cadastrar-aluno',
      name: 'cadastrar-aluno',
      meta: { requiresAuth: true, roles: ['recepcionista', 'admin'] },
      component: () => import('../views/funcionario/recepcionista/CadastrarAlunoView.vue')
    },
    {
      path: '/cadastrar-aluno/:id',
      name: 'editar-aluno',
      meta: { requiresAuth: true, roles: ['recepcionista', 'admin'] },
      component: () => import('../views/funcionario/recepcionista/CadastrarAlunoView.vue')
    },
    {
      path: '/alunos',
      name: 'alunos',
      meta: { requiresAuth: true, roles: ['recepcionista', 'instrutor', 'admin'] },
      component: () => import('../views/funcionario/recepcionista/Alunos.vue')
    },
    {
      path: '/agendamentos',
      name: 'agendamentos',
      meta: { requiresAuth: true, roles: ['admin','recepcionista'] },
      component: () => import('../views/funcionario/recepcionista/VisualizarAgendamentosView.vue')
    },
    {
      path: '/cadastrar-agendamento',
      name: 'cadastrar-agendamento',
      meta: { requiresAuth: true, roles: ['recepcionista', 'admin'] },
      component: () => import('../components/funcionario/recepcionista/CadastrarAgendamento.vue')
    },
    {
      path: '/acesso-negado',
      name: 'acesso-negado',
      component: () => import('../views/AcessoNegadoView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/'
    },
  ],
})

export default router

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore(pinia)

  const needsSession = to.meta.requiresAuth || to.meta.publicOnly || to.meta.roles?.length
  const currentUser = needsSession && userStore.isLogged
    ? await refreshSession(userStore)
    : userStore.user

  const isAuthenticated = Boolean(currentUser)
  const allowedRoles = to.meta.roles ?? []
  const userRole = currentUser?.role
  const hasRequiredRole = !allowedRoles.length || allowedRoles.includes(userRole)

  if (to.meta.publicOnly && isAuthenticated) {
    next(defaultRouteForRole(userRole))
    return
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  if (allowedRoles.length && isAuthenticated && !hasRequiredRole) {
    next('/acesso-negado')
    return
  }

  next()
})
