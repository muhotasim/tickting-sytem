import React, { useEffect, useRef, useState } from "react";
import DataTable from "../../components/datatable";
import Select from "../../components/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { notificationActions } from "../../store/notification.store";
import FilterGrid from "../../components/filter-grid";

const NotificationPage:React.FC = ()=>{
    const dispatch = useDispatch();
    const { total, page, perPage, notifications, isLoading, grid, gridFilters } = useSelector((state:RootState)=>state.notification)

    useEffect(()=>{
            notificationActions.notificationsList(page, perPage, gridFilters)(dispatch)
    }, [page, gridFilters])

    useEffect(()=>{
        return ()=>{
            dispatch(notificationActions.reset())
        }
    },[])
    const totalPages = Math.ceil(total/perPage)
    return <div className='page dashboard-page animate-fade-in'>
        <h2 className="mt-15 mb-15">Notifications</h2>
        <FilterGrid grid={grid} onFilter={(filterData)=>{
            dispatch(notificationActions.updateState({gridFilters: filterData, perPage: 10, page: 1}))
        }}/>
        <DataTable  columns={[
            {label: 'Id', key: 'id', dataIndex: 'id', searchable: false},
            {label: 'Title', key: 'message', dataIndex: 'message'},
            {label: 'Time', key: 'timestamp', dataIndex: 'timestamp'}
        ]} data={notifications} isLoading={isLoading} paginationOptions={{totalPages: totalPages, currentPage: page, onPageChange(cPage) {
            dispatch(notificationActions.updateState({page: cPage }))
        },}}/>
    </div>
}
export  default NotificationPage;