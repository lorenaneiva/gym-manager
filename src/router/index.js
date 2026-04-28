import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

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
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/usuario/guest/RegisterView.vue')
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: () => import('../views/usuario/aluno/PerfilView.vue')
    },
    {
      path: '/assinar-plano',
      name: 'assinar-plano',
      meta: { requiresAuth: true },
      component: () => import('../views/usuario/aluno/AssinarPlanoView.vue')
    },
    {
      path: '/treinos',
      name: 'treinos',
      component: () => import('../views/usuario/aluno/TreinosView.vue')
    },

    // FUNCIONARIOS
    {
      path: '/funcionario',
      name: 'funcionario',
      component: () => import('../views/funcionario/FuncionarioHomeView.vue')
    },
    // ADMIN
    {
      path: '/cadastrar-funcionario',
      name: 'cadastrar-funcionario',
      component: () => import('../views/funcionario/admin/CadastrarFuncionarioView.vue')
    },
    {
      path: '/cadastrar-plano',
      name: 'cadastrar-plano',
      component: () => import('../views/funcionario/admin/CadastrarPlanoView.vue')
    },
    // INSTRUTOR
    {
      path: '/cadastrar-treino',
      name: 'cadastrar-treino',
      component: () => import('../views/funcionario/instrutor/CadastrarTreinoView.vue')
    },
    {
      path: '/atualizar-treino/:id',
      name: 'atualizar-treino',
      component: () => import('../views/funcionario/instrutor/AtualizarTreinoView.vue')
    },
    // RECEPCIONISTA
    {
      path: '/cadastrar-aluno',
      name: 'cadastrar-aluno',
      component: () => import('../views/funcionario/recepcionista/CadastrarAlunoView.vue')
    },
    {
      path: '/cadastrar-aluno/:id',
      name: 'cadastrar-aluno',
      component: () => import('../views/funcionario/recepcionista/CadastrarAlunoView.vue')
    },
    {
      path: '/alunos',
      name: 'alunos',
      component: () => import('../views/funcionario/recepcionista/Alunos.vue')
    },
    {
      path: '/agendamentos',
      name: 'agendamentos',
      component: () => import('../views/funcionario/recepcionista/VisualizarAgendamentosView.vue')
    },
  ],
})

export default router

 router.beforeEach((to,from,next) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');

    } else {

      next();
      
    }

  });