import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const router = useRouter()

  function setUser(loggedUser) {
    user.value = loggedUser
  }

  function logout() {
    user.value = null
    router.push('/')
  }

  function hasRole(role) {
    return user.value?.role === role
  }

  const isLogged = computed(() => user.value !== null)

  const isAdmin = computed(() => hasRole('admin'))
  const isRecepcionista = computed(() => hasRole('recepcionista'))
  const isInstrutor = computed(() => hasRole('instrutor'))
  const isAluno = computed(() => hasRole('aluno'))
  const isGuest = computed(() => hasRole('guest') || Object.keys(user.value || {}).length === 0)

  return {
    user,
    setUser,
    logout,
    hasRole,
    isLogged,
    isAdmin,
    isRecepcionista,
    isInstrutor,
    isAluno,
    isGuest
  }
})
