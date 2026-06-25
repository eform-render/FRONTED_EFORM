import axiosClient from '../api/axiosClient'

export const getAll = async () => {
  const response = await axiosClient.get('/products')
  return response.data
}

export const getById = async (id) => {
  const response = await axiosClient.get(`/products/${id}`)
  return response.data
}

export const create = async (data) => {
  const response = await axiosClient.post(`/products`, data)
  return response.data
}

export const update = async (id, data) => {
  const response = await axiosClient.put(`/products/${id}`, data)
  return response.data
}

export const remove = async (id) => {
  const response = await axiosClient.delete(`/products/${id}`)
  return response.data
}

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axiosClient.post('/products/images', formData)
  return response.data
}

export const reserve = async (id, qty = 1) => {
  let sessionId = localStorage.getItem('reserveSession')
  if (!sessionId) {
    sessionId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem('reserveSession', sessionId)
  }
  const response = await axiosClient.post(`/products/${id}/reserve`, null, { params: { qty, sessionId } })
  return response.data
}

export const release = async (id, qty = 1) => {
  const sessionId = localStorage.getItem('reserveSession')
  const response = await axiosClient.post(`/products/${id}/release`, null, { params: { qty, sessionId } })
  return response.data
}
