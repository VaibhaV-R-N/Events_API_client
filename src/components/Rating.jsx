import React, { useEffect, useState } from 'react'
import { FaStar,FaRegStar } from "react-icons/fa";

import { useQueryClient,useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { openNotification } from '../store/features/Notification/notificationSlice';
import { useNavigate } from 'react-router';

export default function ({orating,eventId,user}) {
    const [rating,setRating] = useState(1)
    let stars = []
    const cookie = useSelector(state=>state.cookie)
    const [component,setComponent] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const queryClient  = useQueryClient()
    const rateTheEvent = useMutation({
        mutationKey:['rating'],
        mutationFn:async()=>{
            return await fetch(`https://event-api-xbo5.onrender.com/events/${eventId}/rating`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                },
                body:JSON.stringify({
                    eventId,
                    user,
                    value:rating
                })
            })
        },
        onError:()=>{
            dispatch(openNotification({type:"error",message:"Failed to rate the event..."}))
        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:data.error}))
            }else{
                dispatch(openNotification({type:"success",message:`You have rated the event ${rating}/5`}))
                setRating(1)
                queryClient.invalidateQueries({queryKey:["event"]})
            }
        }
    })
    const handleRating = (rating)=>{
        setRating(rating)
        if(user){
            rateTheEvent.mutate()
        }else{
            navigate('/login')
        }
    }

    const generateRating = (rating)=>{
     
        stars = []
        for(let i =0;i<rating;i++){
            stars.push(<FaStar key={i} className='cursor-pointer text-yellow-400 h-8 w-8' onMouseLeave={()=>{generateRating(orating)}} onMouseOver={()=>{generateRating(i+1)}} onClick={()=>{handleRating(i+1)}}/>)
        }
        for(let i =rating;i< 5;i++){
            stars.push(<FaRegStar key={i} className='cursor-pointer text-yellow-400 h-8 w-8' onMouseLeave={()=>{generateRating(orating)}}  onMouseOver={()=>{generateRating(i+1)}} onClick={()=>{handleRating(i+1)}}/>)
        }
        
         setComponent(<div className='w-auto flex items-center justify-center gap-1'>
            {stars}
        </div>)
    }

    useEffect(()=>{
        generateRating(orating)
    },[orating])

    return (
        <div className='w-full flex items-center justify-start gap-2'>
        {component}
        <span className='text-lg text-yellow-400'>{orating}</span>
        </div>
    )
}
