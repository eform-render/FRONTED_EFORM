import axiosClient from '../api/axiosClient'

export const getPayments = async () => {
  const response = await axiosClient.get('/payments')
  return response.data
}
