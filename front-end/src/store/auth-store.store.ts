import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthStateInterface } from '../utils/common.interfaces';
import { AuthApiService } from '../services/auth-api.service';
import appConst from '../constants/app.const';
import { clearCookie, getCookie, setCookie } from '../utils/common.functions';
import { ResponseType } from '../utils/contome.datatype';

const initialState: AuthStateInterface = {
    user: {
        token: null,
        refetshToken: null,
        name: '',
        email: '',
        permissions: [],
        isSuperadmin: false,
    },
    loggedIn: false,
    isLoading: false,
    error: null,
    passwordResetSuccess: false,
    changePasswordSuccess: false,
    forgotPasswordMailSend: false,
    appLoading: true,
    notifications: []
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        startAction: (state) => {
            return { ...state, isLoading: true };
        },
        actionDone: (state, action: PayloadAction<{ error: any }>) => {
            return { ...state, isLoading: false, error: action.payload.error };
        },
        updateState: (state, action: PayloadAction<Partial<AuthStateInterface>>) => {
            return { ...state, ...action.payload };
        },

    }
});
export const authActions = {
    ...authSlice.actions,
    login: (email: string, password: string) => async (dispatch: any) => {
        let error = null;
        try {
            dispatch(authSlice.actions.startAction())
            const authService = new AuthApiService(appConst.API_URL)
            const tokenResult = await authService.requestToken(email, password);
            if (tokenResult.type == ResponseType.success) {
                const tokenInfo = tokenResult.data;
                authService.updateAccessToken(tokenInfo.access_token, Number(tokenInfo.ac_token_expires_at));
                const userResult = await authService.user(appConst.DEFAULT_NOTIFICATION_NUMBER);
                if (userResult.type == ResponseType.success) {
                    const user = userResult.data;
                    const loginData = {
                        user: {
                            token: tokenInfo.access_token,
                            refetshToken: tokenInfo.refresh_token,
                            name: user.name,
                            email: user.email,
                            permissions: user.permissions,
                            isSuperadmin: user.is_superadmin
                        },
                        loggedIn: true,
                        notifications: user.notifications
                    }
                    setCookie('access_token', tokenInfo.access_token, Number(tokenInfo.ac_token_expires_at))
                    setCookie('access_token_expiry_at', tokenInfo.ac_token_expires_at, Number(tokenInfo.ac_token_expires_at))
                    setCookie('refresh_token', tokenInfo.refresh_token, Number(tokenInfo.rf_token_expires_at))
                    setCookie('refresh_token_expiry_at', tokenInfo.rf_token_expires_at, Number(tokenInfo.rf_token_expires_at))
                    dispatch(authSlice.actions.updateState(loginData))

                } else {
                    error = userResult.message;
                }
            } else {
                error = tokenResult.message;
            }

        } catch (e: any) {
            error = e.message
        }

        dispatch(authSlice.actions.actionDone({ error: error }))
    },
    revalidateTokens: () => async (dispatch: any) => {
        let error = null;
        try {
            const accessToken = getCookie('access_token');
            const refreshToken = getCookie('refresh_token');
            const accessTokenExpiry = getCookie('access_token_expiry_at');
            const authService = new AuthApiService(appConst.API_URL, accessToken ? accessToken : null);
            let nearExpiring = (accessTokenExpiry && ((Number(accessTokenExpiry) - new Date().getTime()) / 1000 < 180))
            if (refreshToken && (!accessToken || nearExpiring)) {
                const refreshResult = await authService.refreshToken(refreshToken);
                if (refreshResult.type = ResponseType.success) {
                    const refreshTokenData = refreshResult.data;
                    authService.updateAccessToken(refreshTokenData.access_token, Number(refreshTokenData.ac_token_expires_at));
                    const userResult = await authService.user(appConst.DEFAULT_NOTIFICATION_NUMBER);
                    if (userResult.type == ResponseType.success) {
                        const user = userResult.data;
                        const loginData = {
                            user: {
                                token: refreshTokenData.access_token,
                                refetshToken: refreshTokenData.refresh_token,
                                name: user.name,
                                email: user.email,
                                permissions: user.permissions,
                                isSuperadmin: user.is_superadmin
                            },
                            loggedIn: true,
                            appLoading: false,
                            notifications: user.notifications
                        }
                        
                        setCookie('access_token', refreshTokenData.access_token, Number(refreshTokenData.ac_token_expires_at))
                        setCookie('access_token_expiry_at', refreshTokenData.ac_token_expires_at, Number(refreshTokenData.ac_token_expires_at))
                        setCookie('refresh_token', refreshTokenData.refresh_token, Number(refreshTokenData.rf_token_expires_at))
                        setCookie('refresh_token_expiry_at', refreshTokenData.rf_token_expires_at, Number(refreshTokenData.rf_token_expires_at))
                        dispatch(authSlice.actions.updateState(loginData))
                    } else {
                        error = userResult.message;
                    }
                } else {
                    error = refreshResult.message;
                }
            } else if (refreshToken && accessToken) {

                authService.updateAccessToken(accessToken,Number(accessTokenExpiry));
                const userResult = await authService.user(appConst.DEFAULT_NOTIFICATION_NUMBER);

                if (userResult.type == ResponseType.success) {
                    const user = userResult.data;
                    const loginData = {
                        user: {
                            token: accessToken,
                            refetshToken: refreshToken,
                            name: user.name,
                            email: user.email,
                            permissions: user.permissions,
                            isSuperadmin: user.is_superadmin
                        },
                        loggedIn: true,
                        appLoading: false,
                        notifications: user.notifications
                    }
                    dispatch(authSlice.actions.updateState(loginData))
                } else {
                    error = userResult.message;
                }
            }
        } catch (e: any) {
            error = e.message
        }
        dispatch(authSlice.actions.actionDone({ error: error }));
        
        dispatch(authSlice.actions.updateState({appLoading: false}))
    },
    logout: () => async (dispatch: any) => {
        let error = null;
        try {
            dispatch(authSlice.actions.startAction())
            const authService = new AuthApiService(appConst.API_URL)
            const logoutResult = await authService.logout();
            if (logoutResult.type == ResponseType.success) {
                clearCookie('access_token')
                clearCookie('access_token_expiry_at')
                clearCookie('refresh_token')
                clearCookie('refresh_token_expiry_at')
                dispatch(authSlice.actions.updateState({...initialState, appLoading: false}));
            } else {
                error = logoutResult.message;
            }
        } catch (e: any) {
            error = e.message
        }

        dispatch(authSlice.actions.actionDone({ error: error}))
    },
    forgotPassword: (email: string) => async (dispatch: any) => {
        let error = null;
        try {
            dispatch(authSlice.actions.startAction())
            const authService = new AuthApiService(appConst.API_URL)
            const forgotPasswordResult = await authService.forgotPassword(email);
            if (forgotPasswordResult.type == ResponseType.success) {
                dispatch(authSlice.actions.updateState({ forgotPasswordMailSend: true }));
            } else {
                error = forgotPasswordResult.message;
            }
        } catch (e:any) {
            error = e.message
        }
        dispatch(authSlice.actions.actionDone({ error: error }))
    },
    resetPassword: ( newPassword: string) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(authSlice.actions.startAction())
            const authService = new AuthApiService(appConst.API_URL)
            const resetpasswordResult = await authService.resetPassword(newPassword);
            if (resetpasswordResult.type == ResponseType.success) {
                dispatch(authSlice.actions.updateState({ passwordResetSuccess: true }));
            } else {
                error = resetpasswordResult.message;
            }

        } catch (e:any) {
            error = e.message;
        }
        dispatch(authSlice.actions.actionDone({ error: error }))
    },
    changePassword: (password: string, newPassword: string) => async (dispatch: any) => {
        let error = null
        try {
            dispatch(authSlice.actions.startAction())
            const authService = new AuthApiService(appConst.API_URL)
            const changePasswordResult = await authService.changePassword(password, newPassword);
            if (changePasswordResult.type == ResponseType.success) {
                dispatch(authSlice.actions.updateState({ changePasswordSuccess: true }));
            } else {
                error = changePasswordResult.message;
            }

        } catch (e:any) {
            error = e.message;
        }
        dispatch(authSlice.actions.actionDone({ error: error }))
    },
};

export default authSlice.reducer;
