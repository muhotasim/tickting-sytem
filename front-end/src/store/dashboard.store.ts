import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DashboardStateInterface } from '../utils/common.interfaces';
import { AuthApiService } from '../services/auth-api.service';
import appConst from '../constants/app.const';
import { clearCookie, getCookie, setCookie } from '../utils/common.functions';
import { ResponseType } from '../utils/contome.datatype';
import moment from 'moment';
import { ticketSlice } from './tickets.store';
import { TicketApiService } from '../services/tickets-api.service';
const initialState: DashboardStateInterface = {
    numberOfTickets: 0,
    ticket: {
        'Open': 0,
        'In Progress': 0,
        'Waiting for Customer': 0,
        'Resolved': 0,
        'Reopened': 0,
        'Cancelled':0,
    },
    isLoading: false
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<DashboardStateInterface>>) => {
            return { ...state, ...action.payload };
        },
        reset: (state)=>{
            return { ...state, ...initialState };
        },
        updateTicketNumber: (state, action)=>{
            const tempState = {...state};
            let total = 0;
            const ticket = {...tempState.ticket, ...action.payload};
            tempState.ticket = ticket;
            for(let val of Object.values(tempState.ticket)){
                total += Number(val)
            }
            tempState.numberOfTickets = total;
            return { ...state, ...tempState };
        }

    }
});
export const dashboardActions = {
    ...dashboardSlice.actions,
    getDashboard: ()=>async (dispatch:any)=>{
        let error = null
        dispatch(dashboardSlice.actions.startAction())
        try{
            const apiHandaler = new TicketApiService(appConst.API_URL);
            const dashboardResponse = await apiHandaler.getDashboard();
            if(dashboardResponse.type == ResponseType.success){
                const dashboardData = dashboardResponse.data;
                dispatch(dashboardSlice.actions.updateTicketNumber(dashboardData));
            }

        } catch (e:any) {
            error = e.message;
        }
        dispatch(dashboardSlice.actions.actionDone({ error: error }))
    }

}

export default dashboardSlice.reducer;