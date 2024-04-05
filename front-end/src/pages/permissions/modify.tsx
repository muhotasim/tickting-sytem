import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import appConst from "../../constants/app.const";
import { ResponseType } from "../../utils/contome.datatype";
import { useDispatch, useSelector } from "react-redux";
import { usersActions } from "../../store/users.store";
import { RootState } from "../../store";
import Checkbox from "../../components/checkbox";
import { RoleApiService } from "../../services/roles-api.service";
import { PermissionApiService } from "../../services/permission-api.service";
import { permissionActions } from "../../store/permissions.store";

const ModifyPermission = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoading, error, roles } = useSelector((state: RootState) => state.roles)
    const [formData, setFormData] = useState<{
        name: string,
        is_active: boolean
    }>({
        name: '',
        is_active: true
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
        if (id) {
            const permissionService = new PermissionApiService(appConst.API_URL);
            const permissionResult = await permissionService.getById(id);
            if (permissionResult.type == ResponseType.success) {

                setFormData({
                    name: permissionResult.data.name,
                    is_active: permissionResult.data.is_active
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
            let result = await permissionActions.update(id, formData)(dispatch);
            if (result && result.type == ResponseType.success) {
                navigate('/access-management/permissions')
            }
        } else {
            let result = await permissionActions.create(formData)(dispatch);
            if (result && result.type == ResponseType.success) {
                navigate('/access-management/permissions')
            }
        }
    }

    useEffect(() => {
        fetchData();
    }, [])
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15"> {id ? 'Update' : 'Create'} Permission</h2>
        <form onSubmit={onSubmit}>
            <div className="modify-inputs-400">
                {error && <p className="error-message">{error}</p>}
                <div className="form-group mt-15">
                    <label className={"form-label " + (fromValidation.name ? "validation" : "")}>Name</label>
                    <input className={"input " + (fromValidation.name ? "validation-error" : "")} value={formData.name} onChange={e => onFormField('name', e.target.value)} />
                </div>
                <div className="form-group mt-15">
                    <Checkbox label="Is Active" checked={formData.is_active} onChange={(v) => { onFormField('is_active', v) }} />
                </div>
            </div>

            <div className="modify-inputs-400">
                <button disabled={isLoading} className="btn btn-md btn-primary float-right"> <i className={`fa ${isLoading ? 'fa-sync fa-spin' : 'fa-save'}`}></i> {id ? "Update" : "Save"}</button>
            </div>
        </form>
    </div>
}

export default ModifyPermission;