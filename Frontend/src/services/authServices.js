import axiosClient from '../api/axiosClient'

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const saveSession = ({ token, user }) => {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem(USER_KEY)
  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    clearSession()
    return null
  }
}

export const login = async (credentials) => {
  const response = await axiosClient.post('/auth/login', credentials)
  return response.data
}

export const register = async (data) => {
  const response = await axiosClient.post('/auth/register', data)
  return response.data
}

export const forgotPassword = async (data) => {
  const response = await axiosClient.post('/auth/forgot-password', data)
  return response.data
}

export const resetPassword = async (data) => {
  const response = await axiosClient.post('/auth/reset-password', data)
  return response.data
}
