import React, { useEffect } from 'react'
import Accordian from './Accordian'
import { BsCalendar2EventFill } from "react-icons/bs";
import { MdTipsAndUpdates } from "react-icons/md";
import { FaTicketSimple } from "react-icons/fa6";
import HostEvent from './HostEvent';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { removeCookie as remove } from '../store/features/Cookie/cookieSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import Tickets from './Tickets';

import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { setUpdate } from '../store/features/Update/updateSlice';
import { useMutation } from '@tanstack/react-query';
import { openNotification } from '../store/features/Notification/notificationSlice';

export default function User() {
  const [cookies,setCookie,removeCookie] = useCookies(['user'])
  const dispatch = useDispatch()
  const cookie = useSelector(state=>state.cookie)
  const navigate = useNavigate()
  const logoutHandler = ()=>{
    removeCookie("token",{path:'/'})
    removeCookie("id",{path:'/'})
    removeCookie("username",{path:'/'})
    dispatch(remove())
  }
  useEffect(()=>{
    if(!cookie.token){
      navigate('/login')
    }
  },[cookie.token])

  const deleteUser = useMutation({
    mutationKey:["deleteUser"],
    mutationFn:async()=>{
      return await (await fetch(`https://event-api-xbo5.onrender.com/user/${cookie.id}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${cookie.token}`
        }

      })).json()
    },
    onError:(error)=>{
   
      dispatch(openNotification({type:"error",message:"Failed to delete the account..."}))

    },
    onSettled:(data)=>{
      if(data.error){

        dispatch(openNotification({type:"error",message:"Failed to delete the account..."}))
      }else{
        dispatch(openNotification({type:"success",message:"Your account has been deleted..."}))
        removeCookie("token",{path:'/'})
        removeCookie("id",{path:'/'})
        removeCookie("username",{path:'/'})
        dispatch(remove())
        navigate("/events")
      }
    }
  })

  const handleUserEdit = ()=>{
    dispatch(setUpdate({type:"user",data:{id:cookie.id,username:cookie.username},eid:undefined}))
    navigate("/update")
  }

  const handleUserDelete = ()=>{
    deleteUser.mutate()
  }

  return (
    <div className='mt-16 w-full h-auto flex p-2 flex-col items-center justify-evenly'>
      {
        cookie.username?<div className='w-full lg:w-2/3 p-2 h-auto flex items-center justify-between'>
          <div className='w-1/2 lg:w-1/3 flex items-center justify-center gap-5'>
            <h2 className='text-yellow-400 text-2xl' >{cookie.username}</h2>
            <MdEdit  className='text-yellow-400 w-8 h-8 cursor-pointer' onClick={handleUserEdit}/>
            <MdDelete className='text-red-400 w-8 h-8 cursor-pointer' onClick={handleUserDelete}/>
          </div>
            
            <button className='btn' onClick={logoutHandler}>Logout</button>
        </div>:null
      }
      
      <div className='w-full lg:w-2/3 h-auto p-1 flex flex-col items-center justify-center gap-1'>
        <Accordian logo={<BsCalendar2EventFill className='w-8 h-2/3 text-yellow-400'/>} title={"Host Event"}><HostEvent/></Accordian>
        <Accordian logo={<FaTicketSimple className='w-8 h-2/3 text-yellow-400'/>} title={"your Tickets"}><Tickets uid={cookie.id}/></Accordian>
      </div>
    </div>
  )
}
