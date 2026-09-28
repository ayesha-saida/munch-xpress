import { useEffect, useState } from 'react'
import { getRestaurants } from '../api/restaurants.js'
import { getPublicMenuItems } from '../api/menuItems.js'
import { apiErrorMessage } from '../api/axiosSecure.js'
import { menuCategories } from '../utils/menuCategories.js'
import { errorToast } from '../shared components/ToastContainer'
import DishCard from '../shared components/DishCard.jsx'

export default function Discover() {
  const [restaurants, setRestaurants] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const [restaurantId, setRestaurantId] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getRestaurants()
      .then(setRestaurants)
      .catch((error) => errorToast(apiErrorMessage(error, 'Could not load restaurants')))
  }, [])

  useEffect(() => {
    let active = true

    setLoading(true)

    const timer = setTimeout(() => {
      getPublicMenuItems({ restaurantId, category, search })
        .then((fresh) => { if (active) setItems(fresh) })
        .catch((error) => {
          if (active) errorToast(apiErrorMessage(error, 'Could not load the menu'))
        })
        .finally(() => { if (active) setLoading(false) })
    }, search ? 350 : 0)

    return () => { active = false; clearTimeout(timer) }
  }, [restaurantId, category, search])

  const filtered = restaurantId || category || search

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Discover</h1>
      <p className="mt-1 opacity-70">Everything on the menu right now, across every kitchen.</p>

      <div className="mt-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search dishes…"
          className="input input-bordered w-full"
        />

        <select
          value={restaurantId}
          onChange={(event) => setRestaurantId(event.target.value)}
          className="select select-bordered"
        >
          <option value="">All restaurants</option>
          {restaurants.map((one) => (
            <option key={one._id} value={one._id}>{one.name}</option>
          ))}
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="select select-bordered"
        >
          <option value="">All categories</option>
          {menuCategories.map((one) => (
            <option key={one} value={one}>{one}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-medium">Nothing matches that yet</p>
          <p className="mt-1 opacity-60">
            {filtered ? 'Try a broader search or clear a filter.' : 'No kitchens are serving right now.'}
          </p>
        </div>
      ) :  (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => <DishCard key={item._id} item={item} />)}
        </div>
      )}
    </section>
  )
}