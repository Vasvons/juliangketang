import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'
import pinia from './index'

const TOKEN_KEY = 'dgd_admin_token'

const useUserStoreInner = defineStore('user', () => {
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

// 绑定 pinia 实例的导出函数，解决生产构建中 getActivePinia() 时序问题
export const useUserStore = () => useUserStoreInner(pinia)
