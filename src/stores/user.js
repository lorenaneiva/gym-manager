import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

const VALID_ROLES = ['admin', 'recepcionista', 'instrutor', 'aluno', 'guest']

function getSavedUser() {
  try {
    const savedUser = JSON.parse(localStorage.getItem('fitblue:user'))
    return VALID_ROLES.includes(savedUser?.role) ? savedUser : null
  } catch {
    localStorage.removeItem('fitblue:user')
    return null
  }
}

export const useUserStore = defineStore('user', () => {
  const user = ref(getSavedUser())
  const router = useRouter()

  function setUser(loggedUser) {
    if (!VALID_ROLES.includes(loggedUser?.role)) {
      clearUser()
      return
    }

    user.value = loggedUser
    localStorage.setItem('fitblue:user', JSON.stringify(loggedUser))
  }

  function clearUser() {
    user.value = null
    localStorage.removeItem('fitblue:user')
  }

  function logout() {
    clearUser()
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
  const isGuest = computed(() => hasRole('guest'))

  return {
    user,
    setUser,
    clearUser,
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
