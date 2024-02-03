import React, { useEffect, useState } from 'react'
import { useGetEventByDate, useGetEventByTitle } from '../query'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

export default function DateEvents({query}) {
    const access_key = import.meta.env.VITE_REACT_APP_ACCESS_KEY
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const events = useGetEventByDate(query)
    const images = useQuery({
        queryKey:["images"],
        queryFn:async()=>{
            return  (await (await fetch(`https://api.unsplash.com/search/photos?page=1&query=social&per_page=100&client_id=${access_key}`)).json()).results
        }
    }) 
    useEffect(()=>{
        events.refetch()
    
    },[query,queryClient])
    
    
    if(events.isLoading || images.isLoading ){
        return <div className='text-2xl text-yellow-400'>Loading...</div>
    }
    
    if(events.isError || images.isError ){
        return <div className='text-2xl text-yellow-400'>Error</div>
    }
    

    if(events.isSuccess && images.isSuccess){
        if(events.data.error){
            return <div className='text-2xl text-yellow-400'>{events.data.error}</div>
        }else{
            return <div className='w-full h-auto mt-5 flex flex-row items-center justify-start gap-5 p-2 flex-wrap '>
            {events.data.map((evnt,i)=>{
            return  <div onClick={()=>{ navigate(`/events/${evnt._id}?src=${encodeURIComponent(images.data[i].urls.regular)}`)}} className='cursor-pointer w-80 h-auto shadow-md shadow-black/70 rounded-md' key={evnt._id}>
            <img className='w-full h-40 object-cover rounded-tl-md rounded-tr-md'  src={images.data[i].urls.small} alt="" />
            <p className='text-white text-xl w-full p-1 text-wrap break-words' >{evnt.title}</p>
            <h4 className='text-yellow-400 text-md p-1' >{`Date: ${evnt.date}.`}</h4>
            <h4 className='text-yellow-400 text-sm p-1' >{`Time: ${evnt.time}.`}</h4>

            </div>
            })}
        </div>
        }
        

    }
}
