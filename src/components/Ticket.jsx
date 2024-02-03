import React from 'react'
import { IoTicket } from "react-icons/io5";
import { useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { openNotification } from '../store/features/Notification/notificationSlice';
import { useQueryClient } from '@tanstack/react-query';

export default function Ticket({ticket}) {
  const cookie = useSelector(state=>state.cookie)
  const dispatch = useDispatch()
  const queryClient = useQueryClient()
  const cancelTicket = useMutation({
    mutationKey:["cancelTicket"],
    mutationFn:async()=>{
      return await (await fetch(`https://event-api-xbo5.onrender.com/user/${cookie.id}/ticket/${ticket._id}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${cookie.token}`
      } 
      })).json()
    },
    onError:(error)=>{
   
      dispatch(openNotification({type:"error",message:error.message}))
    },
    onSettled:(data)=>{
      if(data.error){
   
        dispatch(openNotification({type:"error",message:data.error}))
      }else{
        dispatch(openNotification({type:"success",message:"Ticket has been canceled..."}))
        queryClient.invalidateQueries({queryKey:["tickets"]})
      }
    }
  })

  const cancelHandler = ()=>{
    cancelTicket.mutate()
  }

  return (
    <div className='w-full lg:w-2/3 h-auto p-2 flex items-center justify-evenly border border-blue-400 rounded-2xl shadow-lg shadow-blue-700/50'>
        <IoTicket className='h-32 w-[20%] text-yellow-400' />
        <div className='w-[80%] h-auto flex flex-col p-2 items-center justify-center gap-1' >
            <p className='text-white text-xl'>{ticket.eventname.title}</p>
            <div className='w-full flex items-center justify-center gap-5 flex-wrap'>
                <div className='text-white p-2 w-auto h-auto'>{ticket._id}</div>

                <div className='text-white border border-green-400 rounded-full p-2 w-auto h-auto'>{`Date : ${ticket.eventname.date}`}</div>
                <div className='text-white border border-green-400 rounded-full p-2 w-auto h-auto'>{`Time : ${ticket.eventname.time}`}</div>
                <div className='text-white border border-green-400 rounded-full p-2 w-auto h-auto'>{`Quantity : ${ticket.quantity}`}</div>
                <div className='text-white border-2 border-yellow-400 rounded-full p-2 w-auto h-auto'>{`${ticket.tickettype}: $${ticket.price}`}</div>

            </div>
            <button className='relative btn left-1/3 mt-5' onClick={cancelHandler}>Cancel</button>
        </div>
    </div>
  )
}
