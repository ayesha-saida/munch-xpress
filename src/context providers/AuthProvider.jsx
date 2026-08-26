import { createContext, useCallback, useEffect, useState } from 'react'
import { auth } from '../firebase/firebase.config.js'
import { createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         signOut, updateProfile, GoogleAuthProvider, 
         signInWithPopup, onAuthStateChanged,
         sendPasswordResetEmail } from 'firebase/auth' 
import { axiosSecure } from '../api/axiosSecure.js'


export const  AuthContext = createContext(null)

const AuthProvider = ({children}) => {
      const [user, setUser] = useState(null)
      const [loading, setLoading] = useState(true)

  // the mongo account document, which is where the role lives
      const [dbUser, setDbUser] = useState(null)
      const [roleLoading, setRoleLoading] = useState(true)

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
 
    /* Whenever a user signs in or updates their profile, 
       sync their Firebase information to MongoDB, 
       let the server create/update their account, 
       and get their role from the server rather than trusting the client to provide it. */

    const syncUser = useCallback(async (firebaseUser = auth.currentUser) => {
      if (!firebaseUser) {
        setDbUser(null)
        setRoleLoading(false)
        return null
      }

      setRoleLoading(true)

      try {
        const { data } = await axiosSecure.post('/users', {
          name: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
        })

        setDbUser(data.user)
        return data.user
      } catch (error) {

        /* signed in with firebase but the server did not answer, so treat the
           account as having no role rather than assuming one */

        console.log('Could not sync your account with the server', error)
        setDbUser(null)
        return null
      } finally {
        setRoleLoading(false)
      }
    }, [])

    
          // observe user state 
    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser)
          setLoading(false)
           syncUser(currentUser)
        })
      return () => unSubscribe() }, [syncUser])

          const authInfo = {
               registerUser,
                 loginUser,
              updateUserProfile,
                  logOut ,    
             signInWithGoogle, 
          resetPasswordWithEmail, 
                   user,
                 loading,
                 dbUser,
                 role: dbUser?.role || null,
               roleLoading,
                 syncUser
             }


  return (
    <AuthContext value={authInfo}>
       { children}
         </AuthContext>
  )
}

export default AuthProvider