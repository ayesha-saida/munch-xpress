import { useEffect } from 'react'
import { textareaClass } from '../../utils/formStyle'


export default function ConfirmOrderAction({
  title, message, confirmLabel, danger = false, showNote = false,
  note = '', onNoteChange, notePlaceholder = '', busy = false,
  onCancel, onConfirm,
}) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) onCancel()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onCancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-action-heading"
      className="fixed inset-0 z-100 overflow-y-auto bg-black/50">

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-xl sm:p-8">

          <h2 id="order-action-heading" className="text-xl font-medium text-gray-900">
            {title}
          </h2>

          <p className="mt-2 text-[13px] leading-4.75 text-gray-600">
            {message}
          </p>

          {showNote && (
            <div className="mt-5 space-y-1">
              <label
                htmlFor="order-action-note"
                className="block text-sm font-medium text-gray-700">
                Message
                <span className="ml-2 text-[12px] font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                id="order-action-note"
                value={note}
                onChange={(event) => onNoteChange(event.target.value)}
                rows={3}
                maxLength={300}
                placeholder={notePlaceholder}
                className={textareaClass(false)}
              />

              <p className="text-[12px] text-gray-500">
                The customer wiil see this on their order.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={`inline-flex h-12 flex-1 items-center justify-center
                rounded-xl px-6 text-sm font-semibold text-white transition
                active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
                  danger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-500 shadow-lg shadow-orange-500/20 hover:bg-orange-600'
                }`}>
              {busy ? 'Saving...' : confirmLabel}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="inline-flex h-12 flex-1 items-center justify-center
                rounded-xl border border-gray-300 bg-white px-6 text-sm
                font-semibold text-gray-700 transition hover:bg-gray-50
                active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
