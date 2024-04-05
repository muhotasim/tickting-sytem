import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { authActions } from '../../store/auth-store.store';
import { RootState } from '../../store';

type LoginInput = {
    email: string;
    password: string;
};
const LoginPage: React.FC = () => {
    const dispatch = useDispatch();
    const { isLoading, loggedIn, error } = useSelector((state: RootState) => state.auth)
    const [loginData, setLoginData] = useState<LoginInput>({ email: '', password: '' })
    const onChangeFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [event.target.name]: event.target.value })
    }
    useEffect(()=>{
        dispatch(authActions.updateState({error: null}));
    },[])
    if (loggedIn) {
        return <Navigate to={'/'} />
    }
    return <div className='page login-page'>
        <div className='login__container'>
            <h4 className='mb-15 section-title'><span className='mr-5'><span className=' fa fa-sign-in-alt' /></span> Login</h4>
            <div className='login-form px-15 animate-fade-in'>
                {error&&<p className="error-message">{error}</p>}
                <div className='input-box mb-15'>
                    <label className='form-label'>Email</label>
                    <input type="text" name='email' value={loginData.email} onChange={onChangeFormData} className='input' />
                </div>
                <div className='input-box mb-15'>
                    <label className='form-label'>Password</label>
                    <input type="text" name='password' value={loginData.password} onChange={onChangeFormData} className='input' />
                </div>
                <div className='input-box mb-15'>
                    <button disabled={isLoading || !loginData.email || !loginData.password} className='btn btn-md btn-primary btn-block' onClick={() => { authActions.login(loginData.email, loginData.password)(dispatch) }}>Login <span className='ml-5'><span className={` fa ${isLoading ? 'fa-spin fa-sync' : 'fa-arrow-right'}`} color='#fff'></span></span></button>
                    <p className='mt-5'>Forgot password click <Link to='/forgot-password' className='text-link'>here</Link></p>
                </div>
            </div>
        </div>
    </div>
}

export default LoginPage;