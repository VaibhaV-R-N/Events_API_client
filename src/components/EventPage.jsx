import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { useCreateTicket, useGetEventById } from '../query'
import { useDispatch, useSelector } from 'react-redux'
import { openNotification } from '../store/features/Notification/notificationSlice'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Comment from './Comment'
import Rating from './Rating'

import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { setUpdate } from '../store/features/Update/updateSlice'

export default function Event() {
    const {eventid} = useParams()
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [price,setPrice] = useState("VIP")
    const [quantity,setQuantity] = useState(1)
    const [comment,setComment] = useState("")
    const queryClient = useQueryClient()
    const cookie = useSelector(state=>state.cookie)
    const {data,isSuccess,isLoading,isError} = useGetEventById(eventid)
    const buyTicket = useCreateTicket(dispatch,navigate,queryClient)
    let component = null
    const changeHandler = (value)=>{
        if(value > 10 || value < 1){
            dispatch(openNotification({type:"error",message:"You can't buy more than 10 tickets and less than 1"}))
        }
        setQuantity(value <= 10? value < 1?1:value:10)
    }

    const buyHandler = ()=>{
       
        if(!cookie.token){
            navigate("/login")
            return
        }
        try {
            buyTicket.mutate({payload:JSON.stringify({
                user:cookie.id,
                eventname:eventid,
                tickettype:price,
                price:data.price[price],
                quantity:quantity,
                
            }),eventid,cookie})
        } catch (error) {
            dispatch(openNotification({type:"error",message:"something went wrong..."}))
        }
    }

    const deleteEvent = useMutation({
        mutationKey:["deleteEvent"],
        mutationFn:async()=>{
            return await (await fetch(`https://event-api-xbo5.onrender.com/events/${eventid}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                }
                
            })).json()
        },
        onError:(error)=>{
            dispatch(openNotification({type:"error",message:"Failed to delete event..."}))
        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:data.error}))
            }else{
                queryClient.invalidateQueries({queryKey:["events"]})
                dispatch(openNotification({type:"success",message:"successfully deleted the event..."}))
                navigate('/events')
            }
        }
    })

    const createComment = useMutation({
        mutationKey:["comment"],
        mutationFn:async()=>{
            return await fetch(`https://event-api-xbo5.onrender.com/events/${eventid}/comment/`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                },
                body:JSON.stringify({
                    eventId:eventid,
                    user:cookie.id,
                    value:comment,
                    date: new Date().toLocaleString("en-US",{
                        day:"numeric",
                        month:"numeric",
                        year:"numeric"
                        
                    })
                    
                })
            })
        },
        onError:()=>{
            dispatch(openNotification({type:"error",message:"Something went wrong..."}))
        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:data.error}))
            }else{
                queryClient.invalidateQueries({queryKey:["event"]})
                setComment("")
                dispatch(openNotification({type:"success",message:"Comment posted successfully"}))
            }
        }
    })

    

    const postComment = ()=>{
        if(!cookie.id){
            navigate('/login')
        }else{
            if(comment.trim() !== ""){
                createComment.mutate()
            }
        }
    }

    const eventEditHandler = ()=>{
        dispatch(setUpdate({type:"event",data,eid:data._id}))
        navigate('/update')
    }

    const eventDeleteHandler = ()=>{
        deleteEvent.mutate()
    }

    if(isLoading){
        component = <div className='text-yellow-400'>Loading...</div>
    }
    
    if(isSuccess){
  
        component = <div className='w-full p-2 lg:w-2/3 h-auto flex flex-col items-center justify-start gap-5'>
                <h3 className='w-full text-2xl text-yellow-400'>{data.title}</h3>
                <Rating orating={Math.floor(data.overallrating)} user={cookie.id} eventId={eventid} />
                <p className='text-white w-full text-wrap break-words'>{data.description}</p>
                <h5 className='w-full text-white'>{`${data.date} ${data.time} ${data.location}`}</h5>
                {cookie.id === data.organizer?<div className='w-full flex items-center justify-start gap-5'>
                    <MdEdit className='w-16 h-16 text-yellow-400 cursor-pointer' onClick={eventEditHandler}/>
                    <MdDelete className='w-16 h-16 text-red-400 cursor-pointer' onClick={eventDeleteHandler}/>
                </div>:null}
                <div className='w-full  h-auto gap-5 flex flex-col lg:flex lg:flex-row   items-center justify-between'>
                    <select onChange={(e)=>{setPrice(e.target.value)}} className='input !w-2/3 lg:!w-1/3'>
                        <option value="VIP">{`VIP $${data.price.VIP}`}</option>
                        <option value="General">{`General $${data.price.General}`}</option>
                        <option value="Student">{`Student $${data.price.Student}`}</option>
                    </select>
                    <input className='input !w-2/3 lg:!w-40' value={quantity} onChange={(e)=>{changeHandler(e.target.value)}} type="number" max={10} placeholder='Quantity'/>
                    <button className='btn w-2/3 lg:w-40' onClick={buyHandler} >Buy</button>
                </div>
                <h3 className='w-full text-2xl text-yellow-400'>Comments</h3>
                <div className='w-full flex flex-col lg:flex lg:flex-row items-center justify-start gap-10'>
                    <textarea className='textarea w-2/3 lg:w-1/2' value={comment} onChange={(e)=>{setComment(e.target.value)}} placeholder='Type Something...'/>
                    <button className='btn' onClick={postComment} >Comment</button>
                </div>
                <div className='w-full h-auto flex flex-col items-center lg:items-start justify-start gap-5'>
                    {data.comments.map(comment=>{
                        return <Comment key={comment._id} comment={comment} eid={data._id}/>
                    })}
                </div>

            </div>
    }
    if(isError){
        component = <div className='text-yellow-400'>something went wrong...</div>
    }

    return (
        <div className='mt-5 w-full p-2 flex flex-col h-auto items-center justify-center gap-5' >
            <img src={params.get('src')} alt="" className='w-full lg:w-2/3 h-80 object-cover rounded-md' />
            {component}
        </div>
    )
}
