import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { LuStore, LuUtensilsCrossed, LuEyeOff, LuPlus, LuPencil } from 'react-icons/lu'
import { getMyMenuItems } from '../../../api/menuItems.js'
import { apiErrorMessage } from '../../../api/axiosSecure.js'
import Loading from '../../../shared components/Loading.jsx'
import DishCard from '../../../shared components/DishCard.jsx'


const previewCount = 6

export default function Restaurant() {
  const [items, setItems] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [error, setError] = useState('')

  const [reloadKey, setReloadKey] = useState(0)
  const [loadedKey, setLoadedKey] = useState(-1)

  const loading = loadedKey !== reloadKey

  useEffect(() => {
    let active = true

    getMyMenuItems()
      .then(({ items: mine, restaurant: mineRestaurant }) => {
        if (!active) return

        setItems(mine)
        setRestaurant(mineRestaurant)
        setError('')
      })
      .catch((err) => {
        if (active) setError(apiErrorMessage(err, 'Could not load your restaurant'))
      })
      .finally(() => {
        if (active) setLoadedKey(reloadKey)
      })

    return () => { active = false }
  }, [reloadKey])

  const counts = useMemo(() => ({
    all: items.length,
    live: items.filter((item) => item.available !== false).length,
    hidden: items.filter((item) => item.available === false).length,
  }), [items])

  /* the live ones, since the previews are the customer's view and a hidden dish
     is not part of that -- items already arrives newest first */
  const previews = useMemo(() => (
    items.filter((item) => item.available !== false).slice(0, previewCount)
  ), [items])

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loading />
      </div>
    )
  }

  /*
     where an admin lands: sellerOnly, 'admins do not own a
    restaurant'.
  */
  if (error) {
    return (
      <section className="rounded-[20px] bg-white p-6 text-center custom-shadow sm:p-8">
        <h2 className="text-xl font-medium text-gray-900">
          We couldn't load your restaurant
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

      {/* Identity, laid out like the application card in SellerRequests */}
      <div className="rounded-[20px] bg-white p-5 custom-shadow sm:p-6">
        <div className="flex items-start gap-4">
          {restaurant?.logoURL ? (
            <img
              src={restaurant.logoURL}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl border border-orange-100
                bg-white object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center
              rounded-xl bg-orange-50">
              <LuStore className="h-6 w-6 text-orange-600" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-medium text-gray-900">
              {restaurant?.name || 'Your Restaurant'}
            </h2>

            <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
              {restaurant?.cuisine && <>{restaurant.cuisine} &middot; </>}
              {restaurant?.status === 'active'
                ? 'Taking orders'
                : 'Not taking orders right now'}
            </p>
          </div>

          <Link
            to="/dashboard/menu"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl
              bg-orange-500 px-4 text-sm font-semibold text-white transition
              hover:bg-orange-600 active:scale-95">
            {counts.all === 0 ? <LuPlus size={16} /> : <LuPencil size={16} />}
            <span className="hidden sm:inline">
              {counts.all === 0 ? 'Add a dish' : 'Manage menu'}
            </span>
          </Link>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-gray-100 pt-5">
          {[
            [LuUtensilsCrossed, 'Dishes', counts.all],
            [LuPlus, 'Live', counts.live],
            [LuEyeOff, 'Hidden', counts.hidden],
          ].map(([Icon, label, value]) => (
            <div key={label} className="rounded-xl bg-gray-50 p-3">
              <dt className="flex items-center gap-2 text-[12px] font-medium
                uppercase tracking-[1px] text-gray-400">
                <Icon size={14} className="shrink-0" />
                {label}
              </dt>

              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* On the menu */}
      <div className="rounded-[20px] bg-white p-5 custom-shadow sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">
              On the menu right now
            </h3>

            <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
              How these look to every customer on Discover.
            </p>
          </div>

          {counts.live > previewCount && (
            <Link
              to="/dashboard/menu"
              className="text-[13px] font-semibold text-orange-700 hover:underline">
              See all {counts.live}
            </Link>
          )}
        </div>

        {previews.length === 0 ? (
          <div className="mt-5 rounded-xl bg-gray-50 p-10 text-center">
            <LuUtensilsCrossed className="mx-auto h-9 w-9 text-gray-300" />

            <p className="mt-3 text-sm text-gray-600">
              {counts.hidden > 0
                ? 'Everything on your menu is hidden, so customers see nothing yet.'
                : 'Nothing on the menu yet.'}
            </p>

            <Link
              to="/dashboard/menu"
              className="mt-5 inline-flex h-12 items-center justify-center gap-2
                rounded-xl bg-orange-500 px-8 text-sm font-semibold text-white
                transition hover:bg-orange-600 active:scale-95">
              <LuPlus size={17} />
              Add a dish
            </Link>
          </div>
        ) : (
         <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
             {items.map((item) => <DishCard key={item._id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  )
}
