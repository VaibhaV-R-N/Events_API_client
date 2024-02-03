import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name:"notification",
    initialState:{
        open:false,
        type:"",
        message:""
    },
    reducers:{
        openNotification: (state,action)=>{
            const {type,message} = action.payload
            state.open = true
            state.type = type
            state.message = message
        },
        closeNotification:(state,action)=>{
            state.open = false,
            state.type = "",
            state.message = ""
        }
    }
})


export const {openNotification,closeNotification} = notificationSlice.actions
export default notificationSlice.reducer