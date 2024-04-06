import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { setTheme } from "../store/ui.store";
import React, { ChangeEvent, useState } from "react";
import { authActions } from "../store/auth-store.store";

const TopBar:React.FC<{toggle:()=>void}> = ({ toggle })=>{
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { notifications } = useSelector((state:RootState)=>state.auth)
    const [openNotification, setOpenNotification] = useState(false);
    const [openUserDetails, setOpenUserDetails] = useState(false);

    const toggleNotification = ()=>{
        if(!openNotification){
            setOpenUserDetails(false)
        }
        setOpenNotification(!openNotification);
    }
    const toggleUserDetails= ()=>{
        if(!openUserDetails){
            setOpenNotification(false)
        }
        setOpenUserDetails(!openUserDetails);
    }
    const ui = useSelector((state:RootState)=>state.ui);
    const changeTheme = (e:ChangeEvent<HTMLSelectElement>)=>{
        dispatch(setTheme({theme: e.target.value}))
    }

    return <>
        <nav className="top-bar">
            <Link className="topbar-brand" to='/'>Speedy </Link>
            <a  className="topbar-toggle" onClick={(e)=>{
                e.preventDefault();
                toggle()
            }}> <span><span className=' fa fa-bars' ></span> </span></a>
            <ul>
                <li><select className="theme-selector" onChange={changeTheme} value={ui.theme}>
                    {ui.themeList.map((value, index)=><option key={index} value={value}>{value}</option>)}
                    </select></li>
                <li>
                    <a onClick={toggleNotification}><span><span className=' fa fa-bell'> </span></span></a>
                    <div className={"menu-details "+(openNotification?'open-menu': '')}>
                        <ul>
                            {notifications.slice(0, 5).map((notification, index)=>{
                                return <li key={index}><Link to={notification.link}>{notification.message}</Link></li>
                            })}
                            <li className="see-all-menu"><Link to='/notifications' onClick={()=>toggleNotification()}>See All</Link></li>
                        </ul>
                    </div>    
                </li>
                
                <li>
                    <a onClick={toggleUserDetails}><span className="pr-5"><span className=' fa fa-user'/></span> User</a>
                    <div className={"menu-details "+(openUserDetails?'open-menu': '')}>
                        <div className="user__details">
                            <img className="img"/>
                            <div className="actions">
                                <button className="btn btn-md btn-primary" onClick={()=>{
                                    navigate('/change-password')
                                    toggleUserDetails()
                                }}>Change Password</button><button onClick={()=>{
                                   authActions.logout()(dispatch)
                                   toggleUserDetails()
                                }} className="btn btn-md btn-primary">Logout</button>
                            </div>
                        </div>
                    </div>  
                </li>
            </ul>
        </nav>
    </>
}

export default TopBar;