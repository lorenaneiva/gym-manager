import { createPinia } from 'pinia'

export const pinia = createPinia()
//intancia compartilhada do pinia para ser usada em outros arquivos, fiz isso pra que o router possa usar a store nos guards
