import axios from 'axios'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'dgd_admin_token'
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/admin'

const request = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

const getToken = () => {
  return Cookies.get(TOKEN_KEY)
}

const clearToken = () => {
  Cookies.remove(TOKEN_KEY)
}

request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    const { data } = response
    if (data.code !== undefined && data.code !== 0) {
      ElMessage.error(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
    return data
  },
  (error) => {
    const { response } = error
    if (response) {
      const { status, data } = response
      if (status === 401) {
        clearToken()
        window.location.href = '/login'
        ElMessage.error('登录已过期，请重新登录')
      } else {
        ElMessage.error(data?.message || `请求错误: ${status}`)
      }
    } else {
      ElMessage.error('网络异常，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default request
