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
import ErrorHandle from "../shared components/ErrorHandle";
import DashboardLayout from "../layouts/DashboardLayout";
import Restaurant from "../Pages/Dashboards/Restaurant owners/Restaurant";
import AdminRoute from "./AdminRoute"
import DashboardHome from "../Pages/Dashboards/DashboadHome";
import Users from "../Pages/Dashboards/Admin/Users";
import BecomeSeller from "../Pages/Dashboards/Customers/BecomeSeller";
import SellerRequests from "../Pages/Dashboards/Admin/SellerRequests";
import SellerRoute from "./SellerRoute";
import MenuManagement from "../Pages/Dashboards/Restaurant owners/MenuManagement";

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
            path: '/become-a-seller',
            element: <PrivateRoute> <BecomeSeller /> </PrivateRoute>
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
    element: <PrivateRoute> <DashboardLayout /> </PrivateRoute> ,
    children: [
        {
            index: true,
            element: <DashboardHome />
        },        
        {
            path: 'users',
            element:  <AdminRoute> <Users /> </AdminRoute>
        },
        {
            path: 'seller-requests',
            element:  <AdminRoute> <SellerRequests /> </AdminRoute>
        },
        {
            path: 'all-menu',
            element:  <SellerRoute> <MenuManagement /> </SellerRoute>
        },
      ]
  },
]);
