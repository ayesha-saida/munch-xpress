import { useContext, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthContext } from '../../context providers/AuthProvider'
import { CartContext } from '../../context providers/CartProvider'
import { createCheckout } from '../../api/orders'
import { apiErrorMessage } from '../../api/axiosSecure'
import { formatPrice } from '../../utils/menuCategories'
import {
  getDeliveryDetails, saveDeliveryDetails, isValidPhone,
} from '../../utils/deliveryDetails'
import { inputClass, textareaClass } from '../../utils/formStyle'
import { errorToast, successToast } from '../../shared components/ToastContainer'
import { LuBanknote, LuCreditCard, LuStore } from 'react-icons/lu'

const deliveryFee = 50

export default function Checkout() {
  const { user } = useContext(AuthContext)
  const { items, subtotal, itemCount, cartLoading, refreshCart } = useContext(CartContext)
  const navigate = useNavigate()

  /* the phone and address saved on the profile page, if there are any */
  const saved = getDeliveryDetails(user?.uid)

  const [form, setForm] = useState({
    name: user?.displayName || '',
    phone: saved.phone,
    address: saved.address,
    note: '',
  })

  const [errors, setErrors] = useState({})
  const [method, setMethod] = useState('cod')
  const [placing, setPlacing] = useState(false)

  const restaurantIds = useMemo(
    () => [...new Set(items.map((line) => String(line.restaurantId)))],
    [items]
  )

  const delivery = restaurantIds.length * deliveryFee
  const total = subtotal + delivery

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
    setErrors((current) => ({ ...current, [field]: '' }))
  }

  /* the same rules the server applies, so a mistake is caught while the
     form is still on screen rather than coming back as a toast */
  const validate = () => {
    const next = {}

    if (form.name.trim().length < 2) next.name = 'A name for the delivery is required'

    if (!form.phone.trim()) next.phone = 'Phone number is required'
    else if (!isValidPhone(form.phone)) next.phone = 'Phone number is not a valid number'

    if (form.address.trim().length < 10) next.address = 'Please give a full delivery address'

    setErrors(next)

    return Object.keys(next).length === 0
  }

  const placeOrder = async (event) => {
    event.preventDefault()

    if (!validate()) return

    setPlacing(true)

    try {
      const checkout = await createCheckout({
        paymentMethod: method,
        name: form.name.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        note: form.note.trim(),
      })

      saveDeliveryDetails(user.uid, {
        phone: form.phone.trim(),
        address: form.address.trim(),
      })

      /* the server emptied it for cash; for an online payment the cart is
         only emptied once the money lands, so this keeps both in step */
      await refreshCart()

      if (checkout.redirectUrl) {
        /* the gateway may live on another origin, so the whole document
           moves rather than a client side navigation */
        window.location.assign(checkout.redirectUrl)
        return
      }

      successToast('Order placed 🎉')
      navigate(`/checkout/result/${checkout.checkoutId}?outcome=success`, { replace: true })
    } catch (error) {
      errorToast(apiErrorMessage(error, 'Could not place your order'))

      /* the server pruned lines that are no longer for sale -- show the
         cart it is talking about */
      if (error?.response?.status === 409) refreshCart()
    } finally {
      setPlacing(false)
    }
  }

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
        <h1 className="text-2xl font-bold">Nothing to check out</h1>
        <p className="mt-2 opacity-70">Your cart is empty, so there is no order to place.</p>
        <Link to="/discover" className="btn btn-primary mt-6">Browse dishes</Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Checkout</h1>
        <p className="mt-1 text-sm opacity-70">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} from {restaurantIds.length}{' '}
          {restaurantIds.length === 1 ? 'restaurant' : 'restaurants'}
        </p>
      </div>

      <form onSubmit={placeOrder} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Delivery details */}
        <div className="space-y-6">
          <div className="rounded-[20px] bg-white p-5 custom-shadow sm:p-6">
            <h2 className="text-lg font-semibold">Delivery details</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="checkout-name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
                  id="checkout-name"
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Who is this order for?"
                  className={inputClass(Boolean(errors.name))}
                />

                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="checkout-phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone
                </label>

                <input
                  id="checkout-phone"
                  type="tel"
                  value={form.phone}
                  onChange={update('phone')}
                  placeholder="So the rider can reach you"
                  className={inputClass(Boolean(errors.phone))}
                />

                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="checkout-address" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  id="checkout-address"
                  value={form.address}
                  onChange={update('address')}
                  rows={3}
                  placeholder="House, road, area -- the full delivery address"
                  className={textareaClass(Boolean(errors.address))}
                />

                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="checkout-note" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Note for the kitchen
                  <span className="ml-2 text-xs font-normal text-gray-400">Optional</span>
                </label>

                <textarea
                  id="checkout-note"
                  value={form.note}
                  onChange={update('note')}
                  rows={2}
                  maxLength={300}
                  placeholder="Less spicy, no onions..."
                  className={textareaClass(false)}
                />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="rounded-[20px] bg-white p-5 custom-shadow sm:p-6">
            <h2 className="text-lg font-semibold">How would you like to pay?</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                {
                  value: 'cod',
                  Icon: LuBanknote,
                  title: 'Cash on delivery',
                  blurb: 'Pay the rider when the food arrives.',
                },
                {
                  value: 'online',
                  Icon: LuCreditCard,
                  title: 'Online payment',
                  blurb: 'You will be sent to a payment page to finish.',
                },
              ].map(({ value, Icon, title, blurb }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                    method === value
                      ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={value}
                    checked={method === value}
                    onChange={() => setMethod(value)}
                    className="radio radio-primary mt-0.5"
                  />

                  <span className="min-w-0">
                    <span className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                      <Icon size={16} className="text-orange-600" />
                      {title}
                    </span>

                    <span className="mt-0.5 block text-xs text-gray-500">{blurb}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-[20px] bg-white p-5 custom-shadow lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>

          <div className="mt-4 space-y-4">
            {[...restaurantIds].map((restaurantId) => {
              const lines = items.filter(
                (line) => String(line.restaurantId) === restaurantId
              )

              return (
                <div key={restaurantId}>
                  <p className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700">
                    <LuStore size={14} className="text-orange-600" />
                    {lines[0]?.restaurantName}
                  </p>

                  <div className="mt-2 space-y-1.5">
                    {lines.map((line) => (
                      <div
                        key={String(line.menuItemId)}
                        className="flex justify-between gap-3 text-[13px] text-gray-600"
                      >
                        <span className="min-w-0 truncate">
                          {line.quantity} × {line.name}
                        </span>

                        <span className="shrink-0">{formatPrice(line.lineTotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="divider my-4" />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>

            <div className="flex justify-between text-gray-600">
              <dt>
                Delivery{' '}
                <span className="text-xs text-gray-400">
                  ({restaurantIds.length} × {formatPrice(deliveryFee)})
                </span>
              </dt>
              <dd>{formatPrice(delivery)}</dd>
            </div>

            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            type="submit"
            disabled={placing}
            className="mt-5 inline-flex h-12 w-full items-center justify-center
              rounded-xl bg-orange-500 px-6 text-sm font-semibold text-white
              shadow-lg shadow-orange-500/20 transition hover:bg-orange-600
              active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {placing
              ? 'Placing...'
              : method === 'online'
                ? `Pay ${formatPrice(total)}`
                : `Place order · ${formatPrice(total)}`}
          </button>

          <p className="mt-3 text-center text-xs text-gray-400">
            {method === 'cod'
              ? 'Nothing is charged now -- you pay on delivery.'
              : 'You will complete the payment on the next page.'}
          </p>
        </aside>
      </form>
    </section>
  )
}
