const base = 'w-full rounded-xl border px-4 outline-none transition'

const state = (hasError) => (hasError
  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500'
  : 'border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500')

export const inputClass = (hasError) => `${base} h-14 ${state(hasError)}`

export const textareaClass = (hasError) => `${base} resize-none py-3 ${state(hasError)}`
