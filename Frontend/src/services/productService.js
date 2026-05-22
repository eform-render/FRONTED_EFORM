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
