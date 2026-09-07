import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { LuImage, LuPencil, LuPlus } from 'react-icons/lu'
import { menuCategories } from '../../../../utils/menuCategories'
import { inputClass, textareaClass } from '../../../../utils/formStyle'
import { uploadImage, validateImage } from '../../../../utils/imageUpload'
import { errorToast } from '../../../../shared components/ToastContainer'
import FieldError from '../../../../shared components/FieldError'

const blankForm = {
  name: '',
  description: '',
  price: '',
  category: menuCategories[0],
}

// The server's price ceiling
const maxPrice = 100000

export default function MenuForm({
  editingId,
  items,
  onSave,
  onCancel,
}) {
  const [imageFile, setImageFile] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [uploading, setUploading] = useState(false)

  const { register, handleSubmit, reset, 
    formState: { errors, isSubmitting } } = useForm({
    defaultValues: blankForm,
  })

  useEffect(() => {
    if (!editingId) {
      setImageFile(null)
      setExistingImage('')
      reset(blankForm)
      return
    }

    const item = items.find(one => one._id === editingId)

    if (!item) return

    setImageFile(null)
    setExistingImage(item.imageURL || '')

    reset({
      name: item.name || '',
      description: item.description || '',
      price: item.price ?? '',
      category: item.category || menuCategories[0],
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [editingId, items, reset])

  const handlePickImage = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const problem = validateImage(file)

    if (problem) {
      errorToast(problem)
      event.target.value = ''
      return
    }

    setImageFile(file)
  }

  const handleCancel = () => {
    setImageFile(null)
    setExistingImage('')
    reset(blankForm)
    onCancel()
  }

  const handleFormSubmit = async (values) => {
    try {
      let imageURL = existingImage

      if (imageFile) {
        setUploading(true)
        imageURL = await uploadImage(imageFile)
      }

      await onSave({
        ...values,
        price: Number(values.price),
        quantity: Number(values.quantity),
        imageURL,
      })

      setImageFile(null)
      setExistingImage('')
      reset(blankForm)
    } catch (error) {

    } finally {
      setUploading(false)
    }
  }

  const saving = isSubmitting || uploading

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 rounded-[20px] bg-white p-5 custom-shadow sm:p-6">
    
      <h3 className="text-[15px] font-semibold text-gray-900">
        {editingId ? 'Edit dish' : 'Add a dish'}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">

        {/* Dish name */}
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-[13px] font-medium text-gray-700">          
            Dish name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Chicken Biryani"
            className={inputClass(errors.name)}
            {...register('name', {
              required: 'Item name is required',

              minLength: {
                value: 2,
                message: 'Item name is required',
              },

              maxLength: {
                value: 100,
                message: 'Name must be under 100 characters',
              },
            })}
          />

          <FieldError error={errors.name} />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label
            htmlFor="price"
            className="text-[13px] font-medium text-gray-700">          
            Price (৳)
          </label>

          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            placeholder="250"
            className={inputClass(errors.price)}
            {...register('price', {
              required: 'Price is required',

              valueAsNumber: true,

              validate: (value) => {
                if (!Number.isFinite(value)) {
                  return 'Price must be a number'
                }

                if (value <= 0) {
                  return 'Price must be greater than 0'
                }

                if (value > maxPrice) {
                  return `Price must be under ${maxPrice}`
                }

                return true
              },
            })}
          />

          <FieldError error={errors.price} />
        </div>

        {/* Quantity */}
        <div className="space-y-1.5">
              <label
                htmlFor="quantity"
                className="text-[13px] font-medium text-gray-700">              
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="20"
                className={inputClass(errors.quantity)}
                {...register('quantity', {
                  required: 'Quantity is required',

                  valueAsNumber: true,

                  validate: (value) => {
                    if (!Number.isFinite(value)) {
                      return 'Quantity must be a number'
                    }

                    if (!Number.isInteger(value)) {
                      return 'Quantity must be a whole number'
                    }

                    if (value < 1) {
                      return 'Quantity must be at least 1'
                    }

                    return true
                  },
                })}
              />

            <FieldError error={errors.quantity} />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label
            htmlFor="category"
            className="text-[13px] font-medium text-gray-700">
          
            Category
          </label>

          <select
            id="category"
            className={inputClass(errors.category)}
            {...register('category', {
              required: 'Category is required',
            })}>
          
            {menuCategories.map(category => (
              <option key={category} value={category}>              
                {category}
              </option>
            ))}
          </select>

          <FieldError error={errors.category} />
        </div>

        {/* Image */}
        <div className="space-y-1.5">
          <span className="block text-[13px] font-medium text-gray-700">
            Photo{' '}
            <span className="text-gray-400">
              (optional)
            </span>
          </span>

          <label
            htmlFor="dish-photo"
            className="flex h-14 cursor-pointer items-center gap-3
              rounded-xl border border-dashed border-gray-300 px-4
              text-sm text-gray-600 transition
              hover:border-orange-400 hover:bg-orange-50/40">

            <LuImage
              size={18}
              className="shrink-0 text-gray-400"
            />

            <span className="truncate">
              {imageFile?.name ||
                (
                  existingImage
                    ? 'Replace the current photo'
                    : 'Choose an image under 5MB'
                )}
            </span>
          </label>

          <input
            id="dish-photo"
            type="file"
            accept="image/*"
            onChange={handlePickImage}
            className="hidden"
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="text-[13px] font-medium text-gray-700">
        
          Description{' '}
          <span className="text-gray-400">
            (optional)
          </span>
        </label>

        <textarea
          id="description"
          rows={3}
          placeholder="Basmati rice slow cooked with chicken, whole spices and saffron."
          className={textareaClass(errors.description)}
          {...register('description', {
            maxLength: {
              value: 500,
              message: 'Description must be under 500 characters',
            },
          })}
        />

        <FieldError error={errors.description} />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-12 items-center justify-center gap-2
            rounded-xl bg-orange-500 px-8 text-sm font-semibold text-white
            shadow-lg shadow-orange-500/20 transition
            hover:bg-orange-600 active:scale-95
            disabled:cursor-not-allowed disabled:opacity-60">
        
          {editingId ? (
            <LuPencil size={17} />
          ) : (
            <LuPlus size={17} />
          )}

          {uploading ?
             'Uploading photo...' : saving ? 'Saving...'
              : editingId ? 'Save changes' : 'Add to menu'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center
              rounded-xl border border-gray-300 bg-white px-8
              text-sm font-semibold text-gray-700 transition
              hover:bg-gray-50 active:scale-95
              disabled:cursor-not-allowed disabled:opacity-60">
          
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
