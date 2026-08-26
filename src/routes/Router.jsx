import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout"
import AuthLayout from "../layouts/AuthLayout"
import Home from "../Pages/home/Home"
import Register from "../Pages/Authentications/Register"
import Login from "../Pages/Authentications/Login"
import OnboardingCarousel from "../shared components/OnboardingCarousel/OnboardingCarousel";
import PrivateRoute from "./PrivateRoute";
import Profile from "../Pages/Dashboards/Customers/Profile";
import Discover from "../Pages/Discover";
import ErrorHandle from "../Pages/ErrorHandle";
import DashboardLayout from "../layouts/DashboardLayout";
import Restaurant from "../Pages/Dashboards/Restaurant owners/Restaurant";
import AdminDashboard from "../Pages/Dashboards/Admin/AdminDashboard";
import AdminRoute from "./AdminRoute"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout /> ,
    errorElement: <ErrorHandle /> ,
    children: [
        {
            path: '/',
            element: <Home/>  
        },
        {
            path: '/profile',
           element: <PrivateRoute> <Profile /> </PrivateRoute> 
        },
        {
            path: '/discover',
            element: <Discover />
        },
      ]
  },
  {
    path: "/",
    element: <AuthLayout /> ,
    children: [
        {
            path: 'onBoarding',
            element: <OnboardingCarousel />
        },
        {
            path: 'register',
            element: <Register />
        },
        {
            path: 'login',
            element: <Login />
        },
      ]
  },

  {
    path: "/dashboard",
    element: <DashboardLayout /> ,
    children: [        
        {
            path: 'restaurants',
            element:  <PrivateRoute> <Restaurant /> </PrivateRoute> 
        },
        {
            path: 'admin',
            element:  <AdminRoute> <AdminDashboard /> </AdminRoute>
        },
      ]
  },
]);
