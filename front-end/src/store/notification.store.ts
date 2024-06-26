import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationStateInterface } from '../utils/common.interfaces';
import { AuthApiService } from '../services/auth-api.service';
import appConst from '../constants/app.const';
import { ResponseType } from '../utils/contome.datatype';
import moment from 'moment';
import { authActions } from './auth-store.store';
const initialState: NotificationStateInterface = {
    page: 1,
    perPage: 10,
    notifications: [],
    grid: [],
    total: 0,
    isLoading: false,
    error: null,
    gridFilters: {}
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<NotificationStateInterface>>) => {
            return { ...state, ...action.payload };
        },
        reset: (state)=>{
            return { ...state, ...initialState };
        }

    }
});
export const notificationActions = {
    ...notificationSlice.actions,
    notificationsList: (page: number, perPage: number, gridFilters: {[key:string]: any}) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(notificationSlice.actions.startAction())
            const authService = new AuthApiService(appConst.API_URL)
            const notificationResult = await authService.notifications(page, perPage, gridFilters);
            if (notificationResult.type == ResponseType.success) {
                const notificationData = notificationResult.data.data.map((d: { timestamp: moment.MomentInput; })=>{
                    d.timestamp = d.timestamp?moment(d.timestamp).fromNow():''
                    return d;
                })
                dispatch(notificationSlice.actions.updateState({grid: notificationResult.grid, notifications: notificationData, total: notificationResult.data.total }));
                dispatch(authActions.updateState({notifications: notificationData, totalUnRead: notificationData.filter(d=>d.status=='unread').length}))
            } else {
                error = notificationResult.message;
            }

        } catch (e:any) {
            error = e.message;
        }
        dispatch(notificationSlice.actions.actionDone({ error: error }))
    },
}

export default notificationSlice.reducer;