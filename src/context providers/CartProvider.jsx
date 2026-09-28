import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthProvider'
import { apiErrorMessage } from '../api/axiosSecure'
import {
    getCart, addCartItem, setCartItemQuantity, removeCartItem, clearCart, emptyCart,
  } from '../api/cart'
import { successToast, errorToast, defaultToast } from '../shared components/ToastContainer'

export const CartContext = createContext(null)

export default function CartProvider({ children }) {
  const { user, loading } = useContext(AuthContext)

  const [cart, setCart] = useState(emptyCart)

  const [cartLoading, setCartLoading] = useState(false)

  const [busyId, setBusyId] = useState('')

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(emptyCart)
      return emptyCart
    }

    setCartLoading(true)

    try {
      const fresh = await getCart()

      setCart(fresh)

      if (fresh.removed.length) {
        defaultToast(
          `${fresh.removed.join(', ')} ${fresh.removed.length === 1 ? 'is' : 'are'} no longer available and left your cart`
        )
      }

      return fresh
    } catch (error) {
      errorToast(apiErrorMessage(error, 'Could not load your cart'))
      return null
    } finally {
      setCartLoading(false)
    }
  }, [user])


  useEffect(() => {
    if (loading) return

    if (!user) {
      setCart(emptyCart)
      return
    }

    let active = true

    setCartLoading(true)

    getCart()
      .then((fresh) => {
        if (!active) return

        setCart(fresh)

        if (fresh.removed.length) {
          defaultToast(
            `${fresh.removed.join(', ')} ${fresh.removed.length === 1 ? 'is' : 'are'} no longer available and left your cart`
          )
        }
      })
      .catch((error) => {
        if (active) errorToast(apiErrorMessage(error, 'Could not load your cart'))
      })
      .finally(() => {
        if (active) setCartLoading(false)
      })

    return () => { active = false }
  
  }, [user?.uid, loading])


  const runOnCart = useCallback(async (menuItemId, action, onDone) => {
    setBusyId(String(menuItemId))

    try {
      const fresh = await action()

      setCart(fresh)
      onDone?.(fresh)

      return fresh
    } catch (error) {
      errorToast(apiErrorMessage(error, 'Could not update your cart'))
      return null
    } finally {
      setBusyId('')
    }
  }, [])


  const addToCart = useCallback((item, quantity = 1) => {
    if (!user) {
      defaultToast('Sign in to start an order')
      return Promise.resolve(null)
    }

    const id = item?._id || item?.menuItemId

    if (!id) return Promise.resolve(null)

    return runOnCart(
      id,
      () => addCartItem(id, quantity),
      () => successToast(`${item.name} added to your cart 🛒`)
    )
  }, [user, runOnCart])

  const setQuantity = useCallback((menuItemId, quantity) => (
    runOnCart(menuItemId, () => setCartItemQuantity(menuItemId, quantity))
  ), [runOnCart])

  const removeItem = useCallback((menuItemId, name) => (
    runOnCart(
      menuItemId,
      () => removeCartItem(menuItemId),
      () => successToast(`${name || 'Item'} removed from your cart`)
    )
  ), [runOnCart])

  const emptyTheCart = useCallback(() => (
    runOnCart('all', clearCart, () => successToast('Your cart is empty again'))
  ), [runOnCart])

  const cartInfo = {
    items: cart.items,
    itemCount: cart.count,
    subtotal: cart.subtotal,
    cartLoading,
    busyId,
    addToCart,
    setQuantity,
    removeItem,
    clearCart: emptyTheCart,
    refreshCart,
    /* handy for a card that wants to show "in cart" without scanning items */
    isInCart: (menuItemId) => cart.items.some(
      (item) => String(item.menuItemId) === String(menuItemId)
    ),
  }

  return (
    <CartContext value={cartInfo}>
      {children}
    </CartContext>
  )
}
