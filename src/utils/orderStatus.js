export const statusLabel = (status) => ({
  awaiting_payment: 'Awaiting payment',
  placed: 'Placed',
  accepted: 'Accepted',
  rejected: 'Rejected',
  completed: 'Completed',
  cancelled: 'Cancelled',
}[status] || status || 'Unknown')

export const statusBadge = (status) => ({
  awaiting_payment: 'bg-amber-100 text-amber-800',
  placed: 'bg-blue-100 text-blue-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-teal-600 text-white',
  cancelled: 'bg-gray-200 text-gray-600',
}[status] || 'bg-gray-100 text-gray-700')

export const paymentLabel = (status) => ({
  unpaid: 'Unpaid',
  pending: 'Payment pending',
  paid: 'Paid',
  failed: 'Payment failed',
  refund_due: 'Refund due',
}[status] || status || 'Unpaid')

export const paymentBadge = (status) => ({
  unpaid: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-700',
  refund_due: 'bg-purple-100 text-purple-800',
}[status] || 'bg-gray-100 text-gray-700')

export const onDate = (value) => {
  if (!value) return '--'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '--'
    : date.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
}

export const onDateTime = (value) => {
  if (!value) return '--'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '--'
    : date.toLocaleString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: '2-digit',
      })
}

/* "2 x Chicken Biryani, 1 x Coke" -- the line summary every card leads with */
export const itemSummary = (order) => (order?.items || [])
  .map((line) => `${line.quantity} × ${line.name}`)
  .join(', ')

export const orderCount = (order) => (order?.items || [])
  .reduce((sum, line) => sum + line.quantity, 0)
