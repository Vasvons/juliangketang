import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Cookies from 'js-cookie'
import pinia from './index'

const TOKEN_KEY = 'dgd_admin_token'

// 定义 store 工厂
const useUserStoreDef = defineStore('user', () => {
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

// 包装函数：始终传入已创建的 pinia 实例，解决生产构建中
// getActivePinia() 返回 undefined 导致的 "_s" 错误
export function useUserStore() {
  return useUserStoreDef(pinia)
}

