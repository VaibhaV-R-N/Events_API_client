import React, { useState } from 'react'
import { FaChevronUp,FaChevronDown } from "react-icons/fa";

export default function Accordian({logo,children,title}) {
    const [open,setOpen] = useState(false)
    return (
        <div className='shadow-md shadow-black/45 w-full  rounded-bl-md rounded-br-md h-auto flex flex-col items-center justify-center'>
            <div className='w-full h-32 flex flex-row p-2 items-center justify-between'>
                <div className='w-2/3 flex flex-row items-center justify-start gap-3'>{logo}<h5 className='text-xl text-white'>{title}</h5></div>
                {open?<FaChevronUp className='w-8 h-2/3 text-red-700' onClick={()=>{setOpen((prevState=>{
                    return !prevState
                }))}}/>:<FaChevronDown className='w-8 h-2/3 text-green-400' onClick={()=>{setOpen((prevState=>{
                    return !prevState
                }))}}/>}
            </div>
            {open?children:null}
        </div>
    )
}
