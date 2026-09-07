import { useEffect, useMemo, useState } from 'react'
import {
  getMyMenuItems,
  createMenuItem,
  updateMenuItem,
  setMenuItemAvailability,
  deleteMenuItem,
} from '../../../api/menuItems'
import { apiErrorMessage } from '../../../api/axiosSecure'
import { menuCategories } from '../../../utils/menuCategories'
import { successToast, errorToast } from '../../../shared components/ToastContainer'
import Loading from '../../../shared components/Loading'

import MenuForm from './Menu Management components/MenuForm'
import MenuFilters from './Menu Management components/MenuFilters'
import MenuItemCard from './Menu Management components/MenuItemCard'
import EmptyMenu from './Menu Management components/EmptyMenu'

export default function MenuManagement() {
  const [items, setItems] = useState([])
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [blocked, setBlocked] = useState('')

  const [editingId, setEditingId] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [busyId, setBusyId] = useState('')

  useEffect(() => {
    loadMenu()
  }, [])

  const loadMenu = async () => {
    try {
      const {
        items: mine,
        restaurant: mineRestaurant,
      } = await getMyMenuItems()

      setItems(mine)
      setRestaurant(mineRestaurant)
    } catch (error) {
      const message = apiErrorMessage(error, 'Could not load your menu')
      const status = error?.response?.status

      if (status === 403 || status === 404) {
        setBlocked(message)
      } else {
        errorToast(message)
      }
    } finally {
      setLoading(false)
    }
  }

  const counts = useMemo(() => ({
    all: items.length,
    live: items.filter(item => item.available !== false).length,
    hidden: items.filter(item => item.available === false).length,
  }), [items])

  const usedCategories = useMemo(() => (
    menuCategories.filter(category =>
      items.some(item => item.category === category)
    )
  ), [items])

  const visibleItems = useMemo(() => (
    categoryFilter
      ? items.filter(item => item.category === categoryFilter)
      : items
  ), [items, categoryFilter])

const handleSave = async (dish) => {
  try {
    if (editingId) {
      const saved = await updateMenuItem(editingId, dish)

      setItems(current =>
        current.map(item =>
          item._id === editingId ? saved : item
        )
      )

      successToast(`${saved.name} updated`)
    } else {
      const created = await createMenuItem(dish)

      setItems(current => [created, ...current])

      successToast(`${created.name} is added to your menu 🍽️`)
    }

    setEditingId('')
  } catch (error) {
    errorToast(apiErrorMessage(error, 'Could not save that dish'))

    throw error
  }
}

  const handleEdit = (item) => {
    setEditingId(item._id)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const handleToggle = async (item) => {
    setBusyId(item._id)

    try {
      const saved = await setMenuItemAvailability(
        item._id,
        item.available === false
      )

      setItems(current =>
        current.map(one =>
          one._id === item._id ? saved : one
        )
      )

      successToast(
        saved.available
          ? `${saved.name} is back on the menu`
          : `${saved.name} is hidden`
      )
    } catch (error) {
      errorToast(apiErrorMessage(error, 'Could not change that dish'))
    } finally {
      setBusyId('')
    }
  }

  const handleDelete = async (item) => {
    const sure = window.confirm(
      `Delete ${item.name}? This cannot be undone.`
    )

    if (!sure) return

    setBusyId(item._id)

    try {
      await deleteMenuItem(item._id)

      setItems(current =>
        current.filter(one => one._id !== item._id)
      )

      if (editingId === item._id) {
        setEditingId('')
      }

      successToast(`${item.name} deleted`)
    } catch (error) {
      errorToast(apiErrorMessage(error, 'Could not delete that dish'))
    } finally {
      setBusyId('')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (blocked) {
    return <EmptyMenu blocked={blocked} />
  }

  return (
    <section className="space-y-5">

      <header>
        <h2 className="text-xl font-medium text-gray-900 sm:text-2xl">
          Menu Management
        </h2>

        <p className="mt-1 text-[13px] text-gray-600">
          {restaurant?.name && `${restaurant.name} • `}
          {counts.all === 0
            ? 'Add your first dish.'
            : `${counts.live} live, ${counts.hidden} hidden.`}
        </p>
      </header>

      <MenuForm
        editingId={editingId}
        items={items}
        onSave={handleSave}
        onCancel={() => setEditingId('')}
      />

      {counts.all === 0 ? (
        <EmptyMenu />
      ) : (
        <>
          <MenuFilters
            categories={usedCategories}
            value={categoryFilter}
            onChange={setCategoryFilter}
            total={counts.all}
          />

          <div className="space-y-4">
            {visibleItems.map(item => (
              <MenuItemCard
                key={item._id}
                item={item}
                busy={busyId === item._id}
                onEdit={handleEdit}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
