import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/protected-route';
import Loader from './components/loading';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/auth-store.store';
import { RootState } from './store';
import PublicRoute from './components/public-route';

const PermissionPage =  lazy(()=>import('./pages/permissions'));
const ModifyPermission =  lazy(()=>import('./pages/permissions/modify'));
const RolesPage =  lazy(()=>import('./pages/roles'));
const ModifyRole =  lazy(()=>import('./pages/roles/modify'));
const UserPage =  lazy(()=>import('./pages/users'));
const ModifyUser =  lazy(()=>import('./pages/users/modify'));
const Dashboard = lazy(()=>import('./pages/dashboard'))
const Login = lazy(()=>import('./pages/login'))
const ChangePassword = lazy(()=>import('./pages/change-password'))
const ForgotPassword = lazy(()=>import('./pages/forgot-password'))
const ResetPassword = lazy(()=>import('./pages/reset-password'))
const PageNotFound = lazy(()=>import('./pages/404'));
const Notification = lazy(()=>import('./pages/notifications'));
const Tickets = lazy(()=>import('./pages/tickets'));
const ModifyTicket = lazy(()=>import('./pages/tickets/modify'));
function App() {
  const dispatch = useDispatch();
  const appLoading = useSelector((state:RootState)=>state.auth.appLoading)
  useEffect(()=>{
    authActions.revalidateTokens()(dispatch);
    console.log('mounted '+new Date().toLocaleString())
    setInterval(()=>{
      console.log('refreshed: '+new Date().toLocaleString())
      authActions.revalidateTokens()(dispatch);
    }, 60000)
  },[])

  if(appLoading) return <div className='app'><Loader/></div>
  return (
    <div className='app'>
      <Suspense fallback={<Loader/>}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={<Login/>}/>
            <Route path='/forgot-password' element={<ForgotPassword/>}/>
            <Route path='/reset-password/:token' element={<ResetPassword/>}/>

            <Route path='/' element={<ProtectedRoute component={Dashboard}/>}/>
            <Route path='/notifications' element={<ProtectedRoute component={Notification}/>}/>
            <Route path='/change-password' element={<ProtectedRoute component={ChangePassword}/>}/>
            <Route path='/access-management/users' element={<ProtectedRoute component={UserPage}/>}/>
            <Route path='/access-management/users/create' element={<ProtectedRoute component={ModifyUser}/>}/>
            <Route path='/access-management/users/:id' element={<ProtectedRoute component={ModifyUser}/>}/>
            <Route path='/access-management/roles' element={<ProtectedRoute component={RolesPage}/>}/>
            <Route path='/access-management/roles/create' element={<ProtectedRoute component={ModifyRole}/>}/>
            <Route path='/access-management/roles/:id' element={<ProtectedRoute component={ModifyRole}/>}/>
            <Route path='/access-management/permissions' element={<ProtectedRoute component={PermissionPage}/>}/>
            <Route path='/access-management/permissions/create' element={<ProtectedRoute component={ModifyPermission}/>}/>
            <Route path='/access-management/permissions/:id' element={<ProtectedRoute component={ModifyPermission}/>}/>
            <Route path='/tickets-management/tickets' element={<ProtectedRoute component={Tickets}/>}/>
            <Route path='/tickets-management/submit' element={<ProtectedRoute component={ModifyTicket}/>}/>
            <Route path='/*' element={<ProtectedRoute component={PageNotFound}/>}/>
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  )
}

export default App
