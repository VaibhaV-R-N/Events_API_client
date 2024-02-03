import React, { useState,useEffect } from 'react'
import { useCreateUser } from '../query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useCookies } from 'react-cookie'
import { openNotification } from '../store/features/Notification/notificationSlice'
import { useSelector } from 'react-redux'
export default function Signup() {
    const [ data,setData] = useState({
        username:"",
        password:"",
        confirmPassword:""
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [cookies,setCookie,removeCookie] = useCookies(['user'])
    const createUser = useCreateUser(dispatch,navigate,setCookie)
    const cookie = useSelector(state=>state.cookie)
    useEffect(()=>{
        if(cookie.token){
            navigate('/events')
        }
    },[cookie.token])
    const handleChange = (type,value)=>{
        if(type === "username"){
            setData(prevState=>{
                return {...prevState,username:value}
            })
        } else if(type === "password"){
            setData(prevState=>{
                return {...prevState,password:value}
            })
        } else if(type === "cPassword"){
            setData(prevState=>{
                return {...prevState,confirmPassword:value}
            })
        }
    }

    const handleSignup = ()=>{
        if( (data.password === data.confirmPassword) && data.username.trim() !== ""){
       
            createUser.mutate(JSON.stringify({
                username:data.username,
                password:data.password,
                confirmPassword:data.confirmPassword
            }))
        }else{
            dispatch(openNotification({type:"error",message:"password do not match!"}))

        }
    }

    return (
        <div className='mt-5 flex flex-col items-center justify-center gap-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 lg:w-1/2 h-auto p-5  rounded-md shadow-lg shadow-black'>
            <div className='flex flex-col items-center justify-center gap-2 w-full p-3 h-auto'>
                <h3 className='w-full lg:w-2/3 text-md text-yellow-400'>username</h3>
                <input value={data.username} onChange={(e)=>{handleChange("username",e.target.value)}} className='input' type="text" placeholder='username'/>
            </div>
            
            <div className='flex flex-col items-center justify-center gap-2 w-full p-3 h-auto'>
                <h3 className='w-full lg:w-2/3 text-md text-yellow-400'>password</h3>
                <input value={data.password} onChange={(e)=>{handleChange("password",e.target.value)}} className='input' type="password" placeholder='password'/>
            </div>

            <div className='flex flex-col items-center justify-center gap-2 w-full p-3 h-auto'>
                <h3 className='w-full lg:w-2/3 text-md text-yellow-400'>confirm password</h3>
                <input value={data.confirmPassword} onChange={(e)=>{handleChange("cPassword",e.target.value)}} className='input' type="password" placeholder='confirm password'/>
            </div>
            
            <button className='btn' onClick={handleSignup} >Signup</button>
        </div>
  )
}
