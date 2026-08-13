import request from './request'

export const getNoticeList = (params) => {
  return request.get('/notices', { params })
}

export const createNotice = (data) => {
  return request.post('/notices', data)
}

export const updateNotice = (id, data) => {
  return request.put(`/notices/${id}`, data)
}

export const deleteNotice = (id) => {
  return request.delete(`/notices/${id}`)
}

export const updateNoticeStatus = (id, data) => {
  return request.put(`/notices/${id}/status`, data)
}
