import { configureStore } from '@reduxjs/toolkit';
import sidebarReducer from './slices/sidebarSlice';
import userReducer from './slices/userSlice';
import claimsReducer from './slices/claimsSlice';
import customersReducer from './slices/customersSlice';


export const store = configureStore({
    reducer: {
        sidebar: sidebarReducer,
        user: userReducer,
        claims: claimsReducer,
        customers: customersReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
