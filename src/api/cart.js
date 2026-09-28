import { axiosSecure } from './axiosSecure.js'

const emptyCart = { items: [], subtotal: 0, count: 0, removed: [] }

const toCart = (data) => ({
  items: data?.items || [],
  subtotal: data?.subtotal || 0,
  count: data?.count || 0,
  removed: data?.removed || [],
})

export const getCart = async () => {
  const { data } = await axiosSecure.get('/cart')
  return toCart(data)
}

export const addCartItem = async (menuItemId, quantity = 1) => {
  const { data } = await axiosSecure.post('/cart/items', { menuItemId, quantity })
  return toCart(data)
}

export const setCartItemQuantity = async (menuItemId, quantity) => {
  const { data } = await axiosSecure.patch(`/cart/items/${menuItemId}`, { quantity })
  return toCart(data)
}

export const removeCartItem = async (menuItemId) => {
  const { data } = await axiosSecure.delete(`/cart/items/${menuItemId}`)
  return toCart(data)
}

export const clearCart = async () => {
  const { data } = await axiosSecure.delete('/cart')
  return toCart(data)
}

export { emptyCart }
