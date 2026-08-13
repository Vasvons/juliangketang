import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'dgd_admin_token'

export const useUserStore = defineStore('user', () => {
  const token = ref(Cookies.get(TOKEN_KEY) || '')
  const userInfo = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  const setToken = (value) => {
    token.value = value
    Cookies.set(TOKEN_KEY, value, { expires: 7 })
  }

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    Cookies.remove(TOKEN_KEY)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout
  }
})
