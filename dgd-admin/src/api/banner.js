import request from './request'

export const getBannerList = (params) => {
  return request.get('/banners', { params })
}

export const createBanner = (data) => {
  return request.post('/banners', data)
}

export const updateBanner = (id, data) => {
  return request.put(`/banners/${id}`, data)
}

export const deleteBanner = (id) => {
  return request.delete(`/banners/${id}`)
}

export const updateBannerStatus = (id, data) => {
  return request.put(`/banners/${id}/status`, data)
}
