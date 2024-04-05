import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PermissionStateInterface, RolesStateInterface } from '../utils/common.interfaces';
import { AuthApiService } from '../services/auth-api.service';
import appConst from '../constants/app.const';
import { clearCookie, getCookie, setCookie } from '../utils/common.functions';
import { ResponseType } from '../utils/contome.datatype';
import moment from 'moment';
import { PermissionApiService } from '../services/permission-api.service';
const initialState: PermissionStateInterface = {
    page: 1,
    perPage: 10,
    permissionAll: [],
    grid: [],
    total: 0,
    isLoading: false,
    error: null,
    gridFilters: {},
    permissions: []
};

export const permissionSlice = createSlice({
    name: 'permission',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<PermissionStateInterface>>) => {
            return { ...state, ...action.payload };
        },
        reset: (state)=>{
            return {...state, ...initialState};
        }
    }
});
export const permissionActions = {
    ...permissionSlice.actions,
    list: (page: number, perPage: number, gridFilters: { [key: string]: any }) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(permissionSlice.actions.startAction())
            const permissionService = new PermissionApiService(appConst.API_URL)
            const permissionsResult = await permissionService.list(page, perPage, gridFilters);
            if (permissionsResult.type == ResponseType.success) {
                dispatch(permissionSlice.actions.updateState({
                    grid: permissionsResult.grid, permissions: permissionsResult.data.data, total: permissionsResult.data.total
                }));
            } else {
                error = permissionsResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(permissionSlice.actions.actionDone({ error: error }))
    },
    all: () => async (dispatch: any) => {
        let error = null
        try {
            dispatch(permissionSlice.actions.startAction())
            const permissionService = new PermissionApiService(appConst.API_URL)
            const permissionsResult = await permissionService.all();
            if (permissionsResult.type == ResponseType.success) {
                dispatch(permissionSlice.actions.updateState({
                   permissionAll: permissionsResult.data
                }));
            } else {
                error = permissionsResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(permissionSlice.actions.actionDone({ error: error }))
    },
    create: (body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(permissionSlice.actions.startAction())
            const permissionService = new PermissionApiService(appConst.API_URL)
            const permissionsResult = await permissionService.create(body);
            if (permissionsResult.type == ResponseType.success) {
                return permissionsResult;
            } else {
                error = permissionsResult.message;

            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(permissionSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    update: (id: number|string, body: { [key: string]: any } | FormData) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(permissionSlice.actions.startAction())
            const permissionService = new PermissionApiService(appConst.API_URL)
            const updateResponse = await permissionService.update(id, body)
            return updateResponse;
        } catch (e: any) {
            error = e.message;
        }
        dispatch(permissionSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
    delete: (id: number|string) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(permissionSlice.actions.startAction())
            const permissionService = new PermissionApiService(appConst.API_URL)
            const permissionsResult = await permissionService.destroy(id)
            if (permissionsResult.type == ResponseType.success) {
                dispatch(permissionSlice.actions.updateState({ error: null, page: 1, isLoading: false }))
                permissionActions.list(initialState.page, initialState.perPage, initialState.gridFilters)(dispatch)
                return permissionsResult;
            } else {
                error = permissionsResult.message;
            }

        } catch (e: any) {
            error = e.message;
        }
        dispatch(permissionSlice.actions.actionDone({ error: error }))
        if (error) return false;
    },
}

export default permissionSlice.reducer;