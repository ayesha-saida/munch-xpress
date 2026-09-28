import { axiosSecure } from './axiosSecure.js'

export const createCheckout = async ({ paymentMethod, name, phone, address, note = '' }) => {
  const { data } = await axiosSecure.post('/orders', {
    paymentMethod, name, phone, address, note,
  })
  return data
}


/* the signed in customer's own history, newest first */
export const getMyOrders = async (status) => {
  const { data } = await axiosSecure.get('/orders/mine', {
    params: status ? { status } : undefined,
  })
  return data.orders || []
}


/* the seller's restaurant queue; status 'open' narrows it to what is still
   in play (placed + accepted), which is what the badge counts */
export const getSellerOrders = async (status) => {
  const { data } = await axiosSecure.get('/orders/seller', {
    params: status ? { status } : undefined,
  })
  return data.orders || []
}


/* admin: every order on the platform, optionally narrowed by status and by
   how the money is doing -- that pairing is what the transactions page reads */
export const getAllOrders = async ({ status, paymentStatus } = {}) => {
  const { data } = await axiosSecure.get('/orders/all', {
    params: {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    },
  })
  return data.orders || []
}


/* one order; the server works out from your role how much of it you see */
export const getOrder = async (id) => {
  const { data } = await axiosSecure.get(`/orders/${id}`)
  return data.order
}


/* status is 'accepted' | 'rejected' | 'completed' | 'cancelled'. Which of
   those you are allowed to pick is the server's decision, not this one. */
export const updateOrderStatus = async (id, status, note = '') => {
  const { data } = await axiosSecure.patch(`/orders/${id}/status`, { status, note })
  return data.order
}
