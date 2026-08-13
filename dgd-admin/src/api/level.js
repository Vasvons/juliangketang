import request from './request'

export const getLevelList = (params) => {
  return request.get('/levels', { params })
}

export const createLevel = (data) => {
  return request.post('/levels', data)
}

export const updateLevel = (id, data) => {
  return request.put(`/levels/${id}`, data)
}

export const deleteLevel = (id) => {
  return request.delete(`/levels/${id}`)
}
