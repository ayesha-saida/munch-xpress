const storageKey = (uid) => `munchxpress:delivery:${uid}`

const emptyDetails = { phone: '', address: '' }

export const getDeliveryDetails = (uid) => {
  if (!uid) return emptyDetails

  try {
    const saved = localStorage.getItem(storageKey(uid))
    if (!saved) return emptyDetails

    const parsed = JSON.parse(saved)

    return {
      phone: parsed.phone || '',
      address: parsed.address || '',
    }
  } catch (error) {
    console.log('Could not read delivery details', error)
    return emptyDetails
  }
}

export const saveDeliveryDetails = (uid, { phone, address }) => {
  if (!uid) throw new Error('No user to save delivery details for')

  const details = {
    phone: phone || '',
    address: address || '',
  }

  localStorage.setItem(storageKey(uid), JSON.stringify(details))

  return details
}

/* loose check so international numbers are accepted, digits only counted */
export const isValidPhone = (phone) => {
  if (!/^[\d\s+()-]+$/.test(phone)) return false

  const digits = phone.replace(/\D/g, '')

  return digits.length >= 7 && digits.length <= 15
}
