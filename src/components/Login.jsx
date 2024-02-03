import React, { useEffect, useState } from 'react'
import { useLoginUser } from '../query'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { openNotification } from '../store/features/Notification/notificationSlice'
import { setCookie as set } from '../store/features/Cookie/cookieSlice'
import { useCookies } from 'react-cookie'
export default function Login() {
    const [data,setData] = useState({
        username:"",
        password:""
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [cookies,setCookie,removeCookie] = useCookies(['user'])
    const loginUser = useLoginUser(dispatch,navigate,setCookie)
    const cookie = useSelector(state=>state.cookie)
    
    useEffect(()=>{
        if(cookie.token){
            navigate('/events')
        }
    },[cookie.token])
    const handleChange = (type,value)=>{
        if(type === "username"){
            setData(prevState=>{
                return {...data,username:value}
            })
        }else if(type === "password"){
            setData(prevState=>{
                return {...data,password:value}
            })
        }
    }

    const handleLogin = ()=>{
        if(data.password.trim() !== ""  && data.username.trim() !== ""){
        
            loginUser.mutate(JSON.stringify({
                username:data.username,
                password:data.password,
                
            }))
        }else{
            dispatch(openNotification({type:"error",message:"invalid submission!"}))

        }
    }

    return (
        <div className='flex flex-col items-center justify-center gap-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 lg:w-1/2 h-auto p-5  rounded-md shadow-lg shadow-black'>
            <div className='flex flex-col items-center justify-center gap-2 w-full p-3 h-auto'>
                <h3 className='w-full lg:w-2/3 text-md text-yellow-400'>username</h3>
                <input className='input' value={data.username}  onChange={(e)=>{handleChange("username",e.target.value)}} type="text" placeholder='username'/>
            </div>
            
            <div className='flex flex-col items-center justify-center gap-2 w-full p-3 h-auto'>
                <h3 className='w-full lg:w-2/3 text-md text-yellow-400'>password</h3>
                <input className='input' value={data.password}  onChange={(e)=>{handleChange("password",e.target.value)}} type="password" placeholder='password'/>
            </div>
            <button className='btn'  onClick={handleLogin} >Login</button>
        </div>
    )
}
