import request from './request'

export const getConfig = () => {
  return request.get('/page-configs')
}

export const updateConfig = (data) => {
  return request.put('/page-configs', data)
}
