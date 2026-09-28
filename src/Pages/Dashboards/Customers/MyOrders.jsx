import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { LuRefreshCw, LuShoppingBag, LuPhone, LuMapPin, LuStickyNote } from 'react-icons/lu'
import { getMyOrders, updateOrderStatus } from '../../../api/orders'
import { apiErrorMessage } from '../../../api/axiosSecure'
import { successToast, errorToast } from '../../../shared components/ToastContainer'
import Loading from '../../../shared components/Loading'
import ConfirmOrderAction from '../../../shared components/modals/confirmOrderAction'
import { formatPrice } from '../../../utils/menuCategories'
import {
  statusLabel, statusBadge, paymentLabel, paymentBadge,
  onDateTime, itemSummary,
} from '../../../utils/orderStatus'

/* the same list the server accepts, minus the ones a customer never picks */
const FILTERS = ['all', 'placed', 'accepted', 'completed', 'rejected', 'cancelled']

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  /* the order and the status being confirmed, or null */
  const [pending, setPending] = useState(null)
  const [busyId, setBusyId] = useState('')

  const [reloadKey, setReloadKey] = useState(0)
  const [loadedKey, setLoadedKey] = useState(-1)

  const loadingOrders = loadedKey !== reloadKey

  useEffect(() => {
    let active = true

    getMyOrders()
      .then((list) => {
        if (!active) return

        setOrders(Array.isArray(list) ? list : [])
        setError('')
      })
      .catch((err) => {
        if (active) setError(apiErrorMessage(err, 'Could not load your orders'))
      })
      .finally(() => {
        if (active) setLoadedKey(reloadKey)
      })

    return () => { active = false }
  }, [reloadKey])

  const counts = useMemo(() => {
    const tally = { all: orders.length }

    for (const order of orders) {
      tally[order.status] = (tally[order.status] || 0) + 1
    }

    return tally
  }, [orders])

  const visible = useMemo(
    () => (filter === 'all' ? orders : orders.filter((order) => order.status === filter)),
    [orders, filter]
  )

  const confirmAction = async () => {
    if (!pending) return

    const { order, status } = pending

    setBusyId(order._id)

    try {
      const updated = await updateOrderStatus(order._id, status)

      setOrders((current) => current.map((item) => (item._id === order._id ? updated : item)))

      successToast(
        status === 'cancelled'
          ? `${order.orderNumber} was cancelled`
          : 'Saved'
      )

      setPending(null)
    } catch (err) {
      errorToast(apiErrorMessage(err, 'Could not update that order'))

      /* a 409 means the order already moved on, so the list is stale */
      if (err?.response?.status === 409 || err?.response?.status === 404) {
        setPending(null)
        setReloadKey((n) => n + 1)
      }
    } finally {
      setBusyId('')
    }
  }

  if (loadingOrders) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <section className="rounded-[20px] bg-white p-6 text-center custom-shadow sm:p-8">
        <h2 className="text-xl font-medium text-gray-900">We couldn't load your orders</h2>

        <p className="mx-auto mt-2 max-w-md text-[13px] leading-4.75 text-gray-600">{error}</p>

        <button
          type="button"
          onClick={() => setReloadKey((n) => n + 1)}
          className="mt-6 inline-flex h-12 items-center justify-center rounded-xl
            bg-orange-500 px-8 text-sm font-semibold text-white transition
            hover:bg-orange-600 active:scale-95">
          Try again
        </button>
      </section>
    )
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium text-gray-900 sm:text-2xl">My orders</h2>

          <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
            {orders.length === 0
              ? 'You have not ordered anything yet.'
              : `${orders.length} ${orders.length === 1 ? 'order' : 'orders'} so far.`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setReloadKey((n) => n + 1)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border
            border-gray-200 bg-white px-4 text-sm font-medium text-gray-700
            transition hover:bg-gray-50 active:scale-95">
          <LuRefreshCw size={16} />
          Refresh
        </button>
      </div>

      {orders.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {FILTERS.filter((value) => value === 'all' || counts[value]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              aria-pressed={filter === value}
              className={`h-10 rounded-lg px-3.5 text-xs font-semibold capitalize
                transition ${
                  filter === value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
              {value} ({counts[value] || 0})
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <div className="rounded-[20px] bg-white p-10 text-center custom-shadow">
          <LuShoppingBag className="mx-auto h-9 w-9 text-gray-300" />

          <p className="mt-3 text-sm text-gray-600">
            {orders.length === 0
              ? 'Your first order will show up here.'
              : `No ${filter} orders.`}
          </p>

          {orders.length === 0 && (
            <Link to="/discover" className="btn btn-primary mt-5">Browse dishes</Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => {
            /* only a placed order is still the customer's to pull out of --
               once the kitchen answers, that is their call to make */
            const canCancel = order.status === 'placed'
            const busy = busyId === order._id

            return (
              <article key={String(order._id)} className="rounded-[20px] bg-white p-5 custom-shadow sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <h3 className="text-[15px] font-semibold text-gray-900">
                        {order.orderNumber}
                      </h3>

                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadge(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>

                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${paymentBadge(order.paymentStatus)}`}>
                        {paymentLabel(order.paymentStatus)}
                      </span>
                    </div>

                    <p className="mt-1 truncate text-[13px] text-gray-600">
                      {order.restaurantName} · {onDateTime(order.placedAt)}
                    </p>
                  </div>

                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>

                <p className="mt-4 text-[13px] leading-5 text-gray-700">
                  {itemSummary(order)}
                </p>

                {/* the kitchen's answer, when there was one */}
                {order.sellerNote && (order.status === 'rejected' || order.status === 'accepted') && (
                  <p className="mt-3 rounded-xl bg-gray-50 p-3 text-[13px] leading-4.75 text-gray-700">
                    {order.restaurantName} said: {order.sellerNote}
                  </p>
                )}

                <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100
                  pt-4 text-[13px] sm:grid-cols-2">

                  <div className="flex min-w-0 gap-2">
                    <LuPhone size={15} className="mt-0.5 shrink-0 text-gray-400" />

                    <dd className="min-w-0 text-gray-700">{order.delivery?.phone}</dd>
                  </div>

                  <div className="flex min-w-0 gap-2">
                    <LuMapPin size={15} className="mt-0.5 shrink-0 text-gray-400" />

                    <dd className="min-w-0 truncate text-gray-700">{order.delivery?.address}</dd>
                  </div>

                  {order.delivery?.note && (
                    <div className="flex min-w-0 gap-2 sm:col-span-2">
                      <LuStickyNote size={15} className="mt-0.5 shrink-0 text-gray-400" />

                      <dd className="min-w-0 text-gray-700">{order.delivery.note}</dd>
                    </div>
                  )}
                </dl>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-500">
                    {formatPrice(order.itemsTotal)} + {formatPrice(order.deliveryFee)} delivery
                    {' · '}
                    {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Paid online'}
                  </p>

                  {canCancel && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => setPending({ order, status: 'cancelled' })}
                      className="inline-flex h-10 items-center justify-center
                        rounded-xl border border-gray-300 bg-white px-4 text-sm
                        font-semibold text-gray-700 transition hover:border-red-300
                        hover:bg-red-50 hover:text-red-700 active:scale-95
                        disabled:cursor-not-allowed disabled:opacity-60">
                      {busy ? 'Cancelling...' : 'Cancel order'}
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {pending && (
        <ConfirmOrderAction
          title="Cancel this order?"
          message={
            `Your order ${pending.order.orderNumber} from ${pending.order.restaurantName} `
            + 'will be withdrawn before the kitchen starts it.'
            + (pending.order.paymentMethod === 'online'
              ? ' Any payment already taken will be refunded.'
              : '')
          }
          confirmLabel="Cancel the order"
          danger
          busy={Boolean(busyId)}
          onCancel={() => setPending(null)}
          onConfirm={confirmAction}
        />
      )}
    </section>
  )
}
