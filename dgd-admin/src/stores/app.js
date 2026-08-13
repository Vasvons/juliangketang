import { defineStore } from 'pinia'
import { ref } from 'vue'
import pinia from './index'

const useAppStoreDef = defineStore('app', () => {
  const sidebarCollapsed = ref(false)

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    sidebarCollapsed,
    toggleSidebar
  }
})

export function useAppStore() {
  return useAppStoreDef(pinia)
}

