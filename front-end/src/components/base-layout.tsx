import React, { useState } from "react";
import TopBar from "./topbar";
import Sidebar from "./sidebar";
import { sidebarConst } from "../constants/sidebar";

const BaseLayout:React.FC<{children:React.ReactElement}> = ({children})=>{
    const [sidebarOpen, setSideBarOpen] = useState(true);
    const toggleSidebar =()=>setSideBarOpen(!sidebarOpen);
    return <><div>
        <TopBar toggle={toggleSidebar}/>
        <div className="base__container">
            <div className={"sidebar__container "+(sidebarOpen?'':'collaspe')}>
                <Sidebar menus={sidebarConst}/>
            </div>
            <div  className={"app__container "+(sidebarOpen?'collaspe':'')}>
                <div className="container">
                    {children}
                </div>
            </div>
        </div>
    </div></>
}

export default BaseLayout;