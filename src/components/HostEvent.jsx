import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openNotification } from '../store/features/Notification/notificationSlice'
import {  useMutation, useQueryClient } from '@tanstack/react-query'

import { useNavigate } from 'react-router'

export default function HostEvent() {
    const [title,setTitle] = useState("")
    const [description,setDescription] = useState("")
    const [date,setDate] = useState("")
    const [time,setTime] = useState("")
    const [location,setLocaion] = useState("")
    const [price,setPrice] = useState({
        vip:50,
        general:25,
        student:15
    })
    const cookie = useSelector(state=>state.cookie)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const queryClient  = useQueryClient()
    const createEvent = useMutation({
        mutationKey:["create_event"],
        mutationFn: async(payload)=>{
            return (await fetch("https://event-api-xbo5.onrender.com/events",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                },
                body:payload
            })).json()
        },
        onError:()=>{
            dispatch(openNotification({type:"error",message:"something went wrong..."}))

        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:"something went wrong..."}))

            }else{
                dispatch(openNotification({type:"success",message:"event successfully created..."}))
                queryClient.invalidateQueries({queryKey:["events"]})
                navigate("/events")
            }
        }
    })
    const handleChange= (value,type)=>{
        if(type === "title"){
            setTitle(value)
        }else if(type === "description"){
            setDescription(value)
        }
        else if(type === "date"){
            setDate(value)
        }else if(type === "time"){
            setTime(value)
        }
        else if(type === "location"){
            setLocaion(value)
        }
        else if(type === "vip"){
            setPrice(prevState=>{
                return {...prevState,vip:value}
            })
        }else if(type === "general"){
            setPrice(prevState=>{
                return {...prevState,general:value}
            })
        }else if(type === "student"){
            setPrice(prevState=>{
                return {...prevState,student:value}
            })
        }
    }

    const submitHandler= async()=>{

        if(cookie.id){
            if(!title || !description || !date || !time || !location ){
                dispatch(openNotification({type:"error",message:"fields cannot be empty"}))
                return 
            }
            createEvent.mutate(JSON.stringify({
                title,
                description,
                date,
                time,
                location,
                organizer:cookie.id,
                price:{
                    VIP:price.vip,
                    General:price.general,
                    Student:price.student
                },
                
                    token:cookie.token
                
            }))
        }
        else{
            navigate('/login')
        }
        
      
        

    }

    return (
        <div className='w-full h-auto border rounded-md border-green-400 shadow-md shadow-black flex flex-col items-center justify-between'>
            <img src='/hostevent.jpg' className='w-full h-64 object-cover  rounded-tl-md rounded-tr-md'/>
            <div className='w-full mt-8 mb-8 p-2 h-auto flex flex-col items-center justify-center gap-10'>
                <div className='w-full h-auto flex flex-col items-center justify-center gap-3'>
                    <h3 className='text-yellow-400 w-full lg:w-2/3'>title</h3>
                    <input type="text" className='input' value={title} onChange={(e)=>{handleChange(e.target.value,"title")}}/>
                </div>
                <div className='w-full h-auto flex flex-col items-center justify-center gap-3'>
                    <h3 className='text-yellow-400 w-full lg:w-2/3'>description</h3>
                    <textarea className='textarea' value={description} onChange={(e)=>{handleChange(e.target.value,"description")}}/>
                </div>
                <div className='w-full h-auto flex flex-col items-center justify-center gap-3'>
                    <h3 className='text-yellow-400 w-full lg:w-2/3'>date</h3>
                    <input type="date" className='input' value={date} onChange={(e)=>{handleChange(e.target.value,"date")}}/>
                </div>
                <div className='w-full h-auto flex flex-col items-center justify-center gap-3'>
                    <h3 className='text-yellow-400 w-full lg:w-2/3'>time</h3>
                    <input type="time" className='input' value={time} onChange={(e)=>{handleChange(e.target.value,"time")}}/>
                </div>
                <div className='w-full h-auto flex flex-col items-center justify-center gap-3'>
                    <h3 className='text-yellow-400 w-full lg:w-2/3'>location</h3>
                    <input type="text" className='input' value={location} onChange={(e)=>{handleChange(e.target.value,"location")}}/>
                </div>
                <div className='w-full h-auto flex flex-col items-center justify-center gap-3'>
                    <h3 className='text-yellow-400 w-full lg:w-2/3'>Price in dollar($)</h3>
                    <div className='w-full  flex flex-col lg:flex lg:flex-row  items-center justify-center gap-12'>
                        <input placeholder='VIP' type="number" className='input !w-40'  onChange={(e)=>{handleChange(e.target.value,"vip")}}/>
                        <input placeholder='General' type="number" className='input !w-40'  onChange={(e)=>{handleChange(e.target.value,"general")}}/>
                        <input placeholder='Student' type="number" className='input !w-40'  onChange={(e)=>{handleChange(e.target.value,"student")}}/>

                    </div>
                </div>
                <button className='btn' onClick={async()=>{await submitHandler()}}>Submit</button>
            </div>
        </div>
    )
}
