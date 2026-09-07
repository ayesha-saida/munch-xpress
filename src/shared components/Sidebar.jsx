import { useContext, useState } from "react";
import {
  LuLayoutDashboard,
  LuUtensilsCrossed,
  LuLogOut,
  LuMenu,
  LuX,
} from "react-icons/lu";

import { FaUsers, FaShoppingCart, FaRegQuestionCircle } from "react-icons/fa";
import { IoSettings } from "react-icons/io5";
import { HiMiniChartBarSquare } from "react-icons/hi2";
import { RiEBike2Fill } from "react-icons/ri";
import { CgFileDocument } from "react-icons/cg";
import { BsCoin } from "react-icons/bs";
import { IoStar } from "react-icons/io5";
import { FaMoneyBills } from "react-icons/fa6";

import { NavLink, useNavigate } from "react-router";
import userIcon from '../assets/user-icon.png'
import { AuthContext } from "../context providers/AuthProvider";
import { successToast, errorToast } from "./ToastContainer";
 
const menuItems = [
  {
    name: "Overview",
    path: "/dashboard",
    icon: LuLayoutDashboard,
  },
  {
    name: "Users role Management",
    path: "/dashboard/seller-requests",
    icon: FaUsers,
    roles: ["admin"],
  },
  {
    name: "Orders",
    path: "/dashboard/orders",
    icon: FaShoppingCart,
  },
  {
    name: "Menu Management",
    path: "/dashboard/all-menu",
    icon: LuUtensilsCrossed,
    roles: ["seller"],
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: HiMiniChartBarSquare,
    roles: ["admin"],
  },
  {
    name: "Delivery",
    path: "/dashboard/delivery",
    icon: RiEBike2Fill,
    roles: ["admin"],
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: IoSettings,
  },
  {
    name: "Reviews",
    path: "/dashboard/reviews",
    icon: IoStar,
  },
  {
    name: "Transactions",
    path: "/dashboard/transactions",
    icon: FaMoneyBills,
  },
  {
    name: "Documents",
    path: "/dashboard/documents",
    icon: CgFileDocument,
  },
  {
    name: "Earnings",
    path: "/dashboard/total-earnings",
    icon: BsCoin,
    roles: ["seller"],
  },
  {
    name: "Help",
    path: "/dashboard/help",
    icon: FaRegQuestionCircle,
  },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const { user, role, logOut } = useContext(AuthContext)
  const navigate = useNavigate()

  const visibleItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  )

  const handleLogOut = () => {
    const userName = user?.displayName || 'User'

    logOut()
      .then(() => {
        successToast(`${userName} you're signing out!`)
        navigate('/login')
      })
      .catch((error) => errorToast(error.message))
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4  z-40 flex h-10 w-10 
        items-center justify-center rounded-lg bg-white
      text-gray-700 shadow-md lg:hidden">
        <LuMenu size={22} />
      </button>

      {/* Overlay - mobile only */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden" />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col bg-white
          shadow-lg transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:shadow-sm
          ${isOpen ? "translate-x-0" : "-translate-x-full"} `}>
        {/* Logo */}
        <div className="flex h-20 items-center justify-between
                        border-b border-gray-100 px-6">

          <div>
            <NavLink to={'/'} className="text-2xl font-extrabold text-orange-800">
              MunchXpress
            </NavLink>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden">
            <LuX size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {visibleItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => `
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition-all

                    ${
                      isActive
                        ? `
                          bg-orange-50
                          text-orange-800
                          border-r-4
                          border-orange-800
                        `
                        : `
                          text-gray-600
                          hover:bg-gray-50
                          hover:text-orange-900
                        `
                    }
                  `}
                >
                  <Icon size={20} />

                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-100 p-4">
          <div className="mb-4 flex items-center gap-3">
            <img
              src={user?.photoURL || userIcon}
              alt={user?.displayName || 'User'}
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-800">
                {user?.displayName || user?.email || 'Your account'}
              </p>

              {/* role is null for a frame while syncUser is in flight */}
              <p className="text-xs capitalize text-gray-500">
                {role || ' '}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogOut}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-lg
              px-4
              py-3
              text-sm
              font-medium
              text-red-500
              transition
              hover:bg-red-50
            "
          >
            <LuLogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}