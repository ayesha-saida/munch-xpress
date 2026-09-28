import { useEffect, useMemo, useState } from 'react'
import { LuRefreshCw, LuSearch, LuReceipt, LuCreditCard, LuUndo2 } from 'react-icons/lu'
import { getAllOrders } from '../../../api/orders'
import { apiErrorMessage } from '../../../api/axiosSecure'
import Loading from '../../../shared components/Loading'
import { formatPrice } from '../../../utils/menuCategories'
import { paymentLabel, paymentBadge, onDateTime } from '../../../utils/orderStatus'

/* how the money on an order can be doing -- the server's paymentStatuses */
const FILTERS = ['all', 'paid', 'pending', 'refund_due', 'unpaid', 'failed']

const hasPayment = (order) => order.paymentMethod === 'online'
  || (order.paymentStatus && order.paymentStatus !== 'unpaid')


export default function Transactions() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const [reloadKey, setReloadKey] = useState(0)
  const [loadedKey, setLoadedKey] = useState(-1)

  const loadingOrders = loadedKey !== reloadKey

  useEffect(() => {
    let active = true

    getAllOrders()
      .then((list) => {
        if (!active) return

        /* cash orders with nothing collected are not transactions */
        setOrders((Array.isArray(list) ? list : []).filter(hasPayment))
        setError('')
      })
      .catch((err) => {
        if (active) setError(apiErrorMessage(err, 'Could not load the transactions'))
      })
      .finally(() => {
        if (active) setLoadedKey(reloadKey)
      })

    return () => { active = false }
  }, [reloadKey])

  const counts = useMemo(() => {
    const tally = { all: orders.length }

    for (const order of orders) {
      tally[order.paymentStatus] = (tally[order.paymentStatus] || 0) + 1
    }

    return tally
  }, [orders])

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()

    return orders.filter((order) => {
      if (filter !== 'all' && order.paymentStatus !== filter) return false
      if (!term) return true

      return (
        order.orderNumber?.toLowerCase().includes(term) ||
        order.customerEmail?.toLowerCase().includes(term) ||
        order.payment?.transactionId?.toLowerCase().includes(term)
      )
    })
  }, [orders, search, filter])

  const owed = useMemo(
    () => orders
      .filter((order) => order.paymentStatus === 'refund_due')
      .reduce((sum, order) => sum + (order.total || 0), 0),
    [orders]
  )

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
        <h2 className="text-xl font-medium text-gray-900">We couldn't load the transactions</h2>

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
          <h2 className="text-xl font-medium text-gray-900 sm:text-2xl">Transactions</h2>

          <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
            {owed > 0
              ? `${formatPrice(owed)} is owed back to customers.`
              : 'Payments taken across the platform.'}
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

      {owed > 0 && (
        <div className="flex items-center gap-3 rounded-[20px] bg-purple-50
            p-4 text-purple-800 custom-shadow">
          <LuUndo2 size={20} className="shrink-0" />

          <p className="text-[13px] leading-5">
            Refunds are handled outside MunchXpress for now.
          </p>
        </div>
      )}

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
            placeholder="Search order, customer or transaction"
            aria-label="Search transactions"
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50
              pl-10 pr-4 text-sm text-gray-800 outline-none transition
              placeholder:text-gray-400 focus:border-orange-400 focus:bg-white"
          />
        </div>

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
              {value === 'refund_due' ? 'Refund due' : value} ({counts[value] || 0})
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[20px] bg-white p-10 text-center custom-shadow">
          <LuReceipt className="mx-auto h-9 w-9 text-gray-300" />

          <p className="mt-3 text-sm text-gray-600">
            {search.trim() || filter !== 'all'
              ? 'Nothing matches that.'
              : 'No payments have come through yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((order) => (
            <article
              key={String(order._id)}
              className="flex flex-wrap items-center justify-between gap-4
                rounded-[20px] bg-white p-4 custom-shadow sm:p-5">

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="text-[15px] font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${paymentBadge(order.paymentStatus)}`}>
                    {paymentLabel(order.paymentStatus)}
                  </span>
                </div>

                <p className="mt-1 truncate text-[13px] text-gray-600">
                  {order.customerEmail} · {order.restaurantName}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  {onDateTime(order.placedAt)}
                  {order.payment?.paidAt && ` · settled ${onDateTime(order.payment.paidAt)}`}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900">
                    {formatPrice(order.total)}
                  </p>

                  <p className="flex items-center justify-end gap-1 text-xs text-gray-500">
                    <LuCreditCard size={12} />
                    {order.paymentMethod === 'cod' ? 'Cash on delivery' : 'Online'}
                  </p>
                </div>

                {order.payment?.transactionId && (
                  <div className="hidden text-right sm:block">
                    <p className="text-xs uppercase tracking-[1px] text-gray-400">
                      Transaction
                    </p>

                    <p className="mt-0.5 max-w-40 truncate font-mono text-xs text-gray-600"
                       title={order.payment.transactionId}>
                      {order.payment.transactionId}
                    </p>

                    <p className="text-xs capitalize text-gray-400">
                      via {order.payment.provider}
                    </p>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
