import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserApiService } from "../../services/user-api.service";
import appConst from "../../constants/app.const";
import { ResponseType } from "../../utils/contome.datatype";
import { useDispatch, useSelector } from "react-redux";
import { usersActions } from "../../store/users.store";
import { RootState } from "../../store";
import Checkbox from "../../components/checkbox";
import { rolesActions } from "../../store/roles.store";

const ModifyUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error } = useSelector((state: RootState) => state.user)
    const { rolesAll } = useSelector((state: RootState) => state.roles)
    const [formData, setFormData] = useState<{
        name: string
        email: string
        password: string
        is_active: boolean,
        roles: number[],
    }>({
        name: '',
        email: '',
        password: '',
        is_active: true,
        roles: [],
    });
    const [fromValidation, setFormValidation] = useState<any>({
        name: false,
        email: false,
        password: false
    })
    const onFormField = (key: string, value: any) => {
        let validationObject = { ...fromValidation }
        validationObject[key] = false;
        setFormData({ ...formData, [key]: value })
        setFormValidation(validationObject);
    }
    const fetchData = async () => {
        rolesActions.all()(dispatch)
        if (id) {
            const userService = new UserApiService(appConst.API_URL);
            const userResult = await userService.getById(id);
            if (userResult.type == ResponseType.success) {

                setFormData({
                    name: userResult.data.name,
                    email: userResult.data.email,
                    password: userResult.data.password,
                    is_active: userResult.data.is_active,
                    roles: userResult.data.roles.map((d: { id: any; }) => d.id)
                })
            }
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let validationObj = {
            name: false,
            email: false,
            password: false
        };

        if (!formData.name) validationObj.name = true;
        if (!formData.email || !emailRegex.test(formData.email)) validationObj.email = true;
        if (!formData.password) validationObj.password = true;

        if (validationObj.name || validationObj.email || validationObj.password) {
            setFormValidation(validationObj);
            return;
        }
        if (id) {
            let result = await usersActions.update(id, formData)(dispatch);
            if (result && result.type == ResponseType.success) {
                navigate('/access-management/users')
            }
        } else {
            let result = await usersActions.create(formData)(dispatch);
            if (result && result.type == ResponseType.success) {
                navigate('/access-management/users')
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15"> {id ? 'Update' : 'Create'} User</h2>
        <form onSubmit={onSubmit}>

            <div className="modify-inputs-400">
                {error && <p className="error-message">{error}</p>}
                <div className="form-group mt-15">
                    <label className={"form-label " + (fromValidation.name ? "validation" : "")}>Name</label>
                    <input className={"input " + (fromValidation.name ? "validation-error" : "")} value={formData.name} onChange={e => onFormField('name', e.target.value)} />
                </div>
                <div className="form-group mt-15">
                    <label className={"form-label " + (fromValidation.email ? "validation" : "")}>Email</label>
                    <input className={"input " + (fromValidation.email ? "validation-error" : "")} value={formData.email} onChange={e => onFormField('email', e.target.value)} />
                </div>
                <div className="form-group mt-15">
                    <label className={"form-label " + (fromValidation.password ? "validation" : "")}>Password</label>
                    <input className={"input " + (fromValidation.password ? "validation-error" : "")} type="password" value={formData.password} onChange={e => onFormField('password', e.target.value)} />
                </div>
            </div>
            <div className="form-group mt-15">
                <label className="form-label pb-15">Roles</label>
                <div className="multi-checkbox-container">
                    {rolesAll.map((role, index) => (<div className="multi-checkbox-item">
                        <Checkbox key={index} label={role.name} checked={formData.roles.includes(role.id)} onChange={(v) => {
                            let tempRoles = [...formData.roles]
                            let indexOfRole = tempRoles.findIndex(r => r == role.id);
                            if (indexOfRole != -1) {
                                tempRoles.splice(indexOfRole, 1)
                            } else {
                                tempRoles.push(role.id)
                            }
                            setFormData({ ...formData, roles: [...tempRoles] })
                        }} />
                    </div>))}
                </div>
            </div>
            <div className="form-group mt-15">
                <Checkbox label="Is Active" checked={formData.is_active} onChange={(v) => { onFormField('is_active', v) }} />
            </div>
            
            <div className="modify-inputs-400">
                <button disabled={isLoading} className="btn btn-md btn-primary float-right"> <i className={`fa ${isLoading ? 'fa-sync fa-spin' : 'fa-save'}`}></i> {id ? "Update" : "Save"}</button>
            </div>
        </form>
    </div>
}

export default ModifyUser;