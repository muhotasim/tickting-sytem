import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-store.store';
import uiSlice from './ui.store';
import notificationSlice from './notification.store';
import usersSlice from './users.store';
import logger from 'redux-logger';
import rolesSlice from './roles.store';
import permissionSlice from './permissions.store';
import ticketSlice from './tickets.store';
export const rootStore = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    notification: notificationSlice,
    user: usersSlice,
    roles: rolesSlice,
    permissions: permissionSlice,
    tickets: ticketSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});


export type RootState = ReturnType<typeof rootStore.getState>
export type AppDispatch = typeof rootStore.dispatch