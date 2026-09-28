import { axiosSecure } from './axiosSecure.js'

export const confirmMockPayment = async (checkoutId, outcome) => {
  const { data } = await axiosSecure.post(`/payments/mock/${checkoutId}/confirm`, { outcome })
  return data
}

export const getCheckout = async (checkoutId) => {
  const { data } = await axiosSecure.get(`/payments/${checkoutId}`)
  return data
}

export const initiatePayment = async (checkoutId) => {
  const { data } = await axiosSecure.post(`/payments/${checkoutId}/initiate`)
  return data
}
