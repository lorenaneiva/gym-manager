import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)

  //  const user = ref({
  //  name: 'asddsadsa',
  //  role: 'x' |  varia entre admin, recepcionista e instrutor pra testar.
  // OBS: APAGUE O COMANDO ACIMA DESSE: "const user = ref (null)".
  //})

  function setUser(loggedUser) {
    user.value = loggedUser
  }

  function logout() {
    user.value = null
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
