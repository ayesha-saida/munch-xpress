import { useContext, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../../context providers/AuthProvider'
import { applyToBecomeSeller, getMySellerRequest } from '../../../api/sellerRequest'
import { apiErrorMessage } from '../../../api/axiosSecure'
import { errorToast, successToast } from '../../../shared components/ToastContainer'
import Loading from '../../../shared components/Loading'
import FieldError from '../../../shared components/FieldError'
import { inputClass, textareaClass } from '../../../utils/formStyle'
import { uploadImage, validateImage } from '../../../utils/imageUpload'
import { isValidPhone } from '../../../utils/deliveryDetails'
import {
  MdOutlineStorefront, MdOutlineFileUpload, MdOutlineHourglassTop,
  MdOutlineCancel, MdCheckCircleOutline,
} from 'react-icons/md'

const cuisines = [
  'Bangladeshi', 'Indian', 'Chinese', 'Thai', 'Italian', 'Japanese',
  'Middle Eastern', 'Fast Food', 'Desserts', 'Beverages', 'Other',
]

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* shared page chrome, so every state gets the same heading and width */
const Shell = ({ children }) => (
  <main className="min-h-screen bg-gray-50 pt-16 font-sans">
    <section className="mx-auto w-[calc(100%-48px)] max-w-240 py-10 md:py-14">

      <div className="mb-8 sm:mb-10">
        <p className="text-sm font-medium uppercase
          tracking-[1.5px] text-orange-600">
          Partner With Us
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight
          text-gray-900 sm:text-4xl">
          Become a Seller
        </h1>
      </div>

      {children}
    </section>
  </main>
)

export default function BecomeSeller() {
  const { user, loading, role, roleLoading } = useContext(AuthContext)

  const [request, setRequest] = useState(null)
  const [checked, setChecked] = useState(false)
  const [uploading, setUploading] = useState(false)

  /* a signed out visitor has no application to fetch, so nothing is pending for
   them. Deriving this rather than storing it keeps the effect below free of
   any synchronous setState. */
  const checking = Boolean(user) && !checked

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      restaurantName: '', phone: '', address: '', cuisine: '', tradeLicense: '',
    },
  })

  // logo is sent to imgbb when the form is submitted
  const [logoFile, setLogoFile] = useState(null)

  const previewUrl = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : ''),
    [logoFile]
  )

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])


  /* read any earlier application once the user is known */
  useEffect(() => {
    if (loading || !user) return

    let active = true

    getMySellerRequest()
      .then((found) => { if (active) setRequest(found) })
      .catch((error) => {
        if (active) errorToast(apiErrorMessage(error, 'Could not load your application'))
      })
      .finally(() => { if (active) setChecked(true) })

    return () => { active = false }
  }, [user, loading])


  const handlePickLogo = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const problem = validateImage(file)

    if (problem) {
      errorToast(problem)
      e.target.value = ''
      return
    }
    setLogoFile(file)
  }

  const handleApply = async (values) => {
    try {
      let logoURL = ''

      if (logoFile) {
        setUploading(true)
        logoURL = await uploadImage(logoFile)
      }

      const created = await applyToBecomeSeller({ ...values, logoURL })

      setRequest(created)
      setLogoFile(null)
      successToast('Application sent, we will review it shortly 🎉')
    } catch (error) {
      console.log(error)
      errorToast(apiErrorMessage(error, 'Could not send your application'))
    } finally {
      setUploading(false)
    }
  }


  if (loading || roleLoading || checking) {
    return (
      <Shell>
        <div className="flex min-h-75 items-center justify-center">
          <Loading />
        </div>
      </Shell>
    )
  }

  if (!user) {
    return Navigate('/login')
  }

  /* waiting on a review, so the form is deliberately not offered again */
  if (request?.status === 'pending') {
    return (
      <Shell>
        <div className="rounded-[20px] bg-white p-6 custom-shadow sm:p-8">

          <div className="flex items-start gap-4">
            <MdOutlineHourglassTop className="mt-0.5 h-8 w-8 shrink-0 text-orange-600" />

            <div className="min-w-0">
              <h2 className="text-xl font-medium text-gray-900">
                Application under review
              </h2>

              <p className="mt-2 text-[13px] leading-4.75 text-gray-600">
                We received your application on {formatDate(request.appliedAt)}.
                You'll keep ordering as a customer until it's approved, and your
                restaurant dashboard opens up as soon as it is.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 border-t
            border-gray-200 pt-6 sm:grid-cols-2">

            {[
              ['Restaurant', request.restaurantName],
              ['Cuisine', request.cuisine],
              ['Phone', request.phone],
              ['Pickup Address', request.address],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="text-[12px] font-medium uppercase
                  tracking-[1px] text-gray-400">
                  {label}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-gray-800">
                  {value || '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="space-y-6">

        {/* the previous attempt and why it did not pass */}
        {request?.status === 'rejected' && (
          <div className="rounded-[20px] border border-red-200
            bg-red-50 p-6 sm:p-8">

            <div className="flex items-start gap-4">
              <MdOutlineCancel className="mt-0.5 h-7 w-7 shrink-0 text-red-600" />

              <div className="min-w-0">
                <h2 className="text-[16px] font-medium text-gray-900">
                  Your last application wasn't approved
                </h2>

                <p className="mt-2 text-[13px] leading-4.75 text-gray-700">
                  {request.note
                    ? request.note
                    : 'No reason was given. Check the details below and send it again.'}
                </p>

                <p className="mt-2 text-[12px] text-gray-500">
                  Reviewed {formatDate(request.reviewedAt)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[20px] bg-white p-6 custom-shadow sm:p-8">
          <h2 className="text-[16px] font-medium leading-5 text-gray-900">
            Restaurant Details
          </h2>

          <p className="mt-2 text-[13px] leading-4.75 text-gray-500">
            Applying with <span className="font-medium text-gray-700">{user.email}</span>.
            An admin reviews every application, so your account stays a customer
            account until it's approved.
          </p>

          <form onSubmit={handleSubmit(handleApply)} noValidate className="mt-6 space-y-4">

            {/* Restaurant name */}
            <div className="space-y-1">
              <label className="block text-sm font-medium
                text-gray-700 md:text-lg">
                Restaurant Name
              </label>

              <input
                {...register('restaurantName', {
                  setValueAs: (value) => (value || '').trim(),
                  required: 'Restaurant name is required',
                  minLength: { value: 2, message: 'Name is too short' },
                  maxLength: { value: 100, message: 'Name is too long' },
                })}
                type="text"
                placeholder="For example, Kacchi Bhai"
                className={inputClass(errors.restaurantName)}
              />

              <FieldError error={errors.restaurantName} />
            </div>

            {/* Cuisine */}
            <div className="space-y-1">
              <label className="block text-sm font-medium
                text-gray-700 md:text-lg">
                Cuisine Type
              </label>

              <select
                {...register('cuisine', { required: 'Pick a cuisine type' })}
                className={inputClass(errors.cuisine)}>

                <option value="">Choose one</option>

                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>

              <FieldError error={errors.cuisine} />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-sm font-medium
                text-gray-700 md:text-lg">
                Business Phone
              </label>

              <input
                {...register('phone', {
                  setValueAs: (value) => (value || '').trim(),
                  required: 'Phone number is required',
                  validate: (value) => isValidPhone(value)
                    || 'Enter a valid number, for example +8801712345678',
                })}
                type="tel"
                placeholder="+880 1712 345678"
                className={inputClass(errors.phone)}
              />

              <FieldError error={errors.phone} />

              <p className="text-[12px] text-gray-500">
                Riders and support use this to reach the kitchen.
              </p>
            </div>

            {/* Pickup address */}
            <div className="space-y-1">
              <label className="block text-sm font-medium
                text-gray-700 md:text-lg">
                Pickup Address
              </label>

              <textarea
                {...register('address', {
                  setValueAs: (value) => (value || '').trim(),
                  required: 'Pickup address is required',
                  minLength: { value: 10, message: 'Please give the full address' },
                  maxLength: { value: 300, message: 'Address is too long' },
                })}
                rows={3} maxLength={300}
                placeholder="House, road, area, city"
                className={textareaClass(errors.address)} /> 

              <FieldError error={errors.address} />

              <p className="text-[12px] text-gray-500">
                Where riders collect the orders.
              </p>
            </div>

            {/* Trade licence, optional */}
            <div className="space-y-1">
              <label className="block text-sm font-medium
                text-gray-700 md:text-lg">
                Trade Licence Number
                <span className="ml-2 text-[12px] font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <input
                {...register('tradeLicense', {
                  setValueAs: (value) => (value || '').trim(),
                  maxLength: { value: 60, message: 'Licence number is too long' },
                })}
                type="text"
                placeholder="TRAD/DNCC/012345/2026"
                className={inputClass(errors.tradeLicense)}
              />

              <FieldError error={errors.tradeLicense} />

              <p className="text-[12px] text-gray-500">
                Adding it usually gets an application approved faster.
              </p>
            </div>

            {/* Logo */}
            <div className="space-y-1">
              <label className="block text-sm font-medium
                text-gray-700 md:text-lg">
                Restaurant Logo
                <span className="ml-2 text-[12px] font-normal text-gray-400">
                  Optional
                </span>
              </label>

              <div className="flex items-center gap-4 rounded-xl border
                border-gray-300 p-3">

                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="restaurant logo preview"
                    className="h-16 w-16 shrink-0 rounded-xl border-2
                      border-orange-100 bg-white object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center
                    justify-center rounded-xl bg-orange-50">
                    <MdOutlineStorefront className="h-7 w-7 text-orange-600" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <label className="inline-flex h-11 cursor-pointer
                    items-center gap-2 rounded-xl border border-orange-200
                    bg-white px-4 text-sm font-medium text-gray-800
                    transition-colors duration-200 hover:bg-orange-500
                    hover:text-white">

                    <MdOutlineFileUpload className="h-4 w-4" />
                    {logoFile ? 'Change Logo' : 'Choose Logo'}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePickLogo}
                      className="hidden"
                    />
                  </label>

                  <p className="mt-2 truncate text-[12px] text-gray-500">
                    {logoFile
                      ? `${logoFile.name} — uploads when you apply`
                      : 'PNG or JPG, up to 5MB'}
                  </p>
                </div>

                {logoFile && (
                  <button
                    type="button"
                    onClick={() => setLogoFile(null)}
                    className="shrink-0 text-[12px] font-medium text-gray-500
                      underline transition-colors hover:text-orange-600">
                    Remove
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="mt-2 h-14 w-full rounded-xl bg-orange-500 text-sm
                font-semibold text-white shadow-lg shadow-orange-500/20
                transition hover:bg-orange-600 active:scale-95
                disabled:cursor-not-allowed disabled:opacity-60 md:text-lg">
              {uploading
                ? 'Uploading logo...'
                : isSubmitting
                  ? 'Sending application...'
                  : request?.status === 'rejected'
                    ? 'Send Again'
                    : 'Send Application'}
            </button>
          </form>
        </div>
      </div>
    </Shell>
  )
}
