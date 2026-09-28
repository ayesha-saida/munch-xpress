import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useParams, useLocation } from 'react-router'
import { getCheckout, initiatePayment } from '../../api/payments'
import { apiErrorMessage } from '../../api/axiosSecure'
import { CartContext } from '../../context providers/CartProvider'
import { formatPrice } from '../../utils/menuCategories'
import { errorToast } from '../../shared components/ToastContainer'
import { LuCircleCheck, LuCircleX, LuClock, LuRefreshCw } from 'react-icons/lu'

export default function PaymentResult() {
  const { checkoutId } = useParams()
  const { search } = useLocation()
  const { refreshCart } = useContext(CartContext)

  const outcome = new URLSearchParams(search).get('outcome') || ''

  const [checkout, setCheckout] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [retrying, setRetrying] = useState(false)

  const cartRefreshed = useRef(false)

  useEffect(() => {
    let active = true

    getCheckout(checkoutId)
      .then((data) => {
        if (!active) return

        setCheckout(data)
        setLoadError('')
      })
      .catch((error) => {
        if (active) setLoadError(apiErrorMessage(error, 'Could not read this payment'))
      })

    return () => { active = false }
  }, [checkoutId, reloadKey])


  useEffect(() => {
    if (!checkout || checkout.state !== 'awaiting_payment') return undefined

    const timer = setInterval(() => {
      getCheckout(checkoutId)
        .then(setCheckout)
        .catch(() => { })
    }, 2500)

    return () => clearInterval(timer)
  }, [checkout, checkoutId])

 
  useEffect(() => {
    if (!checkout || checkout.state === 'awaiting_payment' || cartRefreshed.current) return

    cartRefreshed.current = true
    refreshCart()
  }, [checkout, refreshCart])

  const retry = async () => {
    setRetrying(true)

    try {
      const { redirectUrl } = await initiatePayment(checkoutId)
      window.location.assign(redirectUrl)
    } catch (error) {
      errorToast(apiErrorMessage(error, 'Could not start the payment again'))
      setRetrying(false)
    }
  }

  if (loadError) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">We couldn't read that payment</h1>
        <p className="mt-2 text-sm opacity-70">{loadError}</p>
        <button
          type="button"
          onClick={() => { setLoadError(''); setReloadKey((n) => n + 1) }}
          className="btn btn-primary mt-6"
        >
          Try again
        </button>
      </section>
    )
  }

  if (!checkout) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  const isCod = checkout.paymentMethod === 'cod'
  const settled = checkout.state === 'settled'
  const released = checkout.state === 'released'

  const heading = settled
    ? isCod ? 'Order placed' : 'Payment received'
    : released
      ? 'Payment cancelled'
      : outcome === 'mismatch'
        ? 'Payment could not be verified'
        : outcome === 'fail'
          ? 'Payment failed'
          : 'Waiting for payment'

  const Icon = settled ? LuCircleCheck : released ? LuClock : LuCircleX

  const tone = settled
    ? 'text-emerald-600'
    : released
      ? 'text-gray-500'
      : 'text-red-500'

  return (
    <section className="mx-auto max-w-2xl p-5">
      <div className="rounded-[20px] bg-white p-6 text-center custom-shadow sm:p-8">
        <Icon size={54} className={`mx-auto ${tone}`} />

        <h1 className="mt-4 text-2xl font-bold text-gray-900">{heading}</h1>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
          {settled
            ? isCod
              ? 'Your order is with the restaurant. Pay in cash when it reaches you.'
              : `We received your ${formatPrice(checkout.total)}. The restaurants are starting on it now.`
            : released
              ? 'Nothing was charged, and your cart is still waiting if you want to try again.'
              : outcome === 'mismatch'
                ? 'The amount the bank reported does not match this order, so it was not accepted. Nothing has been charged.'
                : 'No money was taken. You can try the payment again whenever you are ready.'}
        </p>

        <div className="mt-6 space-y-3 text-left">
          {checkout.orders.map((order) => (
            <div
              key={String(order._id)}
              className="flex flex-wrap items-center justify-between gap-3
                rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800">
                  {order.orderNumber} · {order.restaurantName}
                </p>

              </div>

              <div className="items-center">
                <span className="text-sm font-semibold text-gray-800">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row-reverse">
          {checkout.state === 'awaiting_payment' && (
            <button
              type="button"
              onClick={retry}
              disabled={retrying}
              className="inline-flex h-12 flex-1 items-center justify-center
                gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold
                text-white shadow-lg shadow-orange-500/20 transition
                hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed
                disabled:opacity-60"
            >
              {retrying
                ? 'Opening...'
                : <><LuRefreshCw size={16} /> Try the payment again</>}
            </button>
          )}

          {released && (
            <Link
              to="/checkout"
              className="inline-flex h-12 flex-1 items-center justify-center
                rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white
                shadow-lg shadow-orange-500/20 transition hover:bg-orange-600
                active:scale-95">
              Back to checkout
            </Link>
          )}

          <Link
            to="/dashboard/my-orders"
            className="inline-flex h-12 flex-1 items-center justify-center
              rounded-xl border border-gray-300 bg-white px-6 text-sm
              font-semibold text-gray-700 transition hover:bg-gray-50
              active:scale-95">
            Track my orders
          </Link>

          <Link
            to="/discover"
            className="inline-flex h-12 flex-1 items-center justify-center
              rounded-xl border border-gray-300 bg-white px-6 text-sm
              font-semibold text-gray-700 transition hover:bg-gray-50
              active:scale-95">
            Keep browsing
          </Link>
        </div>
      </div>
    </section>
  )
}
