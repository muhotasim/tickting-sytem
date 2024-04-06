import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationStateInterface, TicketStateInterface } from '../utils/common.interfaces';
import { AuthApiService } from '../services/auth-api.service';
import appConst from '../constants/app.const';
import { ResponseType } from '../utils/contome.datatype';
import moment from 'moment';
import { TicketApiService } from '../services/tickets-api.service';
const initialState: TicketStateInterface = {
    page: 1,
    perPage: 10,
    tickets: [],
    grid: [],
    total: 0,
    isLoading: false,
    error: null,
    gridFilters: {},
    ticketDetails: {
        priority: '',
        details: '',
        rating: 0,
        resolved_date: null,
        status: '',
        submission_date: null,
        title: '',
        comments: [],
        isLoading: false,
        isCommentLoading: false
    }
};

export const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<TicketStateInterface>>) => {
            return { ...state, ...action.payload };
        },
        reset: (state) => {
            return { ...state, ...initialState };
        },
        startTicketDetailsLoading: (state)=>{
            const ticketDetails = {...state.ticketDetails};
            ticketDetails.isLoading =  true;
            return {...state, ticketDetails:ticketDetails}
        },
        startTicketDetailsCommentLoading: (state)=>{
            const ticketDetails = {...state.ticketDetails};
            ticketDetails.isCommentLoading =  true;
            return {...state, ticketDetails:ticketDetails}
        },
        setTicketDetailsComment: (state, action)=>{
            const ticketDetails = {...state.ticketDetails};
            ticketDetails.comments =  action.payload.comments;
            ticketDetails.isCommentLoading = false;
            return {...state, ticketDetails:ticketDetails}
        }

    }
});
export const ticketsActions = {
    ...ticketSlice.actions,
    list: (
        page: number,
        perPage: number,
        gridFilters: { [key: string]: any }
    ) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(ticketSlice.actions.startAction())
            const ticketService = new TicketApiService(appConst.API_URL)
            const ticketResult = await ticketService.list(page, perPage, gridFilters);
            if (ticketResult.type == ResponseType.success) {
                dispatch(ticketSlice.actions.updateState({
                    grid: ticketResult.grid,
                    tickets: ticketResult.data.data,
                    total: ticketResult.data.total
                }));
            } else {
                error = ticketResult.message;
            }
        } catch (e: any) {
            error = e.message;
        }
        dispatch(ticketSlice.actions.actionDone({ error: error }))
    },
    create: (body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(ticketSlice.actions.startAction())
            const ticketService = new TicketApiService(appConst.API_URL)
            const ticketsResult = await ticketService.create(body);
            if (ticketsResult.type == ResponseType.success) {
                return true;
            } else {
                error = ticketsResult.message;

            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(ticketSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    update: (id: number | string, body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(ticketSlice.actions.startAction())
            const ticketService = new TicketApiService(appConst.API_URL)
            const updateResponse = await ticketService.update(id, body)
            return updateResponse;
        } catch (e: any) {
            error = e.message;
        }
        dispatch(ticketSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    delete: (id: number | string) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(ticketSlice.actions.startAction())
            const ticketService = new TicketApiService(appConst.API_URL)
            const ticketsResult = await ticketService.destroy(id)
            if (ticketsResult.type == ResponseType.success) {
                dispatch(ticketSlice.actions.updateState({ error: null, page: 1, isLoading: false }))
                ticketsActions.list(initialState.page, initialState.perPage, initialState.gridFilters)(dispatch)
                return ticketsResult;
            } else {
                error = ticketsResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(ticketSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    ticketDetails:(id:number)=>async(dispatch: any)=>{
            dispatch(ticketSlice.actions.startTicketDetailsLoading())
            const apiHandler = new TicketApiService(appConst.API_URL);
            const ticketId = Number(id);
            const response = await apiHandler.getById(ticketId);
            if (response.type == ResponseType.success) {
                
                const commentsResponse = await apiHandler.comments(ticketId);
                if (commentsResponse.type == ResponseType.success) {
                    const ticketDetailsObject = {
                        priority: response.data.priority,
                        details: response.data.details,
                        rating: response.data.rating,
                        resolved_date: response.data.resolved_date,
                        status: response.data.status,
                        submission_date: response.data.submission_date,
                        title: response.data.title,
                        comments: commentsResponse.data,
                        isLoading: false,
                        isCommentLoading: false
                    }
                    dispatch(ticketSlice.actions.updateState({ticketDetails: ticketDetailsObject}))
                }
            }
        },
        getComments:(id:number)=>async(dispatch: any)=>{
            
            dispatch(ticketSlice.actions.startTicketDetailsCommentLoading())
            const ticketService = new TicketApiService(appConst.API_URL);
            const commentsResponse = await ticketService.comments(Number(id));
            if (commentsResponse.type == ResponseType.success) {
                dispatch(ticketsActions.setTicketDetailsComment({comments: commentsResponse.data}));
            }
        } 
    
}

export default ticketSlice.reducer;