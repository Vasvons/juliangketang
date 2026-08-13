import request from './request'

export const getCategoryList = (params) => {
  return request.get('/categories', { params })
}

export const createCategory = (data) => {
  return request.post('/categories', data)
}

export const updateCategory = (id, data) => {
  return request.put(`/categories/${id}`, data)
}

export const deleteCategory = (id) => {
  return request.delete(`/categories/${id}`)
}

export const updateCategoryStatus = (id, data) => {
  return request.put(`/categories/${id}/status`, data)
}
