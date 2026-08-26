/*
 This file creates one Axios client for our backend. 
 Whenever we make a request, it automatically attaches the logged-in user's Firebase ID token
 so protected Express routes can verify the user. 

 Firebase handles refreshing the token when necessary.
 The backend URL comes from VITE_API_URL;  
 if that's missing, we use the local Express server.
*/

import axios from 'axios'
import { auth } from '../firebase/firebase.config'

export const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
})

axiosSecure.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser

  if (currentUser) {
    config.headers.Authorization = `Bearer ${await currentUser.getIdToken()}`
  }

  return config
})

/*
  If the server reports fails. Show the server's message
   instead of Axios's generic error.
*/

export const apiErrorMessage = (error, fallback = 'Something went wrong') =>
  error?.response?.data?.message || error?.message || fallback
