import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import pinia from './stores'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// pinia 必须在 router 之前注册，确保路由守卫和组件 setup 时实例已就绪
app.use(pinia)
app.use(router)
app.use(ElementPlus)

app.mount('#app')
