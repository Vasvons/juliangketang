import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  // 部署到 /admin 子路径，让所有静态资源和路由都带上 /admin 前缀
  base: '/admin/',
  plugins: [vue()],
  resolve: {
    // AppData 目录被重定向到 E: 盘（junction），保持符号链接原始路径，
    // 避免 Vite 将模块解析成跨盘相对路径导致 transform 失败、页面空白。
    preserveSymlinks: true,
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
