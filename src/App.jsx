import { Outlet } from 'react-router'
import NavBar from './components/NavBar'
import { Provider } from 'react-redux'
import {store}  from "./store/store"
import Notification from './components/Notification'
import { QueryClient,QueryClientProvider } from '@tanstack/react-query'
import { CookiesProvider } from 'react-cookie'
function App() {
  const queryclient = new QueryClient()
  return (
    <Provider store={store} >
      <CookiesProvider>
        <Notification/>
        <NavBar/>
        <QueryClientProvider client={queryclient}>
          <Outlet/> 
        </QueryClientProvider>
      </CookiesProvider>
    </Provider>
    
  )
}

export default App
