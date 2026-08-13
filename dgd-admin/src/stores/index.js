import { createPinia } from 'pinia'

// 导出单例 pinia 实例，确保 main.js 和组件使用同一实例
const pinia = createPinia()

export default pinia

