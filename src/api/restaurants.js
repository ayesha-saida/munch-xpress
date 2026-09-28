import { axiosSecure } from './axiosSecure.js'

  // public Discover filter for Name, cuisine and logo 
export const getRestaurants = async () => {
  const { data } = await axiosSecure.get('/restaurants')
  return data.restaurants || []
}
 
  // The caller's own restaurant
export const getMyRestaurant = async () => {
  const { data } = await axiosSecure.get('/restaurants/mine')
  return data.restaurant
}
