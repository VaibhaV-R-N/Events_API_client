import { createSlice } from "@reduxjs/toolkit";

const updateSlice = createSlice({
    name:"update",
    initialState:{
        type:"",
        payload:null,
        eid:""
    },
    reducers:{
        setUpdate : (state,action)=>{
            state.type = action.payload.type
            state.payload = action.payload.data
            state.eid = action.payload.eid
        },
        clearUpdate: (state)=>{
            state.type= ""
            state.payload = null
        }
        
    }

})

export const {setUpdate,clearUpdate} = updateSlice.actions

export default updateSlice.reducer