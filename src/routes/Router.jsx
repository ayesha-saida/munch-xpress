import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout"
import AuthLayout from "../layouts/AuthLayout"
import Home from "../Pages/home/Home"
import Register from "../Pages/Authentications/Register"
import Login from "../Pages/Authentications/Login"
import OnboardingCarousel from "../shared components/OnboardingCarousel/OnboardingCarousel";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout /> ,
    children: [
        {
            path: '/',
            element: <Home/>  
        },
        {
            path: '/onBoarding',
            element: <OnboardingCarousel />
        },
        {
            path: '/profile',
            element: <Profile />
        },
      ]
  },
  {
    path: "/",
    element: <AuthLayout /> ,
    children: [
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
