import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import appConst from '../constants/app.const';
import { ResponseType } from '../utils/contome.datatype';
import { RoleApiService } from '../services/roles-api.service';
import { EventApiService } from '../services/events-api.service';
import { notificationActions } from './notification.store';
const initialState = {
    
};

export const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<any>>) => {
            return { ...state, ...action.payload };
        },
        reset: (state)=>{
            return {...state, ...initialState};
        }
    }
});
export const eventsActions = {
    ...eventsSlice.actions,
    events: (eventData:any) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(eventsSlice.actions.startAction())
            if(eventData.type == ResponseType.success){
                const responseData = eventData.data;
                console.log(responseData)
                if(responseData.notificationUpdate){
                    console.log('getting notifications')
                    await notificationActions.notificationsList(1,10, {})(dispatch);
                }
                if(responseData.ticketUpdate){}
            }
        } catch (e: any) {
            error = e.message;
        }
        dispatch(eventsSlice.actions.actionDone({ error: error }))
    },
}

export default eventsSlice.reducer;