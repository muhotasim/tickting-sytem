import React, { useState } from "react"
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom"
import { RootState } from "../store";
export interface MenuItem {
    label: string
    link: string
    childrens: MenuItem[],
    permissionKey?: string;
    iconClass?: string;
}
const Sidebar: React.FC<{ menus: MenuItem[] }> = ({ menus = [] }) => {
    return <nav className="sidebar">
        <ul >
            {menus.map((menu, index) => {
                return <SideBarItem iconClass={menu.iconClass} permissionKey={menu.permissionKey} key={index} label={menu.label} link={menu.link} childrens={menu.childrens} />
            })}
        </ul>
    </nav>
}

const SideBarItem: React.FC<MenuItem> = ({ label, link, childrens, permissionKey, iconClass }) => {
    const [subMenu, setSubmenu] = useState(false);
    const toggleSubMenu = () => setSubmenu(!subMenu);
    const user = useSelector((state:RootState)=>state.auth.user);
    const { permissions, isSuperadmin } = user;
    const onClickMenuExpend = (e:React.MouseEvent<HTMLSpanElement>)=>{
        e.preventDefault();
        toggleSubMenu()
    }
    const isPermited = isSuperadmin || (permissions && permissions.find((permission)=>permission.permission_key==permissionKey))
    if( isPermited ){
        return <li>
        {childrens.length?<NavLink to={link} style={{cursor: 'pointer'}} onClick={e=>{
            e.preventDefault();
            onClickMenuExpend(e)
        }}>{iconClass&&<i className={iconClass+' mr-10 mt-8 icon'}></i>} <span className="label">{label}</span> {childrens.length > 0 && <span className={"submenu__expend "+(subMenu?'open': '')} ><span className=' fa fa-chevron-down' /></span>}</NavLink>
        :<NavLink to={link}> {iconClass&&<i className={iconClass+' mr-10 mt-8 icon'}></i>} <span className="label">{label}</span> {childrens.length > 0 && <span className={"submenu__expend "+(subMenu?'open': '')} onClick={onClickMenuExpend}><span className=' fa fa-chevron-down' /></span>}</NavLink>}
        {childrens.length ? <ul className={'submenu '+(subMenu?'show': '')}>
            {childrens.map((menu, index) => {
                return <SideBarItem key={index} iconClass={menu.iconClass} permissionKey={menu.permissionKey} label={menu.label} link={menu.link} childrens={menu.childrens} />
            })}
        </ul> : null}
    </li>
    }else{
        return null;
    }
    
}

export default Sidebar;