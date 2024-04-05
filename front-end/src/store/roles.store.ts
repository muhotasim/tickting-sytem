import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RolesStateInterface } from '../utils/common.interfaces';
import { AuthApiService } from '../services/auth-api.service';
import appConst from '../constants/app.const';
import { clearCookie, getCookie, setCookie } from '../utils/common.functions';
import { ResponseType } from '../utils/contome.datatype';
import moment from 'moment';
import { RoleApiService } from '../services/roles-api.service';
const initialState: RolesStateInterface = {
    page: 1,
    perPage: 10,
    roles: [],
    grid: [],
    total: 0,
    isLoading: false,
    error: null,
    gridFilters: {},
    rolesAll: []
};

export const rolesSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<RolesStateInterface>>) => {
            return { ...state, ...action.payload };
        },
        reset: (state)=>{
            return {...state, ...initialState};
        }
    }
});
export const rolesActions = {
    ...rolesSlice.actions,
    list: (page: number, perPage: number, gridFilters: { [key: string]: any }) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(rolesSlice.actions.startAction())
            const roleService = new RoleApiService(appConst.API_URL)
            const rolesResult = await roleService.list(page, perPage, gridFilters);
            if (rolesResult.type == ResponseType.success) {
                dispatch(rolesSlice.actions.updateState({
                    grid: rolesResult.grid, roles: rolesResult.data.data.map((d: { timestamp: moment.MomentInput; }) => {
                        d.timestamp = d.timestamp ? moment(d.timestamp).fromNow() : ''
                        return d;
                    }), total: rolesResult.data.total
                }));
            } else {
                error = rolesResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(rolesSlice.actions.actionDone({ error: error }))
    },
    all: () => async (dispatch: any) => {
        let error = null
        try {
            dispatch(rolesSlice.actions.startAction())
            const roleService = new RoleApiService(appConst.API_URL)
            const rolesResult = await roleService.all();
            if (rolesResult.type == ResponseType.success) {
                dispatch(rolesSlice.actions.updateState({
                   rolesAll: rolesResult.data
                }));
            } else {
                error = rolesResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(rolesSlice.actions.actionDone({ error: error }))
    },
    create: (body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(rolesSlice.actions.startAction())
            const roleService = new RoleApiService(appConst.API_URL)
            const rolesResult = await roleService.create(body);
            if (rolesResult.type == ResponseType.success) {
                return rolesResult;
            } else {
                error = rolesResult.message;

            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(rolesSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    update: (id: number|string, body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(rolesSlice.actions.startAction())
            const roleService = new RoleApiService(appConst.API_URL)
            const userResponse = await roleService.update(id, body)
            return userResponse;
        } catch (e: any) {
            error = e.message;
        }
        dispatch(rolesSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    delete: (id: number|string) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(rolesSlice.actions.startAction())
            const roleService = new RoleApiService(appConst.API_URL)
            const rolesResult = await roleService.destroy(id)
            if (rolesResult.type == ResponseType.success) {
                dispatch(rolesSlice.actions.updateState({ error: null, page: 1, isLoading: false }))
                rolesActions.list(initialState.page, initialState.perPage, initialState.gridFilters)(dispatch)
                return rolesResult;
            } else {
                error = rolesResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(rolesSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
}

export default rolesSlice.reducer;