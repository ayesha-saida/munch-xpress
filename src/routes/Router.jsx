import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout"
import Home from "../Pages/home/Home"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout /> ,
    children: [
        {
            path: '/',
            element: <Home />
        },]
  },
]);
