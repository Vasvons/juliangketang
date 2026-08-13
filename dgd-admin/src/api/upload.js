import axios from 'axios'
import Cookies from 'js-cookie'

const TOKEN_KEY = 'dgd_admin_token'
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/admin'

export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)

  return axios.post(`${baseURL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${Cookies.get(TOKEN_KEY) || ''}`
    }
  })
}
