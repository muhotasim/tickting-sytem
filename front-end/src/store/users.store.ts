import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsersStateInterface } from '../utils/common.interfaces';
import { AuthApiService } from '../services/auth-api.service';
import appConst from '../constants/app.const';
import { clearCookie, getCookie, setCookie } from '../utils/common.functions';
import { ResponseType } from '../utils/contome.datatype';
import moment from 'moment';
import { UserApiService } from '../services/user-api.service';
const initialState: UsersStateInterface = {
    page: 1,
    perPage: 10,
    users: [],
    grid: [],
    total: 0,
    isLoading: false,
    error: null,
    gridFilters: {}
};

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<UsersStateInterface>>) => {
            return { ...state, ...action.payload };
        },
        reset: (state)=>{
            return {...state, ...initialState};
        }
    }
});
export const usersActions = {
    ...usersSlice.actions,
    list: (page: number, perPage: number, gridFilters: { [key: string]: any }) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(usersSlice.actions.startAction())
            const authService = new UserApiService(appConst.API_URL)
            const usersResult = await authService.list(page, perPage, gridFilters);
            if (usersResult.type == ResponseType.success) {
                dispatch(usersSlice.actions.updateState({
                    grid: usersResult.grid, users: usersResult.data.data.map((d: { timestamp: moment.MomentInput; }) => {
                        d.timestamp = d.timestamp ? moment(d.timestamp).fromNow() : ''
                        return d;
                    }), total: usersResult.data.total
                }));
            } else {
                error = usersResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(usersSlice.actions.actionDone({ error: error }))
    },
    create: (body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(usersSlice.actions.startAction())
            const authService = new UserApiService(appConst.API_URL)
            const usersResult = await authService.create(body);
            if (usersResult.type == ResponseType.success) {
                return usersResult;
            } else {
                error = usersResult.message;

            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(usersSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    update: (id: number|string, body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(usersSlice.actions.startAction())
            const authService = new UserApiService(appConst.API_URL)
            const userResponse = await authService.update(id, body)
            if (userResponse.type == ResponseType.success) {
                return userResponse;
            } else {
                error = userResponse.message;

            }
        } catch (e: any) {
            error = e.message;
        }
        dispatch(usersSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    delete: (id: number|string) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(usersSlice.actions.startAction())
            const authService = new UserApiService(appConst.API_URL)
            const usersResult = await authService.destroy(id)
            if (usersResult.type == ResponseType.success) {
                dispatch(usersSlice.actions.updateState({ error: null, page: 1, isLoading: false }))
                usersActions.list(initialState.page, initialState.perPage, initialState.gridFilters)(dispatch)
                return usersResult;
            } else {
                error = usersResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(usersSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
}

export default usersSlice.reducer;