import { useContext } from 'react'
import { Link, useNavigate } from 'react-router'
import { CartContext } from '../context providers/CartProvider'
import { formatPrice } from '../utils/menuCategories'

export default function Cart() {
  const navigate = useNavigate()

  const {
    items, subtotal, itemCount, cartLoading, busyId,
    setQuantity, removeItem, clearCart,
  } = useContext(CartContext)

  if (cartLoading) {
    return (
      <div className="flex justify-center py-24">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 opacity-70">Pick something from the menu and it will show up here.</p>
        <Link to="/discover" className="btn btn-primary mt-6">Browse dishes</Link>
      </section>
    )
  }

  return (
  <section className="min-h-screen bg-gray-100 px-3 py-4 sm:px-6 sm:py-8">
    <div className="mx-auto max-w-4xl rounded-xl bg-gray-200 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Your cart{" "}
          <span className="text-base font-normal opacity-60">
            ({itemCount})
          </span>
        </h1>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busyId === "all"}
          onClick={clearCart}
        >
          Empty cart
        </button>
      </div>

      <div className="mt-6 divide-y">
        {items.map((line) => {
          const id = String(line.menuItemId)
          const busy = busyId === id

          return (
            <div
              key={id}
              className="
                flex flex-wrap items-center gap-3 py-4
                sm:flex-nowrap sm:gap-4
              "
            >
              <img
                src={line.imageURL}
                alt={line.name}
                className="size-14 shrink-0 rounded object-cover sm:size-16"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{line.name}</p>
                <p className="text-sm opacity-70">
                  {line.restaurantName}
                </p>
                <p className="text-sm opacity-60">
                  {formatPrice(line.price)} each
                </p>
              </div>

              <div className="join order-3 sm:order-none">
                <button
                  type="button"
                  className="btn btn-sm join-item"
                  disabled={busy}
                  onClick={() => setQuantity(id, line.quantity - 1)}
                >
                  −
                </button>

                <span className="btn btn-sm join-item no-animation pointer-events-none">
                  {line.quantity}
                </span>

                <button
                  type="button"
                  className="btn btn-sm join-item"
                  disabled={busy || line.quantity >= 99}
                  onClick={() => setQuantity(id, line.quantity + 1)}
                >
                  +
                </button>
              </div>

              <span className="ml-auto w-auto text-right font-semibold sm:w-24">
                {formatPrice(line.lineTotal)}
              </span>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                disabled={busy}
                onClick={() => removeItem(id, line.name)}
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>

      <div className="mt-8 flex flex-col gap-4 rounded-lg bg-base-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-sm opacity-70">Subtotal</p>
          <p className="text-2xl font-bold">
            {formatPrice(subtotal)}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary w-full sm:w-auto"
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </button>
      </div>
    </div>
  </section>
)

}