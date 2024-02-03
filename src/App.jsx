import { Outlet } from 'react-router'
import NavBar from './components/NavBar'
import { Provider } from 'react-redux'
import {store}  from "./store/store"
import Notification from './components/Notification'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
import { useLocation } from 'react-router'

function App() {
  const queryclient = new QueryClient()
  const {pathname} = useLocation()
  return (
    <Provider store={store} >
      <CookiesProvider>
        <Notification/>
        <NavBar/>
        <QueryClientProvider client={queryclient}>
          {pathname === '/'?<div className='w-full h-screen flex flex-col items-center justify-center gap-10'>
              <h2 className='text-yellow-400 text-3xl'>Welcome! 😊</h2>
              <h3 className='text-red-400 text-2xl'> This is a client web app for interacting with Events-API !🚀</h3>
              <p className='text-white w-2/3 text-xl text-wrap break-words'>
              User Authentication: Securely sign up, log in, and manage your account to participate in events.
              </p>
              <p className='text-white w-2/3 text-xl text-wrap break-words'>
              Event Management: Create, update, and delete events with detailed information such as date, time, location, and pricing.
              </p>
              <p className='text-white w-2/3 text-xl text-wrap break-words'>
              Ticketing System: Purchase and cancel tickets for your favorite events with ease.              </p>
              <p className='text-white w-2/3 text-xl text-wrap break-words'>
              User Interaction: Leave comments, rate events, and engage with the community.              </p>
              <p className='text-white w-2/3 text-xl text-wrap break-words'>
              User Profile: Update your profile details and inactivate your account if needed.              </p>
             </div>:null}
          <Outlet/> 
      
        </QueryClientProvider>
      </CookiesProvider>
    </Provider>
    
  )
}

export default App
