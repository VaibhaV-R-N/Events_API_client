export const getEvents = async()=>{
    return (await (await fetch("https://event-api-xbo5.onrender.com/events")).json()).response
}

export const getEventById = async(id)=>{
    return (await (await fetch(`https://event-api-xbo5.onrender.com/events/${id}`)).json()).response
    
}

export const getEventByTitle = async(title)=>{
    const response =  (await (await fetch(`https://event-api-xbo5.onrender.com/events/title/${title}`)).json())
    if(response.error){
        return []
    }else{
        return response.events
    }
    
    
}

export const getEventByDate = async(date)=>{
    const response =  (await (await fetch(`https://event-api-xbo5.onrender.com/events/date/${date}`)).json())
    if(response.error){
        return []
    }else{
        return response.events
    }
    
}

export const getEventByLocation = async(location)=>{
    const response =  (await (await fetch(`https://event-api-xbo5.onrender.com/events/location/${location}`)).json())
    if(response.error){
        return []
    }else{
        return response.events
    }
    
}

export const createUser = async(payload)=>{
    
    return (await (await fetch(`https://event-api-xbo5.onrender.com/user/signup`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:payload
    })).json())
    
}

export const loginUser = async(payload)=>{

    return (await (await fetch(`https://event-api-xbo5.onrender.com/user/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:payload
    })).json())
    
}

export const createTicket = async(payload,eid,cookie)=>{
   
    return  (await (await fetch(`https://event-api-xbo5.onrender.com/events/${eid}/ticket`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${cookie.token}`
        },
        body:payload
    })).json())
    
}