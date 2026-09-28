import { useContext, useEffect, useMemo, useState } from 'react'
import { LuRefreshCw, LuSearch, LuShoppingBag, LuPhone, LuCheck, LuX, LuPackageCheck } from 'react-icons/lu'
import { AuthContext } from '../../../context providers/AuthProvider'
import { getSellerOrders, getAllOrders, updateOrderStatus } from '../../../api/orders'
import { apiErrorMessage } from '../../../api/axiosSecure'
import { successToast, errorToast } from '../../../shared components/ToastContainer'
import Loading from '../../../shared components/Loading'
import ConfirmOrderAction from '../../../shared components/modals/ConfirmOrderAction'
import { formatPrice } from '../../../utils/menuCategories'
import {
  statusLabel, statusBadge, paymentLabel, paymentBadge,
  onDateTime, itemSummary, orderCount,
} from '../../../utils/orderStatus'

const FILTERS = ['all', 'open', 'placed', 'accepted', 'completed', 'rejected', 'cancelled']

/* what each transition asks for on the way out */
const ACTIONS = {
  accepted: {
    confirmLabel: 'Accept order',
    title: 'Accept this order?',
    message: 'The customer is told straight away that the kitchen is on it.',
    showNote: true,
    notePlaceholder: 'Anything you would like them to know? (optional)',
    toast: 'accepted',
  },
  rejected: {
    confirmLabel: 'Reject order',
    danger: true,
    title: 'Reject this order?',
    message: 'The customer is told you cannot take it, and any payment already taken becomes a refund owed.',
    showNote: true,
    notePlaceholder: 'Why can you not take it? (optional)',
    toast: 'rejected',
  },
  completed: {
    confirmLabel: 'Mark as delivered',
    title: 'Hand this order over?',
    message: 'This closes the order, and for cash on delivery it records the money as collected.',
    showNote: false,
    toast: 'completed',
  },
  cancelled: {
    confirmLabel: 'Cancel the order',
    danger: true,
    title: 'Cancel this order?',
    message: 'The customer is told, and anything already paid becomes a refund owed.',
    showNote: false,
    toast: 'cancelled',
  },
}


export default function Orders() {
  const { role } = useContext(AuthContext)

  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  /* the transition being confirmed: { order, status } */
  const [pending, setPending] = useState(null)
  const [note, setNote] = useState('')
  const [busyId, setBusyId] = useState('')

  const [reloadKey, setReloadKey] = useState(0)
  const [loadedKey, setLoadedKey] = useState(-1)

  const loadingOrders = loadedKey !== reloadKey
  const isAdmin = role === 'admin'

  useEffect(() => {
    let active = true

    const load = isAdmin ? getAllOrders() : getSellerOrders()

    load
      .then((list) => {
        if (!active) return

        setOrders(Array.isArray(list) ? list : [])
        setError('')
      })
      .catch((err) => {
        if (active) setError(apiErrorMessage(err, 'Could not load the orders'))
      })
      .finally(() => {
        if (active) setLoadedKey(reloadKey)
      })

    return () => { active = false }
  }, [reloadKey, isAdmin])

  const counts = useMemo(() => {
    const tally = { all: orders.length, open: 0 }

    for (const order of orders) {
      tally[order.status] = (tally[order.status] || 0) + 1
      if (order.status === 'placed' || order.status === 'accepted') tally.open += 1
    }

    return tally
  }, [orders])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()

    return orders.filter((order) => {
      if (filter === 'open') {
        if (order.status !== 'placed' && order.status !== 'accepted') return false
      } else if (filter !== 'all' && order.status !== filter) {
        return false
      }

      if (!term) return true

      return (
        order.orderNumber?.toLowerCase().includes(term) ||
        order.customerEmail?.toLowerCase().includes(term) ||
        order.delivery?.name?.toLowerCase().includes(term) ||
        order.restaurantName?.toLowerCase().includes(term)
      )
    })
  }, [orders, search, filter])

  const openAction = (order, status) => {
    setNote('')
    setPending({ order, status })
  }

  const confirmAction = async () => {
    if (!pending) return

    const { order, status } = pending
    const meta = ACTIONS[status]

    setBusyId(order._id)

    try {
      const updated = await updateOrderStatus(order._id, status, note)
      setOrders((current) => current.map((item) => (item._id === order._id ? updated : item)))

      successToast(`${order.orderNumber} was ${meta.toast}`)
      setPending(null)
    } catch (err) {
      errorToast(apiErrorMessage(err, 'Could not save that change'))

      /* a 409 or 404 means somebody else already moved this order, so the
         queue is stale */
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
        <h2 className="text-xl font-medium text-gray-900">We couldn't load the orders</h2>

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
          <h2 className="text-xl font-medium text-gray-900 sm:text-2xl">
            {isAdmin ? 'All orders' : 'Order queue'}
          </h2>

          <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
            {counts.open === 0
              ? 'Nothing is waiting on an answer.'
              : `${counts.open} ${counts.open === 1 ? 'order is' : 'orders are'} still in play.`}
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

      <div className="flex flex-col gap-3 rounded-[20px] bg-white
          p-4 custom-shadow sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <LuSearch
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2
              -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search order, customer or restaurant"
            aria-label="Search orders"
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50
              pl-10 pr-4 text-sm text-gray-800 outline-none transition
              placeholder:text-gray-400 focus:border-orange-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.filter((value) => value === 'all' || value === 'open' || counts[value]).map((value) => (
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
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[20px] bg-white p-10 text-center custom-shadow">
          <LuShoppingBag className="mx-auto h-9 w-9 text-gray-300" />

          <p className="mt-3 text-sm text-gray-600">
            {search.trim()
              ? 'No orders match that search.'
              : filter === 'all'
                ? 'No orders yet.'
                : `No ${filter} orders.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((order) => {
            const busy = busyId === order._id
            const canAccept = !isAdmin && order.status === 'placed'
            const canReject = !isAdmin && order.status === 'placed'
            const canComplete = !isAdmin && order.status === 'accepted'

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

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatPrice(order.total)}
                    </p>

                    <p className="text-xs text-gray-500">
                      {orderCount(order)} {orderCount(order) === 1 ? 'item' : 'items'}
                      {' · '}
                      {order.paymentMethod === 'cod' ? 'Cash' : 'Online'}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-[13px] leading-5 text-gray-700">
                  {itemSummary(order)}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <LuPhone size={14} className="text-gray-400" />
                    {order.delivery?.name} · {order.delivery?.phone}
                  </span>

                  <span className="min-w-0 truncate">{order.delivery?.address}</span>
                </div>

                {order.sellerNote && (order.status === 'rejected' || order.status === 'accepted') && (
                  <p className="mt-3 rounded-xl bg-gray-50 p-3 text-[13px] leading-4.75 text-gray-700">
                    You said: {order.sellerNote}
                  </p>
                )}

                {order.paymentStatus === 'refund_due' && (
                  <p className="mt-3 rounded-xl bg-purple-50 p-3 text-[13px] leading-4.75 text-purple-800">
                    A refund of {formatPrice(order.total)} is owed for this order.
                  </p>
                )}

                {(canAccept || canReject || canComplete) && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-gray-100
                    pt-5 sm:flex-row">
                    {canAccept && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openAction(order, 'accepted')}
                        className="inline-flex h-12 flex-1 items-center justify-center
                          gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold
                          text-white shadow-lg shadow-orange-500/20 transition
                          hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed
                          disabled:opacity-60">
                        <LuCheck size={17} />
                        {busy && pending === null ? 'Saving...' : 'Accept'}
                      </button>
                    )}

                    {canReject && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openAction(order, 'rejected')}
                        className="inline-flex h-12 flex-1 items-center justify-center
                          gap-2 rounded-xl border border-gray-300 bg-white px-6
                          text-sm font-semibold text-gray-700 transition
                          hover:border-red-300 hover:bg-red-50 hover:text-red-700
                          active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
                        <LuX size={17} />
                        Reject
                      </button>
                    )}

                    {canComplete && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => openAction(order, 'completed')}
                        className="inline-flex h-12 flex-1 items-center justify-center
                          gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold
                          text-white transition hover:bg-emerald-700 active:scale-95
                          disabled:cursor-not-allowed disabled:opacity-60">
                        <LuPackageCheck size={17} />
                        Mark as delivered
                      </button>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      {pending && (
        <ConfirmOrderAction
          title={ACTIONS[pending.status].title}
          message={ACTIONS[pending.status].message}
          confirmLabel={ACTIONS[pending.status].confirmLabel}
          danger={Boolean(ACTIONS[pending.status].danger)}
          showNote={ACTIONS[pending.status].showNote}
          notePlaceholder={ACTIONS[pending.status].notePlaceholder}
          note={note}
          onNoteChange={setNote}
          busy={Boolean(busyId)}
          onCancel={() => setPending(null)}
          onConfirm={confirmAction}
        />
      )}
    </section>
  )
}
