import axiosClient from '../api/axiosClient'

export const getAll = async () => {
  const response = await axiosClient.get('/sets')
  return response.data
}

export const getById = async (id) => {
  const response = await axiosClient.get(`/sets/${id}`)
  return response.data
}

export const create = async (data) => {
  const response = await axiosClient.post('/sets', data)
  return response.data
}

export const update = async (id, data) => {
  const response = await axiosClient.put(`/sets/${id}`, data)
  return response.data
}

export const remove = async (id) => {
  const response = await axiosClient.delete(`/sets/${id}`)
  return response.data
}

export const bulkDelete = async (ids) => {
  const response = await axiosClient.post('/sets/bulk-delete', { ids })
  return response.data
}

export const exportSets = async () => {
  const response = await axiosClient.get('/sets/export', {
    responseType: 'blob',
  })
  return response.data
}

export const importSets = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axiosClient.post('/sets/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return response.data
}
