import React, { useEffect, useState } from "react";
import DataTable from "../../components/datatable";
import Select from "../../components/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { notificationActions } from "../../store/notification.store";
import FilterGrid from "../../components/filter-grid";
import { usersActions } from "../../store/users.store";
import { Link, useNavigate } from "react-router-dom";

const UserPage:React.FC = ()=>{

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [columns, setColumns] = useState<any[]>([]); 
    const { total, page, perPage, users, isLoading, grid, gridFilters } = useSelector((state:RootState)=>state.user)

    const onDelete = async(id:number|string)=>{
        usersActions.delete(id)(dispatch);
    }

    useEffect(()=>{
        usersActions.list(page, perPage, gridFilters)(dispatch)
    }, [page, gridFilters])

    useEffect(()=>{
        setColumns([
            {label: 'Id', key: 'id', dataIndex: 'id', searchable: false},
            {label: 'Name', key: 'name', dataIndex: 'name'},
            {label: 'Email', key: 'email', dataIndex: 'email'},
            {label: 'Roles', key: 'roles', dataIndex: 'roles', render: (val: any[])=>val.length?val.map((role:any)=>role.name).join(', '):'N/A'},
            {label: 'Is Active', key: 'is_active', dataIndex: 'is_active', render: (val: any)=>val?"Yes":"No"},
            {label: 'Action', key: 'actions', dataIndex: 'actions', render: (text: any, row: { id: string; })=>(<div>
                <button onClick={()=>{navigate('/access-management/users/'+row.id)}} className="btn btn-sm btn-primary mr-10"><span className="fa fa-edit"></span></button>
                
                <button onClick={()=>{onDelete(row.id)}} className="btn btn-sm btn-primary"><span className="fa fa-trash"></span></button>
            </div>)}
        ])
        return ()=>{
            dispatch(usersActions.reset());
        }
    },[])

    const totalPages = Math.ceil(total/perPage)
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15">Users</h2>
        <FilterGrid grid={grid} onFilter={(filterData)=>{
            dispatch(usersActions.updateState({gridFilters: filterData, perPage: 10, page: 1}))
        }}/>
        <div style={{textAlign: 'right'}}>
        <button className="btn btn-md btn-primary mb-15" onClick={()=>{navigate('/access-management/users/create')}}><i className="fa fa-plus mr-5"></i> Create</button>
        </div>
        <DataTable  columns={columns} data={users} isLoading={isLoading} paginationOptions={{totalPages: totalPages, currentPage: page, onPageChange(cPage) {
            dispatch(usersActions.updateState({page: cPage }))
        },}}/>
    </div>
}
export  default UserPage;