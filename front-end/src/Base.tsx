import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Loader from './components/loading';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/auth-store.store';
import { RootState } from './store';
import AuthenticatedRoutes from './Authorized';
import AuthorizationRoutes from './Authorization';
function App() {
  const dispatch = useDispatch();
  const { appLoading } = useSelector((state:RootState)=>state.auth)
  useEffect(()=>{
    authActions.revalidateTokens()(dispatch);
    console.log('mounted '+new Date().toLocaleString())
    setInterval(()=>{
      authActions.revalidateTokens()(dispatch);
    }, 60000)
  },[])

  if(appLoading) return <div className='app'><Loader/></div>;
  return (
    <div className='app'>
        <BrowserRouter>
          <AuthorizationRoutes/>
          <AuthenticatedRoutes/>
        </BrowserRouter>
    </div>
  )
}

export default App
