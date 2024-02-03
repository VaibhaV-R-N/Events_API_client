import { useQuery,useMutation } from "@tanstack/react-query";
import { createTicket, createUser, getEventByDate, getEventById, getEventByLocation, getEventByTitle, getEvents, loginUser } from "./api";
import { openNotification } from "../store/features/Notification/notificationSlice";
import { setCookie } from "../store/features/Cookie/cookieSlice";
export const useGetEvents = ()=>{

    return useQuery({
        queryKey:["events"],
        queryFn:getEvents
    })

}

export const useGetEventById = (id)=>{

    return useQuery({
        queryKey:["event"],
        queryFn:async()=> {return await getEventById(id)}
    })

}

export const useGetEventByTitle = (title)=>{

    return useQuery({
        queryKey:["tevent"],
        queryFn:async ()=> { return await getEventByTitle(title)},
        
    })

}

export const useGetEventByDate = (date)=>{

    return useQuery({
        queryKey:["devent"],
        queryFn:async()=> {return await getEventByDate(date)}
    })

}

export const useGetEventByLocation = (location)=>{

    return useQuery({
        queryKey:["levent"],
        queryFn:async()=> {return await getEventByLocation(location)}
    })

}

export const useCreateUser = (dispatch,navigate,setCookies)=>{

    return useMutation({
        mutationKey:["user"],
        mutationFn:async (payload)=>{ return await createUser(payload)},
        onError:(error)=>{
       
            dispatch(openNotification({type:"error",message:"Failed to create account..."}))
        },
        onSettled:(data)=>{
     
            if(data.error){
                dispatch(openNotification({type:"error",message:data.error}))
            }else{
                setCookies('token',data.token,{path:'/',maxAge:3600})
                setCookies('id',data.id,{path:'/',maxAge:3600})
                setCookies('username',data.username,{path:'/',maxAge:3600})
                dispatch(setCookie({type:"token",value:data.token}))
                dispatch(setCookie({type:"id",value:data.id}))
                dispatch(setCookie({type:"username",value:data.username}))

                dispatch(openNotification({type:"success",message:"Account created successfully."}))
                navigate('/user')
            }
            
        }
    })

}

export const useLoginUser = (dispatch,navigate,setCookies)=>{

    return useMutation({
        mutationKey:["login"],
        mutationFn:async (payload)=>{ return await loginUser(payload)},
        onError:(error)=>{
     
            dispatch(openNotification({type:"error",message:"Failed to login..."}))
        },
        onSettled:(data)=>{
            if(data.error){
                dispatch(openNotification({type:"error",message:data.error}))
            
            }else{
        
                setCookies('token',data.token,{path:'/',maxAge:3600})
                setCookies('id',data.id,{path:'/',maxAge:3600})
                setCookies('username',data.username,{path:'/',maxAge:3600})
                dispatch(setCookie({type:"token",value:data.token}))
                dispatch(setCookie({type:"id",value:data.id}))
                dispatch(setCookie({type:"username",value:data.username}))

                dispatch(openNotification({type:"success",message:"Successfully logged in."}))
                navigate('/user')
            }
            
        }
    })

}

export const useCreateTicket = (dispatch,navigate,queryClient)=>{
    return useMutation({
        mutationKey:["ticket"],
        mutationFn:async (variables)=>{
   
            return await createTicket(variables.payload,variables.eventid,variables.cookie)
        },

        onError:(error)=>{
      
            dispatch(openNotification({type:"error",message:"Failed to buy ticket..."}))

        },
        onSettled:(data)=>{
            if(data.error){
              
                dispatch(openNotification({type:"error",message:data.error}))
            }else{
                navigate('/user')
                queryClient.invalidateQueries({queryKey:["tickets"]})

                dispatch(openNotification({type:"success",message:"purchase successfull."}))
            }
        }
    })
}