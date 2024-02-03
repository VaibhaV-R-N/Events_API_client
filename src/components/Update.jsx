import { useMutation,useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { openNotification } from '../store/features/Notification/notificationSlice'
import { useCookies } from 'react-cookie'
import { setCookie as set } from '../store/features/Cookie/cookieSlice'
export default function update() {
    const updateType = useSelector(state=>state.update.type)
    const navigate = useNavigate()
    const payload = useSelector(state=>state.update.payload)
    const eventId = useSelector(state=>state.update.eid) || undefined
    const cookie = useSelector(state=>state.cookie)
    const queryClient = useQueryClient()
    const dispatch = useDispatch()
    const [cookies,setCookie,removeCookie] = useCookies(['user'])
    const [event,setEvent]  = useState({
        title:payload.title || undefined,
        description:payload.description || undefined,
        date:payload.date || undefined,
        time:payload.time || undefined,
        location:payload.location || undefined,
        price:{
            VIP:payload.price?.VIP || undefined,
            General:payload.price?.General || undefined,
            Student:payload.price?.Student || undefined
        }
    })

    const [user,setUser] = useState({
        username:payload.username || undefined,
        oldPassword:"",
        newPassword:""
    })

    const [comment,setComment] = useState({
        value:payload.value || undefined
    })

    const updateEvent = useMutation({
        mutationKey:['updateEvent'],
        mutationFn: async()=>{
            return await (await fetch(`https://event-api-xbo5.onrender.com/events/${payload._id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                },
                body:JSON.stringify({...event})
        })).json()},
        onError:()=>{
            dispatch(openNotification({type:"error",message:"Failed to update..."}))
        },
        onSettled:(data)=>{
        
            if(data.error){
                dispatch(openNotification({type:"error",message:"Something went wrong..."}))

            }else{
                dispatch(openNotification({type:"success",message:"Successfuly updated the event"}))
       
                queryClient.invalidateQueries({queryKey:["event"]})
                queryClient.invalidateQueries({queryKey:["events"]})
                navigate('/events')

            }
        }
    })

    const updateComment = useMutation({
        mutationKey:["updateComment"],
        mutationFn:async()=>{
            return await (await fetch(`https://event-api-xbo5.onrender.com/events/${eventId}/comment/${payload._id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                },
                body:JSON.stringify({
                    ...comment
                    })
            })).json()
        },
        onError:(error)=>{
            dispatch(openNotification({type:"error",message:error.message}))
        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:"Something went wrong..."}))

            }else{
                dispatch(openNotification({type:"success",message:"Successfuly updated the comment"}))
           
                queryClient.invalidateQueries({queryKey:["event"]})
      
                navigate('/events')

            }
        }
            

    })

    const updateUser = useMutation({
        mutationKey:["updateUser"],
        mutationFn:async()=>{
       
            return await (await fetch(`https://event-api-xbo5.onrender.com/user/${payload.id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                },
                body:JSON.stringify({
                    ...user
                    })
            })).json()
        },
        onError:(error)=>{
            dispatch(openNotification({type:"error",message:error.message}))
        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:data.error}))

            }else{
       
                dispatch(openNotification({type:"success",message:"Successfuly updated your profile"}))
          
                setCookie("username",data.username,{path:"/",maxAge:3600})
                dispatch(set({type:"username",value:data.username}))
                navigate('/user')

            }
        }
            

    })

    const handleChange = (key,value)=>{
        if(updateType === "event"){
            if(key === "VIP" || key === "General" || key === "Student"){
                let price = {...event.price,[key]:value}
                setEvent({...event,price})
            }else{
                setEvent({...event,[key]:value})
            }
        } else if(updateType === "user"){
            setUser({...user,[key]:value})
        } else if(updateType === "comment"){
            setComment({...comment,value})
        }
    }

    const handleUpdateEvent = ()=>{
        if(updateType === "event")
            updateEvent.mutate()
        else if(updateType === "comment")
            updateComment.mutate()
        else if(updateType === "user")
            updateUser.mutate()
            
    }

    const getComponent = ()=>{
        if(updateType === "event"){
            return <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3 shadow-lg  w-2/3 flex h-auto items-center p-4 justify-center flex-col gap-5'>
                    <input className='input' type="text" placeholder='title' value={event.title}  onChange={(e)=>{handleChange("title",e.target.value)}}/>
                    <textarea  className='textarea' placeholder='description' value={event.description}  onChange={(e)=>{handleChange("description",e.target.value)}}/>
                    <input className='input' type="date" name="" id="" value={event.date}  onChange={(e)=>{handleChange("date",e.target.value)}}/>
                    <input className='input' type="time" value={event.time} onChange={(e)=>{handleChange("time",e.target.value)}}/>
                    <input className='input' type="text" value={event.location} onChange={(e)=>{handleChange("location",e.target.value)}}/>
                    <input type="number" className='input' placeholder='VIP Price' value={event.price.VIP} onChange={(e)=>{handleChange("VIP",e.target.value)}}/>
                    <input type="number" className='input' placeholder='General Price' value={event.price.General} onChange={(e)=>{handleChange("General",e.target.value)}}/>
                    <input type="number" className='input' placeholder='Student Price' value={event.price.Student} onChange={(e)=>{handleChange("Student",e.target.value)}}/>
                    <button className='btn' onClick={handleUpdateEvent}>update</button>
                </div>
        }else if(updateType === "user"){
            return <div className='p-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg  w-2/3 flex h-auto items-center  justify-center flex-col gap-5'>
                    <input className='input' value={user.username} type="text" placeholder='username' onChange={(e)=>{handleChange("username",e.target.value)}} />
                    <input className='input' value={user.oldPassword} type="password" placeholder='old password' onChange={(e)=>{handleChange("oldPassword",e.target.value)}}/>
                    <input className='input' value={user.newPassword} type="password" placeholder='new password'onChange={(e)=>{handleChange("newPassword",e.target.value)}}/>
                    <button className='btn ' onClick={handleUpdateEvent}>update</button>
                </div>
        }else if(updateType === "comment"){
            return <div className='p-4 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg  w-2/3 flex h-auto items-center  justify-center flex-col gap-5'>
                    <textarea  className='textarea' placeholder='comment' onChange={(e)=>{handleChange("comment",e.target.value)}} value={comment.value}/>
                    <button className='btn' onClick={handleUpdateEvent} >update</button>
                </div>
        }
    }

    return getComponent(updateType)
}
