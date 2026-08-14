import request from './request'

export const getUserList = (params) => {
  return request.get('/users', { params })
}

export const updateUserLevel = (id, data) => {
  return request.put(`/users/${id}/level`, data)
}

export const updateUserDemo = (id, data) => {
  return request.put(`/users/${id}/demo`, data)
}
