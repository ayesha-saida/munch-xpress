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
import Restaurents from "../Pages/Restaurents";
import ErrorHandle from "../Pages/ErrorHandle";

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
        {
            path: '/restaurants',
            element: <Restaurents />
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
]);
