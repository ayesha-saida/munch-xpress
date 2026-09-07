  // Menu Categories
export const menuCategories = [
  'Rice & Biryani',
  'Curry',
  'Burger',
  'Pizza',
  'Pasta',
  'Noodles',
  'Sandwich & Wrap',
  'Kebab & Grill',
  'Snacks',
  'Salad',
  'Soup',
  'Seafood',
  'Dessert',
  'Beverage',
  'Other']


export const formatPrice = (amount) => {
  const value = Number(amount)

  if (!Number.isFinite(value)) return '৳0'

  // whole numbers read better without the .00 that most menu prices would carry
  return `৳${Number.isInteger(value) ? value : value.toFixed(2)}`
}
