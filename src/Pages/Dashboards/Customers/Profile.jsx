import { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../../context providers/AuthProvider'
import { errorToast, successToast } from '../../../shared components/ToastContainer'
import Loading from '../../../shared components/Loading'
import FieldError from '../../../shared components/FieldError'
import userIcon from '../../../assets/user-icon.png'
import { getDeliveryDetails, saveDeliveryDetails, isValidPhone } from '../../../utils/deliveryDetails'
import { uploadImage, validateImage } from '../../../utils/imageUpload'
import { inputClass, textareaClass } from '../../../utils/formStyle'
import { FaRegEdit, FaRegUserCircle } from 'react-icons/fa'
import { MdVerified, MdOutlineEmail, MdOutlineCalendarMonth, MdFingerprint, MdOutlineLocalPhone, MdOutlineLocationOn, MdOutlineFileUpload } from 'react-icons/md'

// readable labels for the firebase provider ids
const providerLabels = {
  'google.com': 'Google',
  password: 'Email & Password',
}

const formatDate = (value) => {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Profile() {
  const { user, loading, updateUserProfile, syncUser } = useContext(AuthContext)

  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { displayName: '', phone: '', address: '' },
  })

  // onAuthStateChanged does not fire for profile updates, so a saved edit is
  // held here (tagged with the uid it belongs to) and preferred over the
  // firebase user until the next reload
  const [edited, setEdited] = useState(null)

  const profile = edited?.uid === user?.uid
    ? edited
    : {
      displayName: user?.displayName || '',
      photoURL: user?.photoURL || '',
    }

  // phone + address live outside the firebase auth profile, see utils/deliveryDetails
  const [savedDelivery, setSavedDelivery] = useState(null)

  const storedDelivery = useMemo(() => getDeliveryDetails(user?.uid), [user?.uid])

  const delivery = savedDelivery?.uid === user?.uid ? savedDelivery : storedDelivery

  // picked file is only sent to imgbb when the form is submitted
  const [photoFile, setPhotoFile] = useState(null)
  const [removePhoto, setRemovePhoto] = useState(false)

  const previewUrl = useMemo(
    () => (photoFile ? URL.createObjectURL(photoFile) : ''),
    [photoFile]
  )

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="flex min-h-100 items-center justify-center">
          <Loading />
        </div>
      </main>
    )
  }

  // not signed in
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="mx-auto flex min-h-100 w-[calc(100%-48px)] max-w-md
          flex-col items-center justify-center gap-5 py-16 text-center">

          <FaRegUserCircle className="h-14 w-14 text-orange-600" />

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            You're not signed in
          </h1>

          <p className="text-base text-gray-600">
            Log in to view your MunchXpress profile and order history.
          </p>

          <Link
            to={'/login'}
            className="flex h-14 items-center justify-center rounded-xl
              bg-orange-500 px-10 text-sm font-semibold text-white shadow-lg
              shadow-orange-500/20 transition hover:bg-orange-600
              active:scale-95 md:text-lg">
            Login
          </Link>
        </div>
      </main>
    )
  }

  const providerId = user.providerData?.[0]?.providerId
  const avatar = profile.photoURL || userIcon

  const handlePickPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const problem = validateImage(file)

    if (problem) {
      errorToast(problem)
      e.target.value = ''
      return
    }

    setPhotoFile(file)
    setRemovePhoto(false)
  }

  // the editor is only mounted while open, so the form is seeded on open
  // rather than through useForm defaultValues, which are read too early
  const openEditor = () => {
    reset({
      displayName: profile.displayName,
      phone: delivery.phone,
      address: delivery.address,
    })

    setPhotoFile(null)
    setRemovePhoto(false)
    setIsEditing(true)
  }

  const closeEditor = () => {
    setIsEditing(false)
    setPhotoFile(null)
    setRemovePhoto(false)
  }

  const handleUpdateProfile = async ({ displayName, phone, address }) => {
    try {
      // keep the current picture unless a new one was picked or it was removed
      let photoURL = removePhoto ? '' : profile.photoURL

      if (photoFile) {
        setUploading(true)
        photoURL = await uploadImage(photoFile)
      }

      await updateUserProfile({ displayName, photoURL })

      await syncUser()

      saveDeliveryDetails(user.uid, { phone, address })

      setEdited({ uid: user.uid, displayName, photoURL })
      setSavedDelivery({ uid: user.uid, phone, address })
      closeEditor()
      successToast('Profile updated 🎉')
    } catch (error) {
      console.log(error)
      errorToast(error.message || 'Could not update your profile')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-16 font-sans">
      <section className="mx-auto w-[calc(100%-48px)] max-w-240 py-10 md:py-14">

        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <p className="text-sm font-medium uppercase
            tracking-[1.5px] text-orange-600">
            My Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight
            text-gray-900 sm:text-4xl">
            Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Identity card */}
          <div className="overflow-hidden rounded-[20px] bg-white
            custom-shadow lg:col-span-1">

            {/* Cover */}
            <div className="h-28 bg-orange-600"></div>

            <div className="-mt-14 flex flex-col items-center px-5 pb-7">

              {/* Avatar */}
              <img
                src={avatar}
                alt={profile.displayName || 'user avatar'}
                onError={(e) => { e.currentTarget.src = userIcon }}
                className="h-28 w-28 rounded-full border-4 border-white
                  bg-white object-cover shadow-md"
              />

              <h2 className="mt-4 text-center text-xl font-medium
                leading-6 text-gray-900">
                {profile.displayName || 'Guest Foodie'}
              </h2>

              <p className="mt-1 break-all text-center text-[13px] text-gray-500">
                {user.email}
              </p>

              {/* Verified pill */}
              <span className={`mt-4 flex items-center gap-1.5 rounded-full
                px-3 py-1.5 text-[12px] font-medium ${user.emailVerified
                  ? 'bg-orange-50 text-orange-700'
                  : 'bg-gray-100 text-gray-500'}`}>
                <MdVerified className="h-4 w-4" />
                {user.emailVerified ? 'Verified account' : 'Not verified'}
              </span>

              {/* Edit toggle */}
              <button
                type="button"
                onClick={() => (isEditing ? closeEditor() : openEditor())}
                className="mt-6 flex h-12 w-full items-center justify-center
                  gap-2 rounded-xl border border-orange-200 bg-white text-sm
                  font-medium text-gray-800 transition-colors duration-200
                  hover:bg-orange-500 hover:text-white">
                <FaRegEdit className="h-4 w-4" />
                {isEditing ? 'Close Editor' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Details + editor */}
          <div className="space-y-6 lg:col-span-2">

            {/* Account details */}
            <div className="rounded-[20px] bg-white p-6 custom-shadow sm:p-8">
              <h3 className="text-[16px] font-medium leading-5 text-gray-900">
                Account Details
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                {/* Name */}
                <div className="flex items-start gap-3">
                  <FaRegUserCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium uppercase
                      tracking-[1px] text-gray-400">
                      Full Name
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      {profile.displayName || '—'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <MdOutlineEmail className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium uppercase
                      tracking-[1px] text-gray-400">
                      Email Address
                    </p>
                    <p className="mt-1 break-all text-sm text-gray-800">
                      {user.email || '—'}
                    </p>
                  </div>
                </div>

                {/* Member since */}
                <div className="flex items-start gap-3">
                  <MdOutlineCalendarMonth className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium uppercase
                      tracking-[1px] text-gray-400">
                      Member Since
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      {formatDate(user.metadata?.creationTime)}
                    </p>
                  </div>
                </div>

                {/* Sign in method */}
                <div className="flex items-start gap-3">
                  <MdFingerprint className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium uppercase
                      tracking-[1px] text-gray-400">
                      Sign-in Method
                    </p>
                    <p className="mt-1 text-sm text-gray-800">
                      {providerLabels[providerId] || 'Email & Password'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery details, optional and only used to prefill an order */}
            <div className="rounded-[20px] bg-white p-6 custom-shadow sm:p-8">

              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[16px] font-medium leading-5 text-gray-900">
                  Delivery Details
                </h3>

                <span className="shrink-0 rounded-full bg-gray-100 px-3 py-1
                  text-[11px] font-medium uppercase tracking-[1px] text-gray-500">
                  Optional
                </span>
              </div>

              {delivery.phone || delivery.address ? (
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <MdOutlineLocalPhone className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium uppercase
                        tracking-[1px] text-gray-400">
                        Phone Number
                      </p>
                      <p className="mt-1 text-sm text-gray-800">
                        {delivery.phone || 'Not added yet'}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MdOutlineLocationOn className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium uppercase
                        tracking-[1px] text-gray-400">
                        Delivery Address
                      </p>
                      <p className="mt-1 whitespace-pre-line text-sm text-gray-800">
                        {delivery.address || 'Not added yet'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="mt-6 rounded-xl border border-orange-200
                  bg-orange-50 px-5 py-6 text-center">

                  <MdOutlineLocationOn className="mx-auto h-7 w-7 text-orange-600" />

                  <p className="mt-2 text-sm font-medium text-gray-800">
                    No phone number or address saved
                  </p>

                  <p className="mt-1 text-[13px] leading-4.75 text-gray-600">
                    Add them once and your next order gets delivered without
                    typing it all again.
                  </p>

                  <button
                    type="button"
                    onClick={openEditor}
                    className="mt-4 h-12 rounded-xl bg-orange-500 px-8 text-sm
                      font-semibold text-white shadow-lg shadow-orange-500/20
                      transition hover:bg-orange-600 active:scale-95">
                    Add Details
                  </button>
                </div>
              )}
            </div>

            {/* Editor */}
            {isEditing && (
              <div className="rounded-[20px] bg-white p-6 custom-shadow sm:p-8">
                <h3 className="text-[16px] font-medium leading-5 text-gray-900">
                  Edit Profile
                </h3>

                <p className="mt-2 text-[13px] leading-4.75 text-gray-500">
                  Update the name and picture shown across MunchXpress. Phone
                  and address are optional and saved for future orders.
                </p>

                <form onSubmit={handleSubmit(handleUpdateProfile)} noValidate className="mt-6 space-y-4">

                  {/* Display name */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium
                      text-gray-700 md:text-lg">
                      Full Name
                    </label>

                    <input
                      {...register('displayName', {
                        setValueAs: (value) => (value || '').trim(),
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name is too short' },
                      })}
                      type="text"
                      placeholder="Your name"
                      className={inputClass(errors.displayName)}
                    />

                    <FieldError error={errors.displayName} />
                  </div>

                  {/* Profile picture */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium
                      text-gray-700 md:text-lg">
                      Profile Picture
                    </label>

                    <div className="flex items-center gap-4 rounded-xl border
                      border-gray-300 p-3">

                      {/* Preview */}
                      <img
                        src={previewUrl || (removePhoto ? userIcon : avatar)}
                        alt="profile picture preview"
                        onError={(e) => { e.currentTarget.src = userIcon }}
                        className="h-16 w-16 shrink-0 rounded-full border-2
                          border-orange-100 bg-white object-cover"
                      />

                      <div className="min-w-0 flex-1">

                        {/* Hidden native input, the label is the button */}
                        <label className="inline-flex h-11 cursor-pointer
                          items-center gap-2 rounded-xl border border-orange-200
                          bg-white px-4 text-sm font-medium text-gray-800
                          transition-colors duration-200 hover:bg-orange-500
                          hover:text-white">

                          <MdOutlineFileUpload className="h-4 w-4" />
                          {photoFile ? 'Change Photo' : 'Choose Photo'}

                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePickPhoto}
                            className="hidden"
                          />
                        </label>

                        <p className="mt-2 truncate text-[12px] text-gray-500">
                          {photoFile
                            ? `${photoFile.name} — uploads when you save`
                            : 'PNG or JPG, up to 5MB'}
                        </p>
                      </div>

                      {/* Remove current picture */}
                      {(photoFile || (profile.photoURL && !removePhoto)) && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoFile(null)
                            setRemovePhoto(!photoFile)
                          }}
                          className="shrink-0 text-[12px] font-medium
                            text-gray-500 underline transition-colors
                            hover:text-orange-600">
                          Remove
                        </button>
                      )}
                    </div>

                    {removePhoto && (
                      <p className="text-[12px] text-orange-700">
                        Your picture will be cleared when you save.
                      </p>
                    )}
                  </div>

                  {/* Divider before the optional delivery fields */}
                  <div className="relative pt-4">
                    <div className="absolute inset-x-0 top-6 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>

                    <div className="relative flex justify-center">
                      <span className="bg-white px-4 text-[11px] font-medium
                        uppercase tracking-[1.5px] text-gray-400">
                        For Delivery — Optional
                      </span>
                    </div>
                  </div>

                  {/* Phone number */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium
                      text-gray-700 md:text-lg">
                      Phone Number
                    </label>

                    <input
                      {...register('phone', {
                        setValueAs: (value) => (value || '').trim(),
                        validate: (value) => !value || isValidPhone(value)
                          || 'Enter a valid number, for example +8801712345678',
                      })}
                      type="tel"
                      placeholder="+880 1712 345678"
                      className={inputClass(errors.phone)}
                    />

                    <FieldError error={errors.phone} />

                    <p className="text-[12px] text-gray-500">
                      We only use this to reach you about a delivery.
                    </p>
                  </div>

                  {/* Delivery address */}
                  <div className="space-y-1">
                    <label className="block text-sm font-medium
                      text-gray-700 md:text-lg">
                      Delivery Address
                    </label>

                    <textarea
                      {...register('address', {
                        setValueAs: (value) => (value || '').trim(),
                        maxLength: { value: 300, message: 'Address is too long' },
                      })}
                      rows={3}
                      maxLength={300}
                      placeholder="House, road, area, city"
                      className={textareaClass(errors.address)}
                    />

                    <FieldError error={errors.address} />

                    <p className="text-[12px] text-gray-500">
                      Saved for next time so checkout stays quick.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">

                    {/* Save */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-xl bg-orange-500 text-sm
                        font-semibold text-white shadow-lg shadow-orange-500/20
                        transition hover:bg-orange-600 active:scale-95
                        disabled:cursor-not-allowed disabled:opacity-60
                        md:text-lg">
                      {uploading
                        ? 'Uploading photo...'
                        : isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>

                    {/* Cancel */}
                    <button
                      type="button"
                      onClick={closeEditor}
                      disabled={isSubmitting}
                      className="h-14 w-full rounded-xl border border-gray-300
                        bg-white text-sm font-semibold text-gray-800 transition
                        hover:bg-gray-100 active:scale-95
                        disabled:cursor-not-allowed disabled:opacity-60
                        sm:w-auto sm:px-10 md:text-lg">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
