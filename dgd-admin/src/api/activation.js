import request from './request'

export const getActivationCodeList = (params) => {
  return request.get('/activation-codes', { params })
}

export const generateActivationCodes = (data) => {
  return request.post('/activation-codes/generate', data)
}

export const deleteActivationCode = (id) => {
  return request.delete(`/activation-codes/${id}`)
}
