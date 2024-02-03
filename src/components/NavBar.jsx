import React, { useEffect } from 'react'
import { NavLink} from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { setCookie } from '../store/features/Cookie/cookieSlice'

export default function NavBar() {
  const dispatch  = useDispatch()
  const cookie = useSelector(state=>state.cookie)
  const [cookies,_,removeCookie] = useCookies(['user'])
  useEffect(()=>{
    if(cookies.token && !cookie.token){
      dispatch(setCookie({type:"token",value:cookies.token}))
      dispatch(setCookie({type:"id",value:cookies.id}))
      dispatch(setCookie({type:"username",value:cookies.username}))

    }
  },[cookies.token])
  
  return <div className='shadow-md shadow-black w-full h-auto p-2 flex flex-row items-center justify-end'>
        <ul className=' w-1/2 h-auto p-2 flex flex-row items-center justify-end gap-6'>
          
          <NavLink className="text-white text-lg lg:text-xl font-bold" to={'/'} >Home</NavLink>
          <NavLink className="text-white text-lg lg:text-xl font-bold" to={'/events'} >Events</NavLink>
          
          {
            cookie.token?
            <NavLink className="text-white text-lg lg:text-xl font-bold" to={'/user'} >User</NavLink>:
            
            [<NavLink key={"login"} className="text-white text-lg lg:text-xl font-bold" to={'/login'} >Login</NavLink>,
            <NavLink key={"signup"} className="text-white text-lg lg:text-xl font-bold" to={'/signup'} >Signup</NavLink>]
          }
            
        </ul>
  </div>
}
