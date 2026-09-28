import { axiosSecure } from './axiosSecure.js'

export const getUsers = async () => {
  const { data } = await axiosSecure.get('/users')
  return data
}

/* admin only, exact email match. Returns the account document. */
export const getUserByEmail = async (email) => {
  const { data } = await axiosSecure.get(`/users/${email}`)
  return data
}

/* admin only, updates a user's role */
export const updateUserRole = async (id, role) => {
  const { data } = await axiosSecure.patch(`/users/${id}/role`, {
    role,
  })
  return data
}
