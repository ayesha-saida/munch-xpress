import { axiosSecure } from './axiosSecure.js'

/* the signed in customer applies, returns the created pending application */
export const applyToBecomeSeller = async (application) => {
  const { data } = await axiosSecure.post('/seller-requests', application)
  return data.request
}

/* the caller's latest application, or null when they have never applied */
export const getMySellerRequest = async () => {
  const { data } = await axiosSecure.get('/seller-requests/me')
  return data.request
}

/* admin only, pass a status to filter down to 'pending' for a review queue */
export const getSellerRequests = async (status) => {
  const { data } = await axiosSecure.get('/seller-requests', {
    params: status ? { status } : undefined,
  })
  return data.requests || []
}

/* admin only, status is 'approved' or 'rejected'. Approving is what promotes
   the account to a seller and creates the restaurant, server side. */
export const reviewSellerRequest = async (id, { status, note = '' }) => {
  const { data } = await axiosSecure.patch(`/seller-requests/${id}`, { status, note })
  return data
}
