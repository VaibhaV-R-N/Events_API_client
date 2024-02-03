import { useQuery } from '@tanstack/react-query'
import React from 'react'
import Ticket from './Ticket'
import { useSelector } from 'react-redux'

export default function Tickets({uid}) {
    const cookie = useSelector(state=>state.cookie)
    let component = null
    const {data,isLoading,isError,isSuccess} = useQuery({
        queryKey:["tickets"],
        queryFn:async()=>{
            return await (await fetch(`https://event-api-xbo5.onrender.com/user/ticket/${uid}`,{
                method:"GET",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                }
            })).json()
        }
    })

    if(isLoading){
        component = <div className='text-xl text-yellow-400'>Loading...</div>
    }

    if(isError){
        component = <div className='text-xl text-yellow-400'>Something went wrong...</div>
    }

    if(isSuccess){
   
        if(!data.error){
            component = <div className='w-full p-2 h-auto items-center justify-center flex flex-col gap-5'>
                {data.tickets.map((ticket)=>{
                    return <Ticket ticket={ticket} key={ticket._id}/>
                })}
            </div>
        }else{
            component = <div className='text-xl text-yellow-400'>{data.error}</div>
        }
        
    }


    return component
}
