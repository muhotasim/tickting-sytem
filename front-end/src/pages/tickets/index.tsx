import React, { useEffect, useState } from "react";
import DataTable from "../../components/datatable";
import Select from "../../components/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import FilterGrid from "../../components/filter-grid";
import { Link, useNavigate } from "react-router-dom";
import { ticketsActions } from "../../store/tickets.store";
import moment from "moment";

const TicketsPage:React.FC = ()=>{

    const dispatch = useDispatch();
    const [columns, setColumns] = useState<any[]>([]); 
    const navigate = useNavigate();
    const { total, page, perPage, tickets, isLoading, grid, gridFilters } = useSelector((state:RootState)=>state.tickets)

    const onDelete = async(id:number|string)=>{
        ticketsActions.delete(id)(dispatch);
    }

    useEffect(()=>{
        ticketsActions.list(page, perPage, gridFilters)(dispatch)
    }, [page, gridFilters])

    useEffect(()=>{
        setColumns([
            {label: 'Id', key: 'id', dataIndex: 'id', searchable: false},
            {label: 'Title', key: 'title', dataIndex: 'title'},
            // {label: 'Details', key: 'details', dataIndex: 'details'},
            {label: 'Priority', key: 'priority', dataIndex: 'priority'},
            {label: 'Status', key: 'status', dataIndex: 'status'},
            {label: 'Submission Date', key: 'submission_date', dataIndex: 'submission_date', render: (val)=>moment(val).format('YYYY-MM-DD')},
            // {label: 'Resolved Date', key: 'resolved_date', dataIndex: 'resolved_date'},
            {label: 'Is Active', key: 'is_active', dataIndex: 'is_active', render: (val: any)=>val?"Yes":"No"},
            {label: 'Action', key: 'actions', dataIndex: 'actions', render: (text: any, row: { id: string; })=>(<div>
              <button className="btn btn-primary btn-sm" onClick={()=>{ navigate('/tickets-management/tickets/'+row.id) }}>Details</button>
              </div>)}
        ])
        return ()=>{ 
            dispatch(ticketsActions.reset());
        }
    },[])

    const totalPages = Math.ceil(total/perPage)
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15">Tickets</h2>
        <FilterGrid grid={grid} onFilter={(filterData)=>{
            dispatch(ticketsActions.updateState({gridFilters: filterData, perPage: 10, page: 1}))
        }}/>
        <div style={{textAlign: 'right'}}>
        {/* <button className="btn btn-md btn-primary mb-15" onClick={()=>{navigate('/roles/create')}}><i className="fa fa-plus mr-5"></i> Create</button> */}
        </div>
        <DataTable  columns={columns} data={tickets} isLoading={isLoading} paginationOptions={{totalPages: totalPages, currentPage: page, onPageChange(cPage) {
            dispatch(ticketsActions.updateState({page: cPage }))
        },}}/>
    </div>
}
export  default TicketsPage;