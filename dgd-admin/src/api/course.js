import request from './request'

export const getCourseList = (params) => {
  return request.get('/courses', { params })
}

export const createCourse = (data) => {
  return request.post('/courses', data)
}

export const updateCourse = (id, data) => {
  return request.put(`/courses/${id}`, data)
}

export const deleteCourse = (id) => {
  return request.delete(`/courses/${id}`)
}

export const updateCourseStatus = (id, data) => {
  return request.put(`/courses/${id}/status`, data)
}
