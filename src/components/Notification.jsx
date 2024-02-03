import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { closeNotification } from '../store/features/Notification/notificationSlice';
import { MdCancel } from "react-icons/md";
export default function Notification() {
    const notificationState = useSelector(state=>state.notification)
    const dispatch = useDispatch()
    useEffect(()=>{
        if(notificationState.open){
            const timeout = setTimeout(()=>{
                dispatch(closeNotification())
            },3000)

            return ()=>{
                clearTimeout(timeout)
            }
        }
        
    },[notificationState.open])
    return (
        notificationState.open?
        notificationState.type ==="success"?
        <div className='left-1/2 -translate-x-1/2 bg-neutral-950  z-30 w-auto h-auto fixed bottom-3 flex flex-row items-center justify-between p-2 border border-green-400 rounded-md gap-3'>
            <FaCheckCircle  className='w-9 h-9 text-green-400 text-xl'/>
            <h3 className='text-white'>{notificationState.message}</h3>
            <MdCancel onClick={()=>{dispatch(closeNotification())}} className='text-yellow-400 h-9 w-9'/>
        </div>:<div className='left-1/2 -translate-x-1/2 bg-neutral-950 z-30 w-auto h-auto fixed bottom-3 flex flex-row items-center justify-between p-2 border border-red-700 rounded-md gap-3'>
            <MdError className='text-red-700 w-9 h-9 '/>
            <h3 className='text-white'>{notificationState.message}</h3>
            <MdCancel onClick={()=>{dispatch(closeNotification())}} className='text-yellow-400 h-9 w-9'/>
        </div>:null
    )
        
    
}
