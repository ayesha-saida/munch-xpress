import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import {router} from '../src/routes/Router'
import AuthProvider from './context providers/AuthProvider'
import { ToastContainer } from 'react-toastify'
import CartProvider from './context providers/CartProvider'
//import 'antd/dist/reset.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
     </AuthProvider>
     <ToastContainer /> 
  </StrictMode>
)
