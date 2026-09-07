import { axiosSecure } from './axiosSecure.js'

  // The public menu, used by Discover and the home page.
export const getPublicMenuItems = async (params = {}) => { 
  const query = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value != null)
  )

  const { data } = await axiosSecure.get('/menu-items', {
    params: Object.keys(query).length ? query : undefined,
  })

  return data.items || []
}


  // The signed in seller's own menu
export const getMyMenuItems = async () => {
  const { data } = await axiosSecure.get('/menu-items/mine')

  return { items: data.items || [], restaurant: data.restaurant || null }
}

  // seller only, returns the created dish  
export const createMenuItem = async (item) => {
  const { data } = await axiosSecure.post('/menu-items', item)
  return data.item
}

 // seller only. Send only the fields that changed, the server patches partially 
export const updateMenuItem = async (id, patch) => {
  const { data } = await axiosSecure.patch(`/menu-items/${id}`, patch)
  return data.item
}

  /* the hide/show toggle. A hidden dish stays on the seller's list and leaves
    the public menu and everybody's cart */
export const setMenuItemAvailability = (id, available) =>
  updateMenuItem(id, { available })


  // seller only, drops the dish out of every cart holding it, server side  
export const deleteMenuItem = async (id) => {
  const { data } = await axiosSecure.delete(`/menu-items/${id}`)
  return data.item
}
