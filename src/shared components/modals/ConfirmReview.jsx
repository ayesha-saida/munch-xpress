import { useEffect } from "react"
import { textareaClass } from '../../utils/formStyle'

export default function ConfirmReview({ review, note, onNoteChange, busy, onCancel, onConfirm }) {
  const { request, status } = review
  const rejecting = status === 'rejected'
 
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !busy) onCancel()   }    

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [busy, onCancel])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-heading"
      className="fixed inset-0 z-100 overflow-y-auto bg-black/50">

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-[20px] bg-white p-6 shadow-xl sm:p-8">

          <h2 id="review-heading" className="text-xl font-medium text-gray-900">
            {rejecting ? 'Reject this application?' : 'Approve this application?'}
          </h2>

          <p className="mt-2 text-[13px] leading-4.75 text-gray-600">
            {rejecting ? (
              <>
                <span className="font-medium text-gray-800">
                  {request.restaurantName}
                </span>{' '}
                stays a customer account. They will see your note and can apply
                again.
              </>
            ) : (
              <>
                <span className="font-medium text-gray-800">
                  {request.email}
                </span>{' '}
                becomes a seller and{' '}
                <span className="font-medium text-gray-800">
                  {request.restaurantName}
                </span>{' '}
                opens on MunchXpress. This cannot be undone from here.
              </>
            )}
          </p>

          {rejecting && (
            <div className="mt-5 space-y-1">
              <label
                htmlFor="review-note"
                className="block text-sm font-medium text-gray-700">
                Reason
                <span className="ml-2 text-[12px] font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <textarea
                id="review-note"
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="What would they need to change to be approved?"
                className={textareaClass(false)}
              />

              <p className="text-[12px] text-gray-500">
                Shown to the applicant. Leaving it blank tells them only that the
                application was not approved.
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
                  rejecting
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-orange-500 shadow-lg shadow-orange-500/20 hover:bg-orange-600'
                }`}>
              {busy
                ? 'Saving...'
                : rejecting ? 'Reject application' : 'Approve and open restaurant'}
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
