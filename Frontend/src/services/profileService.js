import axiosClient from '../api/axiosClient'

export const updateProfile = async (data) => {
  const response = await axiosClient.put('/users/profile', data)
  return response.data
}

export const changePassword = async (data) => {
  const response = await axiosClient.post('/users/change-password', data)
  return response.data
}

export const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const response = await axiosClient.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data
}
