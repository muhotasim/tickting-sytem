import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/auth-store.store";
import { RootState } from "../../store";

const ChangePasswordPage: React.FC = () => {
    const dispatch = useDispatch();
    const { changePasswordSuccess, user, isLoading, error } = useSelector((state: RootState) => state.auth)
    const [formData, setLoginData] = useState({ password: '', newPassword: '', confirmPassword: '' })
    const onChangeFormData = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...formData, [event.target.name]: event.target.value })
    }

    useEffect(()=>{
        dispatch(authActions.updateState({changePasswordSuccess:false, error: null}))
    },[])

    return <div className='page change-password-page animate-fade-in'>
        <div className="card change-password-card">
            <div className="card-title">
                <h3 className="section-title">Change Password</h3>
            </div>
            <div className="card-body">
                {error&&<p className="error-message">{error}</p>}
                {!changePasswordSuccess?<div className="px-15">
                    <div className='input-box mt-15'>
                        <label className='form-label'>Password</label>
                        <input type="text" name='password' value={formData.password} onChange={onChangeFormData} className='input' />
                    </div>
                    <div className='input-box mt-15'>
                        <label className='form-label'>New Password</label>
                        <input type="text" name='newPassword' value={formData.newPassword} onChange={onChangeFormData} className='input' />
                    </div>
                    <div className='input-box mt-15'>
                        <label className='form-label'>Confirm Password</label>
                        <input type="text" name='confirmPassword' value={formData.confirmPassword} onChange={onChangeFormData} className='input' />
                    </div>
                    <button className="btn btn-md btn-primary mt-15 float-right" disabled={isLoading || !formData.password || formData.newPassword != formData.confirmPassword || !formData.newPassword} onClick={() => {
                        authActions.changePassword(formData.password, formData.newPassword)(dispatch)
                    }}>Change Password {isLoading&&<span className="fa fa-sync fa-spin"></span>}</button>
                </div>:<div><p>Password changed successfully</p></div>}
            </div>
        </div>
    </div>
}
export default ChangePasswordPage;