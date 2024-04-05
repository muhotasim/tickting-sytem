import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import Loader from './components/loading'

const Login = lazy(()=>import('./pages/login'))
const ForgotPassword = lazy(()=>import('./pages/forgot-password'))
const ResetPassword = lazy(()=>import('./pages/reset-password'))
const AuthorizationRoutes = () => {
    return <Suspense fallback={<Loader/>}>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path='/reset-password/:token' element={<ResetPassword/>}/>
    </Routes>
    </Suspense>
}
export default AuthorizationRoutes;