import React from 'react'

export default function FieldError({ error }) {
  if (!error) return null

  return (
    <p className="text-[12px] font-medium text-red-600">
      {error.message}
    </p>
  )
}
