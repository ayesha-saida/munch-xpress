import { Link } from 'react-router'
import { LuUsers, LuClipboardList } from 'react-icons/lu'

const shortcuts = [
  {
    to: '/dashboard/users',
    icon: LuUsers,
    name: 'Users',
    blurb: 'Browse every account, filter by role and search by email.',
  },
  {
    to: '/dashboard/orders',
    icon: LuClipboardList,
    name: 'Orders',
    blurb: 'Orders across the platform.',
  },
]

export default function AdminDashboard() {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-medium text-gray-900 sm:text-2xl">
          Admin Dashboard
        </h2>

        <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
          The seller application queue and platform overview will live here.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {shortcuts.map(({ to, icon: Icon, name, blurb }) => (
          <Link
            key={to}
            to={to}
            className="rounded-[20px] bg-white p-5 custom-shadow transition
              hover:bg-orange-50/50">

            <Icon size={22} className="text-orange-700" />

            <h3 className="mt-3 text-sm font-semibold text-gray-800">{name}</h3>

            <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
              {blurb}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
