import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useUserStore } from '@/stores/user'
import { pinia } from '@/stores/pinia'

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
      meta: { requiresAuth: false, roles: ['guest'] },
      component: () => import('../views/usuario/guest/EscolherPlanoView.vue')
    },
    {
      path: '/assinar-plano/:id',
      name: 'assinar-plano',
      meta: { requiresAuth: true, roles: ['aluno'] },
      component: () => import('../views/usuario/aluno/AssinarPlanoView.vue')
    
    },
    {
      path: '/treinos',
      name: 'treinos',
      meta: { requiresAuth: true, roles: ['aluno'] },
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
      meta: { requiresAuth: true, roles: ['instrutor'] },
      component: () => import('../views/funcionario/instrutor/CadastrarTreinoView.vue')
    },
    {
      path: '/listar-treinos',
      name: 'listar-treinos',
      meta: { requiresAuth: true, roles: ['instrutor'] },
      component: () => import('../views/funcionario/instrutor/ListarTreinosView.vue')
    },
    {
      path: '/atualizar-treino/:id',
      name: 'atualizar-treino',
      meta: { requiresAuth: true, roles: ['instrutor'] },
      component: () => import('../views/funcionario/instrutor/AtualizarTreinoView.vue')
    },
    // RECEPCIONISTA
    {
      path: '/cadastrar-aluno',
      name: 'cadastrar-aluno',
      meta: { requiresAuth: true, roles: ['recepcionista'] },
      component: () => import('../views/funcionario/recepcionista/CadastrarAlunoView.vue')
    },
    {
      path: '/cadastrar-aluno/:id',
      name: 'editar-aluno',
      meta: { requiresAuth: true, roles: ['recepcionista'] },
      component: () => import('../views/funcionario/recepcionista/CadastrarAlunoView.vue')
    },
    {
      path: '/alunos',
      name: 'alunos',
      meta: { requiresAuth: true, roles: ['recepcionista', 'admin'] },
      component: () => import('../views/funcionario/recepcionista/Alunos.vue')
    },
    {
      path: '/agendamentos',
      name: 'agendamentos',
      meta: { requiresAuth: true, roles: ['recepcionista'] },
      component: () => import('../views/funcionario/recepcionista/VisualizarAgendamentosView.vue')
    },
    {
      path: '/cadastrar-agendamento',
      name: 'cadastrar-agendamento',
      meta: { requiresAuth: true, roles: ['recepcionista'] },
      component: () => import('../views/funcionario/recepcionista/CadastrarAgendamentoView.vue')
    },
    {
      path: '/acesso-negado',
      name: 'acesso-negado',
      component: () => import('../views/AcessoNegadoView.vue')
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const userStore = useUserStore(pinia)

  const isAuthenticated = userStore.isLogged
  const allowedRoles = to.meta.roles ?? []
  const userRole = userStore.user?.role
  const hasRequiredRole = !allowedRoles.length || allowedRoles.includes(userRole)

  if (to.meta.publicOnly && isAuthenticated) {
    next('/')
    return
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  if (to.meta.requiresAuth && !hasRequiredRole) {
    next('/acesso-negado')
    return
  }

  next()
})
