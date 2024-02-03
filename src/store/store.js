import { configureStore,combineReducers } from "@reduxjs/toolkit";
import NotificationReducer from "./features/Notification/notificationSlice"
import CookieReducer from "./features/Cookie/cookieSlice"
import updateReducer from "./features/Update/updateSlice";
const RootReducer = combineReducers({
    notification:NotificationReducer,
    cookie:CookieReducer,
    update: updateReducer
})

export const store = configureStore({
    reducer:RootReducer
})

