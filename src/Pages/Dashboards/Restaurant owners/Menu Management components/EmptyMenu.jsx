import { LuStore, LuUtensilsCrossed } from 'react-icons/lu'

export default function EmptyMenu({ blocked }) {
  return (
    <div className="rounded-[20px] bg-white p-10 text-center custom-shadow">
      {blocked ? (
        <>
          <LuStore className="mx-auto h-9 w-9 text-gray-300" />

          <h2 className="mt-3 text-xl font-medium text-gray-900">
            No menu to manage
          </h2>

          <p className="mx-auto mt-2 max-w-md text-[13px] text-gray-600">
            {blocked}
          </p>
        </>
      ) : (
        <>
          <LuUtensilsCrossed className="mx-auto h-9 w-9 text-gray-300" />

          <p className="mt-3 text-sm text-gray-600">
            No dishes yet — add your first one above.
          </p>
        </>
      )}
    </div>
  )
}
