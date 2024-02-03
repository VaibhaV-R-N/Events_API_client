import { createSlice } from "@reduxjs/toolkit";

const cookieSlice = createSlice({
    name:"cookie",
    initialState:{
        token:'',
        id:'',
        username:''
    },
    reducers:{
        setCookie: (state,action)=>{
            const {type,value} = action.payload
            if(type==="token"){
                state.token = value
            } else if(type === "id"){
                state.id = value
            } else if (type === "username"){
                state.username = value
            }
        },
        removeCookie: (state,action)=>{
            state.token = '',
            state.id = '',
            state.username = ''
        }
    }
   
})

export const {setCookie,removeCookie} = cookieSlice.actions
export default cookieSlice.reducer