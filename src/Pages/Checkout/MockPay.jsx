import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { getCheckout, confirmMockPayment } from '../../api/payments'
import { apiErrorMessage } from '../../api/axiosSecure'
import { formatPrice } from '../../utils/menuCategories'
import { AuthContext } from '../../context providers/AuthProvider'
import { errorToast } from '../../shared components/ToastContainer'
import { LuCreditCard, LuShieldCheck } from 'react-icons/lu'

export default function MockPay() {
  const { checkoutId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [checkout, setCheckout] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [busy, setBusy] = useState('')

  useEffect(() => {
    let active = true

    getCheckout(checkoutId)
      .then((data) => { if (active) setCheckout(data) })
      .catch((error) => {
        if (active) setLoadError(apiErrorMessage(error, 'Could not open this payment'))
      })

    return () => { active = false }
  }, [checkoutId])

  const answer = async (outcome) => {
    setBusy(outcome)

    try {
      await confirmMockPayment(checkoutId, outcome)
      navigate(`/checkout/result/${checkoutId}?outcome=${outcome}`, { replace: true })
    } catch (error) {
      errorToast(apiErrorMessage(error, 'Could not record that answer'))
      setBusy('')
    }
  }

  if (loadError) {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Payment could not be opened</h1>
        <p className="mt-2 text-sm opacity-70">{loadError}</p>
        <Link to="/cart" className="btn btn-primary mt-6">Back to cart</Link>
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

  if (checkout.state !== 'awaiting_payment') {
    return (
      <section className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">This payment is no longer open</h1>
        <p className="mt-2 text-sm opacity-70">
          {checkout.state === 'settled'
            ? 'It has already been completed.'
            : 'It was cancelled, so nothing was charged.'}
        </p>
        <Link
          to={`/checkout/result/${checkoutId}?outcome=success`}
          className="btn btn-primary mt-6"
        >
          See the result
        </Link>
      </section>
    )
  }

  return (
   <section  className="flex min-h-screen w-full items-center justify-center px-4 pb-8 pt-24">

     <div className="w-full max-w-md rounded-[20px] bg-white p-6 custom-shadow sm:p-8">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
            <LuCreditCard size={22} className="text-orange-600" />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-gray-900">Payment page</h1>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-xs uppercase tracking-[1px] text-gray-400">Amount due</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{formatPrice(checkout.total)}</p>
          <p className="mt-1 text-xs text-gray-500">
            {checkout.orders.length}{' '}
            {checkout.orders.length === 1 ? 'order' : 'orders'} ·{' '}
            {checkout.orders.map((order) => order.restaurantName).join(', ')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => answer('success')}
          disabled={Boolean(busy)}
          className="mt-5 inline-flex h-12 w-full items-center justify-center
            gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white
            shadow-lg shadow-orange-500/20 transition hover:bg-orange-600
            active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy === 'success'
            ? <span className="loading loading-spinner loading-xs" />
            : <LuShieldCheck size={17} />}
          Pay {formatPrice(checkout.total)}
        </button>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => answer('fail')}
            disabled={Boolean(busy)}
            className="inline-flex h-11 items-center justify-center rounded-xl
              border border-gray-300 bg-white px-4 text-sm font-semibold
              text-gray-700 transition hover:border-red-300 hover:bg-red-50
              hover:text-red-700 active:scale-95 disabled:cursor-not-allowed
              disabled:opacity-60"
          >
            {busy === 'fail' ? 'Sending...' : 'Simulate a failed card'}
          </button>

          <button
            type="button"
            onClick={() => answer('cancel')}
            disabled={Boolean(busy)}
            className="inline-flex h-11 items-center justify-center rounded-xl
              border border-gray-300 bg-white px-4 text-sm font-semibold
              text-gray-700 transition hover:bg-gray-50 active:scale-95
              disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === 'cancel' ? 'Cancelling...' : 'Cancel payment'}
          </button>
        </div>

      </div>
    </section>
  )
}
