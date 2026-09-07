import React from 'react'

export default function MenuFilters({
  categories,
  value,
  onChange,
  total,
}) {
  if (categories.length <= 1) return null

  return (
    <div className="flex flex-wrap gap-2 rounded-[20px] bg-white p-4 custom-shadow">
      {['', ...categories].map(category => (
        <button
          key={category || 'all'}
          type="button"
          onClick={() => onChange(category)}
          aria-pressed={value === category}
          className={`h-10 rounded-lg px-3.5 text-xs font-semibold ${
            value === category
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category || `All (${total})`}
        </button>
      ))}
    </div>
  )
}
