const uploadEndpoint = 'https://api.imgbb.com/1/upload'

export const maxImageBytes = 5 * 1024 * 1024 // 5MB, imgbb allows 32MB

/* returns an error message, or an empty string when the file is fine */
export const validateImage = (file) => {
  if (!file) return 'Please choose an image'

  if (!file.type.startsWith('image/')) {
    return 'Only image files are allowed'
  }

  if (file.size > maxImageBytes) {
    return 'Image is too large, please pick one under 5MB'
  }

  return ''
}

export const uploadImage = async (file) => {
  const apiKey = import.meta.env.VITE_IMGBB_API_KEY

  if (!apiKey) {
    throw new Error('Image upload is not configured, VITE_IMGBB_API_KEY is missing')
  }

  const formData = new FormData()
  formData.append('image', file)

  const response = await fetch(`${uploadEndpoint}?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  })

  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result?.error?.message || 'Image upload failed, please try again')
  }

  return result.data.display_url || result.data.url
}
