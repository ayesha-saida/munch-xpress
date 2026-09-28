import { axiosSecure } from './axiosSecure.js'

export const createCheckout = async ({ paymentMethod, name, phone, address, note = '' }) => {
  const { data } = await axiosSecure.post('/orders', {
    paymentMethod, name, phone, address, note,
  })
  return data
}

