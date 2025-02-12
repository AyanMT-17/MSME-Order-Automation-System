import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";



<Routes>
<Route path="/" element={<Home />} />
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/admin" element={<Admin />} />
<Route path="/user" element={<User />} />
</Routes>

function App() {

  const routes = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
    },
  ])

  const [count, setCount] = useState(0)

  return (
    <>
    <RouterProvider value={routes} />
    </>
  )
}

export default App
