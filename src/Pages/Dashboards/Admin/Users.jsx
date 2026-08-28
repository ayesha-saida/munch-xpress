import { useContext, useEffect, useMemo, useState } from 'react'
import { LuSearch, LuRefreshCw } from 'react-icons/lu'
import { AuthContext } from '../../../context providers/AuthProvider'
import { getUsers } from '../../../api/users.js'
import { apiErrorMessage } from '../../../api/axiosSecure.js'
import Loading from '../../../shared components/Loading'
import userIcon from '../../../assets/user-icon.png'

const ROLES = ['customer', 'seller', 'admin']

const roleBadge = {
  customer: 'bg-gray-100 text-gray-700',
  seller: 'bg-orange-100 text-orange-800',
  admin: 'bg-emerald-100 text-emerald-800',
}

const joinedOn = (value) => {
  if (!value) return '--'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '--'
    : date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
}

export default function Users() {
  const { dbUser } = useContext(AuthContext)

  const [users, setUsers] = useState([])
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  /* bumping this refetches, works as retry and refresh button */
  const [reloadKey, setReloadKey] = useState(0)
  const [loadedKey, setLoadedKey] = useState(-1)

  const loadingUsers = loadedKey !== reloadKey

  // used to fetch users from the backend
  useEffect(() => {
    let active = true

    getUsers()
      .then((list) => {
        if (!active) return

        setUsers(Array.isArray(list) ? list : [])
        setError('')
      })
      .catch((err) => {
        if (active) setError(apiErrorMessage(err, 'Could not load the user list'))
      })
      .finally(() => {
        if (active) setLoadedKey(reloadKey)
      })

    return () => { active = false }
  }, [reloadKey])


  /* counts come off the unfiltered list so the tabs keep their totals */
  const counts = useMemo(() => {
    const tally = { all: users.length, customer: 0, seller: 0, admin: 0 }

    for (const account of users) {
      if (account.role in tally) tally[account.role] += 1
    }

    return tally
  }, [users])

  
const visible = useMemo(() => {
  const term = search.trim().toLowerCase()

  const filteredUsers = users.filter((account) => {
    if (roleFilter !== 'all' && account.role !== roleFilter) return false
    if (!term) return true

    return (
      account.email?.toLowerCase().includes(term) ||
      account.name?.toLowerCase().includes(term)
    )
  })

  // Always put the currently signed-in user first
  const currentUserIndex = filteredUsers.findIndex(
    (account) => account.email === dbUser?.email
  )

  if (currentUserIndex === -1) {
    return filteredUsers
  }

  const currentUser = filteredUsers[currentUserIndex]

  return [
    currentUser,
    ...filteredUsers.filter((_, index) => index !== currentUserIndex),
  ]
}, [users, search, roleFilter, dbUser?.email])


  if (loadingUsers) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <section className="rounded-[20px] bg-white p-6 text-center custom-shadow sm:p-8">
        <h2 className="text-xl font-medium text-gray-900">
          We couldn't load the users
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
            All Users Details
          </h2>

          <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
            {counts.all} {counts.all === 1 ? 'account' : 'accounts'} on
            MunchXpress.
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

      {/* Search and role tabs */}
      <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 custom-shadow
       sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:max-w-xs sm:flex-1">
          <LuSearch
            size={17}
            className="pointer-events-none absolute left-3.5 
            top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            aria-label="Search users by name or email"
            className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50
              pl-10 pr-4 text-sm text-gray-800 outline-none transition
              placeholder:text-gray-400 focus:border-orange-400 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', ...ROLES].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRoleFilter(value)}
              aria-pressed={roleFilter === value}
              className={`h-10 rounded-lg px-3.5 text-xs font-semibold capitalize
                transition ${
                  roleFilter === value
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
          <p className="text-sm text-gray-600">
            No users match that search.
          </p>
        </div>
      ) : (
        <>
          {/* Table, sm and up */}
        <div className="hidden overflow-hidden rounded-[20px] bg-white custom-shadow sm:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide
                       text-gray-500"> Name
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide
                       text-gray-500"> Email
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide
                        text-gray-500"> Role
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wide
                        text-gray-500"> Joined
                </th>
              </tr>
            </thead>

              <tbody>
                {visible.map((account) => (
                  <tr
                    key={account._id || account.email}
                    className="border-b border-gray-50 last:border-0 hover:bg-orange-50/40">

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={account.photoURL || userIcon}
                          alt=""
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />

                        <span className="text-sm font-medium text-gray-800">
                          {account.name || 'No name set'}

                          {/* so an admin can tell which row is their own */}
                          {account.email === dbUser?.email && (
                            <span className="ml-2 text-xs font-normal text-gray-400">
                              you
                            </span>
                          )}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {account.email}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs
                          font-semibold capitalize ${
                            roleBadge[account.role] || 'bg-gray-100 text-gray-700'
                          }`}>
                        {account.role || 'unknown'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {joinedOn(account.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards, below sm is a four column table does not fit a phone */}
          <div className="space-y-3 sm:hidden">
            {visible.map((account) => (
              <div
                key={account._id || account.email}
                className="rounded-[20px] bg-white p-4 custom-shadow">

                <div className="flex items-center gap-3">
                  <img
                    src={account.photoURL || userIcon}
                    alt=""
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-800">
                      {account.name || 'No name set'}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {account.email}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs
                      font-semibold capitalize ${
                        roleBadge[account.role] || 'bg-gray-100 text-gray-700'
                      }`}>
                    {account.role || 'unknown'}
                  </span>
                </div>

                <p className="mt-3 border-t border-gray-50 pt-3 text-xs text-gray-500">
                  Joined {joinedOn(account.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
