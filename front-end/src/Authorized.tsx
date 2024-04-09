import { Suspense, lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom"
import BaseLayout from "./components/base-layout";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import Loader from "./components/loading";
import { eventsActions } from "./store/events.store";
import appConst from "./constants/app.const";


const ChangePassword = lazy(() => import('./pages/change-password'))
const PageNotFound = lazy(() => import('./pages/404'));
const Notification = lazy(() => import('./pages/notifications'));
const Tickets = lazy(() => import('./pages/tickets'));
const ModifyTicket = lazy(() => import('./pages/tickets/modify'));
const PermissionPage = lazy(() => import('./pages/permissions'));
const ModifyPermission = lazy(() => import('./pages/permissions/modify'));
const RolesPage = lazy(() => import('./pages/roles'));
const ModifyRole = lazy(() => import('./pages/roles/modify'));
const UserPage = lazy(() => import('./pages/users'));
const ModifyUser = lazy(() => import('./pages/users/modify'));
const Dashboard = lazy(() => import('./pages/dashboard'))
const ViewTicket = lazy(() => import('./pages/tickets/view'))
const serviceWorker = new Worker('/workers/worker.js');
const AuthenticatedRoutes = () => {
    const dispatch = useDispatch()
    const {loggedIn, user} = useSelector((state: RootState) => state.auth);
    const lastEventData = ()=>{
        serviceWorker.postMessage({ token: user.token, apiUrl: appConst.API_URL })
        serviceWorker.onmessage = async function (event) {
            const data = event.data;
            if(loggedIn){
                await eventsActions.events(data)(dispatch)
                setTimeout(async ()=>{
                    if(loggedIn){
                        await lastEventData();
                    }
                },3000)
            }
        };
    }
    useEffect(()=>{
        if(loggedIn){
            lastEventData();
        }
    },[
        loggedIn
    ])

    if (!loggedIn) return <Navigate to="/login" replace />
    return <>
        <BaseLayout>

            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path='/' element={<Dashboard />} />
                    <Route path='/notifications' element={<Notification />} />
                    <Route path='/change-password' element={<ChangePassword />} />
                    <Route path='/access-management/users' element={<UserPage />} />
                    <Route path='/access-management/users/create' element={<ModifyUser />} />
                    <Route path='/access-management/users/:id' element={<ModifyUser />} />
                    <Route path='/access-management/roles' element={<RolesPage />} />
                    <Route path='/access-management/roles/create' element={<ModifyRole />} />
                    <Route path='/access-management/roles/:id' element={<ModifyRole />} />
                    <Route path='/access-management/permissions' element={<PermissionPage />} />
                    <Route path='/access-management/permissions/create' element={<ModifyPermission />} />
                    <Route path='/access-management/permissions/:id' element={<ModifyPermission />} />
                    <Route path='/tickets-management/tickets' element={<Tickets />} />
                    <Route path='/tickets-management/submit' element={<ModifyTicket />} />
                    <Route path='/tickets-management/tickets/:id' element={<ViewTicket />} />
                    <Route path='/*' element={<PageNotFound />} />
                </Routes>
            </Suspense>
        </BaseLayout>
    </>
}

export default AuthenticatedRoutes;