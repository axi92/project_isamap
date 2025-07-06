import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const auth = ref<any>(null)
  const storedAuth = localStorage.getItem('auth')

  if (storedAuth) {
    try {
      auth.value = JSON.parse(storedAuth)
    } catch (e) {
      console.error('Failed to parse stored auth data:', e)
    }
  }

  function set(data: any) {
    auth.value = data
    localStorage.setItem('auth', JSON.stringify(data))
  }

  function unset() {
    auth.value = null
    localStorage.removeItem('auth')
  }

  return { auth, set, unset }
})