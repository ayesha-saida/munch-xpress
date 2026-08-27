import { useEffect, useMemo, useState } from 'react'
import {
  LuRefreshCw, LuSearch, LuCheck, LuX, 
  LuPhone, LuMapPin, LuUtensils, LuFileText,
  LuStore } from 'react-icons/lu'
import { getSellerRequests, reviewSellerRequest } from '../../../api/sellerRequest'
import { apiErrorMessage } from '../../../api/axiosSecure'
import { successToast, errorToast } from '../../../shared components/ToastContainer'
import Loading from '../../../shared components/Loading'
import ConfirmReview from '../../../shared components/modals/ConfirmReview'

const STATUSES = ['pending', 'approved', 'rejected']

const statusBadge = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
}
 
const onDate = (value) => {
  if (!value) return '--'

  const date = new Date(value)
  
  return Number.isNaN(date.getTime())
    ? '--'
    : date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
}

export default function SellerRequests() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')

  const [pendingReview, setPendingReview] = useState(null)
  const [note, setNote] = useState('')

  /* id of the application currently being sent, so its buttons can say so */
  const [busyId, setBusyId] = useState('')

  const [reloadKey, setReloadKey] = useState(0)
  const [loadedKey, setLoadedKey] = useState(-1)

  const loadingRequests = loadedKey !== reloadKey

  useEffect(() => {
    let active = true

    getSellerRequests()
      .then((list) => {
        if (!active) return

        setRequests(Array.isArray(list) ? list : [])
        setError('')
      })
      .catch((err) => {
        if (active) setError(apiErrorMessage(err, 'Could not load the applications'))
      })
      .finally(() => {
        if (active) setLoadedKey(reloadKey)
      })

    return () => { active = false }
  }, [reloadKey])


  const counts = useMemo(() => {
    const tally = { all: requests.length, pending: 0, approved: 0, rejected: 0 }

    for (const request of requests) {
      if (request.status in tally) tally[request.status] += 1
    }

    return tally
  }, [requests])


  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()

    return requests.filter((request) => {
      if (statusFilter !== 'all' && request.status !== statusFilter) return false
      if (!term) return true

      return (
        request.email?.toLowerCase().includes(term) ||
        request.restaurantName?.toLowerCase().includes(term)
      )
    })
  }, [requests, search, statusFilter])


  const closeConfirm = () => {
    setPendingReview(null)
    setNote('')
  }

  const handleConfirm = async () => {
    if (!pendingReview) return

    const { request, status } = pendingReview
    const id = request._id

    setBusyId(id)

    try {
      const { request: reviewed } = await reviewSellerRequest(id, { status, note })

      /* the server hands back the updated document,
         instead of refetching the list for one changed row we are patching it  */
      setRequests((current) => current.map(
        (item) => (item._id === id ? reviewed : item)
      ))

      successToast(status === 'approved'
        ? `${request.restaurantName} is now a seller 🎉`
        : `Application from ${request.restaurantName} was rejected`)

      closeConfirm()
    } catch (err) {
      errorToast(apiErrorMessage(err, 'Could not save that decision'))

      // a 404 here means someone else reviewed it first, so the list is stale
      if (err?.response?.status === 404) setReloadKey((n) => n + 1)
    } finally {
      setBusyId('')
    }
  }

  if (loadingRequests) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <section className="rounded-[20px] bg-white p-6 
               text-center custom-shadow sm:p-8">
        <h2 className="text-xl font-medium text-gray-900">
          We couldn't load the applications
        </h2>

        <p className="mx-auto mt-2 max-w-md text-[13px] leading-4.75 text-gray-600">
          {error}
        </p>

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

      {/* Heading */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-medium text-gray-900 sm:text-2xl">
            Seller Applications
          </h2>

          <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
            {counts.pending === 0
              ? 'Nothing is waiting on a review.'
              : `${counts.pending} ${counts.pending === 1 ? 'application is' 
              : 'applications are'} waiting on a review.`}
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

      {/* Search and status tabs */}
      <div className="flex flex-col gap-3 rounded-[20px] bg-white 
          p-4 custom-shadow sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <LuSearch
            size={17}
            className="pointer-events-none absolute
            left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurant or email"
            aria-label="Search applications by restaurant name or email"
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50
              pl-10 pr-4 text-sm text-gray-800 outline-none transition
              placeholder:text-gray-400 focus:border-orange-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[...STATUSES, 'all'].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              aria-pressed={statusFilter === value}
              className={`h-10 rounded-lg px-3.5 text-xs font-semibold capitalize
                transition ${
                  statusFilter === value
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
              {value} ({counts[value]})
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-[20px] bg-white p-10 text-center custom-shadow">
          <LuStore className="mx-auto h-9 w-9 text-gray-300" />

          <p className="mt-3 text-sm text-gray-600">
            {search.trim()
              ? 'No applications match that search.'
              : statusFilter === 'all'
                ? 'Nobody has applied to sell yet.'
                : `No ${statusFilter} applications yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((request) => (
            <article
              key={request._id}
              className="rounded-[20px] bg-white p-5 custom-shadow sm:p-6">

              {/* Identity */}
              <div className="flex items-start gap-4">
                {request.logoURL ? (
                  <img
                    src={request.logoURL}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-xl border border-orange-100
                      bg-white object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center
                    justify-center rounded-xl bg-orange-50">
                    <LuStore className="h-6 w-6 text-orange-600" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-[15px] font-semibold text-gray-900">
                      {request.restaurantName}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize
                         ${statusBadge[request.status] || 'bg-gray-100 text-gray-700'}`}>
                      {request.status}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-[13px] text-gray-600">
                    {request.email}
                  </p>

                  <p className="mt-0.5 text-[12px] text-gray-400">
                    Applied {onDate(request.appliedAt)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <dl className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100
                pt-5 sm:grid-cols-2">

                {[
                  [LuUtensils, 'Cuisine', request.cuisine],
                  [LuPhone, 'Phone', request.phone],
                  [LuMapPin, 'Pickup address', request.address],
                  [LuFileText, 'Trade licence', request.tradeLicense],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex min-w-0 gap-3">
                    <Icon size={16} className="mt-0.5 shrink-0 text-gray-400" />

                    <div className="min-w-0">
                      <dt className="text-[12px] font-medium uppercase
                        tracking-[1px] text-gray-400">
                        {label}
                      </dt>

                      <dd className="mt-0.5 whitespace-pre-line text-sm text-gray-800">
                        {value || <span className="text-gray-400">Not given</span>}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              {request.status === 'pending' ? (
                <div className="mt-5 flex flex-col gap-3 border-t border-gray-100
                  pt-5 sm:flex-row">

                  <button
                    type="button"
                    disabled={Boolean(busyId)}
                    onClick={() => setPendingReview({ request, status: 'approved' })}
                    className="inline-flex h-12 flex-1 items-center justify-center
                      gap-2 rounded-xl bg-orange-500 px-6 text-sm font-semibold
                      text-white shadow-lg shadow-orange-500/20 transition
                      hover:bg-orange-600 active:scale-95
                      disabled:cursor-not-allowed disabled:opacity-60">
                    <LuCheck size={17} />
                    {busyId === request._id ? 'Saving...' : 'Approve'}
                  </button>

                  <button
                    type="button"
                    disabled={Boolean(busyId)}
                    onClick={() => setPendingReview({ request, status: 'rejected' })}
                    className="inline-flex h-12 flex-1 items-center justify-center
                      gap-2 rounded-xl border border-gray-300 bg-white px-6
                      text-sm font-semibold text-gray-700 transition
                      hover:border-red-300 hover:bg-red-50 hover:text-red-700
                      active:scale-95 disabled:cursor-not-allowed
                      disabled:opacity-60">
                    <LuX size={17} />
                    Reject
                  </button>
                </div>
              ) : (
                /* already decided, so show who decided it and what they said */
                <div className="mt-5 border-t border-gray-100 pt-5">
                  <p className="text-[12px] text-gray-500">
                    {request.status === 'approved' ? 'Approved' : 'Rejected'} on
                    {' '}{onDate(request.reviewedAt)}
                    {request.reviewedBy && <> by {request.reviewedBy}</>}
                  </p>

                  {request.note && (
                    <p className="mt-2 rounded-xl bg-gray-50 p-3 text-[13px]
                      leading-4.75 text-gray-700">
                      {request.note}
                    </p>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {pendingReview && (
        <ConfirmReview
          review={pendingReview}
          note={note}
          onNoteChange={setNote}
          busy={Boolean(busyId)}
          onCancel={closeConfirm}
          onConfirm={handleConfirm}
        />
      )}
    </section>
  )
}
