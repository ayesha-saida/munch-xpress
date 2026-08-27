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
