import React, {useEffect, useState } from 'react'
import { useGetEventByDate, useGetEventByLocation, useGetEventByTitle, useGetEvents } from '../query'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AllEvents from './AllEvents'
import TitleEvents from './TitleEvents'
import DateEvents from './DateEvents'
import LocationEvents from './LocationEvents'

export default function Events() {
    

    const [searchType,setSearchType] = useState("all")
    const [query,setQuery] = useState("")
 
    // const dateEvents = useGetEventByDate(query)
    // const locationEvents = useGetEventByLocation(query)

    const navigate  = useNavigate()
    const images = useQuery({
        queryKey:["images"],
        queryFn:async()=>{
            return  (await (await fetch(`https://api.unsplash.com/search/photos?page=1&query=social&per_page=100&client_id=${access_key}`)).json()).results
        }
    }) 
   
 
    const getComponentsTitle = ()=>{
        const events = useGetEventByTitle(query)
        if(events.isLoading || images.isLoading ){
            return <div className='text-2xl text-yellow-400'>Loading...</div>
        }
        
        if(events.isSuccess && images.isSuccess){
        
            return <div className='w-full h-auto mt-5 flex flex-row items-center justify-start gap-5 p-2 flex-wrap '>
                {events.data.map((evnt,i)=>{
                return  <div onClick={()=>{ navigate(`/events/${evnt._id}?src=${encodeURIComponent(images.data[i].urls.regular)}`)}} className='cursor-pointer w-80 h-auto shadow-md shadow-black/70 rounded-md' key={evnt._id}>
                <img className='w-full h-40 object-cover rounded-tl-md rounded-tr-md'  src={images.data[i].urls.small} alt="" />
                <p className='text-white text-xl w-full p-1 text-wrap break-words' >{evnt.title}</p>
                <h4 className='text-yellow-400 text-md p-1' >{`Date: ${evnt.date}.`}</h4>
                <h4 className='text-yellow-400 text-sm p-1' >{`Time: ${evnt.time}.`}</h4>

                </div>
                })}
            </div>
 
        }

    }
    
    return <div className='w-full h-auto flex flex-col items-center justify-center gap-5 mt-10'>
    <div className='w-full h-auto flex items-center justify-evenly gap-10'>
        <select className='input !w-[20%] lg:!w-[15%]' onChange={(e)=>{setSearchType(e.target.value);setQuery("")}}>
            <option value="all">All</option>
            <option value="title">Title</option>
            <option value="date">Date</option>
            <option value="location">Location</option>
        </select>
        {
            searchType === "title"? <input type="text" placeholder='search by title...' className='input  !w-1/2 lg:!w-1/3' onChange={(e)=>{setQuery(e.target.value)}} value={query}/>:searchType === "date"?<input type="date" className='input  !w-1/2 lg:!w-1/3' onChange={(e)=>{setQuery(e.target.value)}} value={query}/>:searchType === "location"?<input type="text" placeholder='search by location...' className='input  !w-1/2 lg:!w-1/3' onChange={(e)=>{setQuery(e.target.value)}} value={query}/>:null
        }
        
    </div>
     {searchType === "all"?<AllEvents/>:searchType ==="title"?<TitleEvents query={query}/>:searchType === "date"?<DateEvents query={query}/>:searchType==="location"?<LocationEvents query={query}/>:null}
    </div>
    
}
