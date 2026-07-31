import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './Pages/home/Home'
import './index.css'
//import 'antd/dist/antd.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Home /> 
  </StrictMode>
)
