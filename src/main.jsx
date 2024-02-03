import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'

import User from './components/User.jsx'
import Event from './components/EventPage.jsx'
import Events from './components/Events.jsx'
import Login from './components/Login.jsx'
import Signup from './components/Signup.jsx'
import Update from './components/Update.jsx'

const Router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        path:'/events',
        element:<Events/>
      },
      {
        path:'/events/:eventid',
        element:<Event/>
      },
      {
        path:'/user',
        element:<User/>
      },
      {
        path:'/login',
        element:<Login/>
      },
      {
        path:'/signup',
        element:<Signup/>
      },
      {
        path:'/update',
        element:<Update/>
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={Router}/>
  </React.StrictMode>,
)
