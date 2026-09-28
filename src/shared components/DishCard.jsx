import { useContext } from 'react'
import { LuUtensilsCrossed } from 'react-icons/lu'
import { formatPrice } from '../utils/menuCategories'

export default function DishCard({ item }) {
  const addToCart = (e) => {
    const itemName = e.name
    console.log(itemName, 'added to cart')
  }

  return (
    <div className="card bg-base-100 shadow-sm transition hover:shadow-md">

      <figure className="h-44 overflow-hidden bg-base-200">
        {item.imageURL ? (
          <img
            src={item.imageURL}
            alt={item.name}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <LuUtensilsCrossed className="h-9 w-9 opacity-25" />
          </div>
        )}
      </figure>

      <div className="card-body gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-title text-base">{item.name}</h3>
          <span className="font-semibold whitespace-nowrap">{formatPrice(item.price)}</span>
        </div>

        <p className="text-sm opacity-70">{item.restaurantName}</p>

        {/* two lines is enough to tell dishes apart; the rest is noise in a grid */}
        {item.description && (
          <p className="line-clamp-2 text-sm opacity-60">{item.description}</p>
        )}

        <div className="card-actions mt-2 items-center justify-between">
          <span className="badge badge-ghost badge-sm">{item.category}</span>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(item)}
          >
             Add to Cart   
          </button>
          
        </div>
      </div>
    </div>
  )
}