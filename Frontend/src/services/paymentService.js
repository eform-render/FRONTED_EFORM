import axiosClient from '../api/axiosClient'

export const getPayments = async () => {
  const response = await axiosClient.get('/payments')
  return response.data
}

export const deletePayment = async (id) => {
  const response = await axiosClient.delete(`/payments/${id}`)
  return response.data
}

export const deletePayments = async (ids) => {
  // axios.delete with a request body requires `data` property
  const response = await axiosClient.delete('/payments', { data: ids })
  return response.data
}
