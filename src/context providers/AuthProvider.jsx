import { createContext, useEffect, useState } from 'react'
import { auth } from '../firebase/firebase.config.js'
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         signOut, updateProfile, GoogleAuthProvider, 
         signInWithPopup, onAuthStateChanged,
         sendPasswordResetEmail } from 'firebase/auth' 

export const  AuthContext = createContext(null)

const AuthProvider = ({children}) => {
      const [user, setUser] = useState(null)
      const [loading, setLoading] = useState(true)

      const provider = new GoogleAuthProvider()

    const registerUser = (email,password) => {
        setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password) }

    const loginUser = (email, password) => {
        setLoading(true)
    return signInWithEmailAndPassword(auth, email, password) }


    const updateUserProfile = (profile) => {
        if (!auth.currentUser) {
          return Promise.reject(new Error('No authenticated user'))
        }
    return updateProfile(auth.currentUser, profile) }        

     
    const logOut = () => {
        setLoading(true)
    return signOut(auth) }

    const signInWithGoogle = () => {
       setLoading(true)
    return signInWithPopup(auth, provider) }

    const resetPasswordWithEmail = (email) => {
       setLoading(true)
    return sendPasswordResetEmail(auth, email) }

        
          // observe user state 
    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser)
          setLoading(false)
        })
      return () => unSubscribe() }, [])

          const authInfo = {
               registerUser,
                 loginUser,
              updateUserProfile,
                  logOut ,    
             signInWithGoogle, 
          resetPasswordWithEmail, 
                   user,
                 loading
             }


  return (
    <AuthContext value={authInfo}>
       { children}
         </AuthContext>
  )
}

export default AuthProvider