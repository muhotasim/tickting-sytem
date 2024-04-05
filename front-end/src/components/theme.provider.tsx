
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from '../store';
const ThemeProvider:React.FC<{children:React.ReactElement}> = ({ children })=>{
    const ui = useSelector((state:RootState)=>state.ui)
    const theme = ui.theme;

    return <div className={theme}>
        {children}
    </div>;
}

export default ThemeProvider;