import axios from 'axios'

export const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://api-eform.onrender.com'

const axiosClient = axios.create({
  baseURL: API_URL,
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default axiosClient
