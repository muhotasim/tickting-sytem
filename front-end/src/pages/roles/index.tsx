import React, { useEffect, useState } from "react";
import DataTable from "../../components/datatable";
import Select from "../../components/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { notificationActions } from "../../store/notification.store";
import FilterGrid from "../../components/filter-grid";
import { Link, useNavigate } from "react-router-dom";
import { rolesActions } from "../../store/roles.store";

const RolePage:React.FC = ()=>{

    const dispatch = useDispatch();
    const [columns, setColumns] = useState<any[]>([]); 
    const navigate = useNavigate();
    const { total, page, perPage, roles, isLoading, grid, gridFilters } = useSelector((state:RootState)=>state.roles)

    const onDelete = async(id:number|string)=>{
        rolesActions.delete(id)(dispatch);
    }

    useEffect(()=>{
        rolesActions.list(page, perPage, gridFilters)(dispatch)
    }, [page, gridFilters])

    useEffect(()=>{
        setColumns([
            {label: 'Id', key: 'id', dataIndex: 'id', searchable: false},
            {label: 'Name', key: 'name', dataIndex: 'name'},
            {label: 'Is Active', key: 'is_active', dataIndex: 'is_active', render: (val: any)=>val?"Yes":"No"},
            {label: 'Action', key: 'actions', dataIndex: 'actions', render: (text: any, row: { id: string; })=>(<div>
                <button onClick={()=>{navigate('/access-management/roles/'+row.id)}} className="btn btn-sm btn-primary mr-10"><span className="fa fa-edit"></span></button>
                
                <button onClick={()=>{onDelete(row.id)}} className="btn btn-sm btn-primary"><span className="fa fa-trash"></span></button>
            </div>)}
        ])
        return ()=>{
            dispatch(rolesActions.reset());
        }
    },[])

    const totalPages = Math.ceil(total/perPage)
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15">Roles</h2>
        <FilterGrid grid={grid} onFilter={(filterData)=>{
            dispatch(rolesActions.updateState({gridFilters: filterData, perPage: 10, page: 1}))
        }}/>
        <div style={{textAlign: 'right'}}>
        <button className="btn btn-md btn-primary mb-15" onClick={()=>{navigate('/access-management/roles/create')}}><i className="fa fa-plus mr-5"></i> Create</button>
        </div>
        <DataTable  columns={columns} data={roles} isLoading={isLoading} paginationOptions={{totalPages: totalPages, currentPage: page, onPageChange(cPage) {
            dispatch(rolesActions.updateState({page: cPage }))
        },}}/>
    </div>
}
export  default RolePage;