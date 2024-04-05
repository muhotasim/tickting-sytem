import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UiStateInterface } from '../utils/common.interfaces';

const initialState: UiStateInterface = {
    theme: 'aqua-wave',
    themeList: ['aqua-wave' ],
};

let themeStr = localStorage.getItem('active-theme');
if(themeStr){
    initialState.theme = themeStr;
}else{
    localStorage.setItem('active-theme', initialState.theme);
}
export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<{theme: string}>) => {
            localStorage.setItem('active-theme', action.payload.theme);
            return { ...state, theme: action.payload.theme };
        },
    }
});

export const { setTheme } = uiSlice.actions;

export default uiSlice.reducer;
