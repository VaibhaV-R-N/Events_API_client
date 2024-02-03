import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router';
import { setUpdate } from '../store/features/Update/updateSlice';
import { useMutation } from '@tanstack/react-query';
import { openNotification } from '../store/features/Notification/notificationSlice';
import { useQueryClient } from '@tanstack/react-query';

export default function Comment({comment,eid}) {
    const cookie  = useSelector(state=>state.cookie)
    const dispatch = useDispatch()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const handleEdit = ()=>{
        dispatch(setUpdate({type:"comment",data:comment,eid}))
        navigate('/update')
    }
    const deleteComment = useMutation({
        mutationKey:["deleteComment"],
        mutationFn:async(cid)=>{
            return await (await fetch(`https://event-api-xbo5.onrender.com/events/${eid}/comment/${cid}`,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${cookie.token}`
                }
                
            })).json()
        },
        onError:(error)=>{
            dispatch(openNotification({type:"error",message:"Something went wrong..."}))
        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:"Something went wrong..."}))
            }else{
                queryClient.invalidateQueries({queryKey:["event"]})
               
                dispatch(openNotification({type:"success",message:"Comment deleted successfully"}))
            }
        }
    })
    const handleDelete = (cid)=>{
        deleteComment.mutate(cid)
    }

    return (
    <div className=' border border-green-400 rounded-md w-full lg:w-1/2  h-auto  p-2 flex flex-col items-center justify-center gap-2'>
        <div className='w-full h-auto flex flex-row items-center justify-between '>
            <p className='inline-block text-xl text-yellow-400 '>{comment.user?.username || "unknown"}</p>
            <p className='inline-block text-lg text-green-400'>{comment.date}</p>
        </div>
        <p className= 'w-full h-auto text-wrap break-words text-white text-lg'>{comment.value}</p>
        {cookie.id === comment.user?._id? <div className='w-full flex items-center justify-end gap-5'>
            <MdEdit className='text-yellow-400 w-8 h-8 cursor-pointer' onClick={handleEdit}/>
            <MdDelete className='text-red-400 w-8 h-8 cursor-pointer' onClick={()=>{handleDelete(comment._id)}}/>
            </div>:null }
    </div>
  )
}
