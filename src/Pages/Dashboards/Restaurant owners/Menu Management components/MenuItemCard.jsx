import { LuUtensilsCrossed, LuPencil, LuTrash2, LuEye, LuEyeOff } from 'react-icons/lu'
import { formatPrice } from '../../../../utils/menuCategories'

export default function MenuItemCard({
  item,
  busy,
  onEdit,
  onToggle,
  onDelete,
}) {

  const hidden = item.available === false

  return (
    <article
      className={`flex flex-col gap-4 rounded-[20px] bg-white p-4
        custom-shadow sm:flex-row sm:p-5
        ${hidden ? 'opacity-75' : ''}`}>
    
      {item.imageURL ? (
        <img
          src={item.imageURL}
          alt=""
          loading="lazy"
          className="h-32 w-full shrink-0 rounded-xl object-cover
            sm:h-24 sm:w-24"
        />
      ) : (
        <div
          className="flex h-32 w-full shrink-0 items-center justify-center
            rounded-xl bg-orange-50 sm:h-24 sm:w-24"
        >
          <LuUtensilsCrossed className="h-6 w-6 text-orange-600" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-[15px] font-semibold text-gray-900">
            {item.name}
          </h3>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">
            {item.category}
          </span>

          {hidden && (
            <span className="rounded-full bg-amber-100 px-2.5 py-1
              text-xs font-semibold text-amber-800">
              Hidden
            </span>
          )}
        </div>

        <p className="mt-1 text-sm font-semibold text-orange-700">
          {formatPrice(item.price)}
        </p>

        <p className="mt-1 text-[13px] text-gray-500">
          {item.quantity} available
        </p>

        {item.description && (
          <p className="mt-1 line-clamp-2 text-[13px] text-gray-600">
            {item.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          disabled={busy}
          className="action-button"
        >
          <LuPencil size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onToggle(item)}
          disabled={busy}
          className="action-button"
        >
          {hidden
            ? <LuEye size={16} />
            : <LuEyeOff size={16} />
          }

          {busy
            ? 'Saving...'
            : hidden
              ? 'Show'
              : 'Hide'}
        </button>

        <button
          type="button"
          onClick={() => onDelete(item)}
          disabled={busy}
          className="delete-button"
          aria-label={`Delete ${item.name}`}
        >
          <LuTrash2 size={16} />
        </button>
      </div>
    </article>
  )
}
