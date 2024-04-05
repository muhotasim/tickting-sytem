import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import appConst from "../../constants/app.const";
import { ResponseType } from "../../utils/contome.datatype";
import { useDispatch, useSelector } from "react-redux";
import { usersActions } from "../../store/users.store";
import { RootState } from "../../store";
import Checkbox from "../../components/checkbox";
import { RoleApiService } from "../../services/roles-api.service";
import { rolesActions } from "../../store/roles.store";
import { permissionActions } from "../../store/permissions.store";

const ModifyRole = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, roles } = useSelector((state: RootState) => state.roles)
    const { permissionAll } = useSelector((state: RootState) => state.permissions)
    const [formData, setFormData] = useState<{
        name: string,
        is_active: boolean,
        permissions: number[]
    }>({
        name: '',
        is_active: true,
        permissions: []
    });

    const [fromValidation, setFormValidation] = useState<any>({
        name: false
    })
    const onFormField = (key: string, value: any) => {
        let validationObject = { ...fromValidation }
        validationObject[key] = false;
        setFormData({ ...formData, [key]: value })
        setFormValidation(validationObject);
    }
    const fetchData = async () => {
        permissionActions.all()(dispatch);

        if (id) {
            const roleService = new RoleApiService(appConst.API_URL);
            const roleResult = await roleService.getById(id);
            if (roleResult.type == ResponseType.success) {

                setFormData({
                    name: roleResult.data.name,
                    is_active: roleResult.data.is_active,
                    permissions: roleResult.data.permissions.map((d: { id: any; }) => d.id)
                })
            }
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let validationObj = {
            name: false
        };
        if (!formData.name) validationObj.name = true;

        if (validationObj.name) {
            setFormValidation(validationObj);
            return;
        }
        if (id) {
            let result = await rolesActions.update(id, formData)(dispatch);
            if (result && result.type == ResponseType.success) {
                navigate('/access-management/roles')
            }
        } else {
            let result = await rolesActions.create(formData)(dispatch);
            if (result && result.type == ResponseType.success) {
                navigate('/access-management/roles')
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15"> {id ? 'Update' : 'Create'} Role</h2>
        <form onSubmit={onSubmit}>
            <div className="modify-inputs-400">
                {error && <p className="error-message">{error}</p>}
                <div className="form-group mt-15">
                    <label className={"form-label " + (fromValidation.name ? "validation" : "")}>Name</label>
                    <input className={"input " + (fromValidation.name ? "validation-error" : "")} value={formData.name} onChange={e => onFormField('name', e.target.value)} />
                </div>
            </div>

            <div className="form-group mt-15">
                <label className="form-label pb-15">Permissions</label>
                <div className="multi-checkbox-container">
                    {permissionAll.map((permission, index) => (<div key={index} className="multi-checkbox-item">
                        <Checkbox key={index} label={permission.name} checked={formData.permissions.includes(permission.id)} onChange={(v) => {
                            let tempRoles = [...formData.permissions]
                            let indexOfRole = tempRoles.findIndex(r => r == permission.id);
                            if (indexOfRole != -1) {
                                tempRoles.splice(indexOfRole, 1)
                            } else {
                                tempRoles.push(permission.id)
                            }
                            setFormData({ ...formData, permissions: [...tempRoles] })
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

export default ModifyRole;