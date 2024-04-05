import React, { useEffect, useState } from 'react';

interface DataTableColumnInterface {
    label: string,
    key: string,
    dataIndex: string,
    searchable?: boolean,
    searchVal?: string | number,
    openSearch?: boolean,
    render?:(value:any, record: any)=>any
}

interface DataTableDataInterface {
    [key: string]: any
}

interface DataTableInterface {
    columns: DataTableColumnInterface[],
    data: DataTableDataInterface[],
    onRowClick?: (data: DataTableDataInterface) => void,
    isLoading?: boolean,
    paginationOptions?: PaginationInterface,
    onSearch?: (columns: DataTableColumnInterface[]) => void,
    noDataFound?: React.ReactElement|string
}

const DataTable: React.FC<DataTableInterface> = ({ columns,noDataFound, data, isLoading, onRowClick, paginationOptions, onSearch }) => {
    const [processedColumns, setPColumns] = useState<DataTableColumnInterface[]>([])

    const toggleSearch = (clIndex: number) => {
        let columnList = [...processedColumns];
        columnList[clIndex].openSearch = !columnList[clIndex].openSearch;
        setPColumns(columnList);
    }
    const onChangeSearchVal = (val: string, index: number) => {

        let columnList = [...processedColumns];
        columnList[index].searchVal = val;
        setPColumns(columnList);
    }
    const onSearchReset = (index: number) => {
        let columnList = [...processedColumns];
        columnList[index].searchVal = '';
        if (onSearch) onSearch(columnList);
        setPColumns(columnList);
    }
    useEffect(() => {
        setPColumns(columns.map(column => {
            if (column.searchable) {
                column.searchVal = '';
                column.openSearch = false;
            }
            return column;
        }))
    }, [columns])
    return (
        <div className="data-table">
            <div className='table-container'>
            <table>
                <thead>
                    <tr>
                        {processedColumns.map((column, index) => (
                            <th key={column.key}>{column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading&&<tr><td colSpan={processedColumns.length} className='table-loader__holder'><div className='loader'><span className='fa fa-sync fa-spin'></span></div></td></tr>}
                    {data.map((rowData, rowIndex) => (
                        <tr key={rowIndex} onClick={() => { if (onRowClick) onRowClick(rowData); }}>
                            {processedColumns.map(column => (
                                <td key={column.key}>{column.render?column.render(rowData[column.dataIndex], rowData):rowData[column.dataIndex]}</td>
                            ))}
                        </tr>
                    ))}
                    {(data.length==0)&&<tr><td colSpan={processedColumns.length} style={{textAlign: 'center'}}> {noDataFound ?? <><i className='fa fa-database'></i> No Data Found</>}</td></tr>}
                </tbody>
            </table>
            </div>
            {(paginationOptions) && <Pagination currentPage={paginationOptions.currentPage} totalPages={paginationOptions.totalPages} onPageChange={paginationOptions.onPageChange} />}
        </div>
    );
}
interface PaginationInterface {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void | null
}
const Pagination: React.FC<PaginationInterface> = ({ currentPage = 1, totalPages = 0, onPageChange = null }) => {
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            if (onPageChange) onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            if (onPageChange) onPageChange(currentPage + 1);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="pagination">
            <ul className="page-numbers">

                <li style={currentPage === 1?{opacity: '.6'}:{}}><button disabled={currentPage === 1} onClick={handlePreviousPage}>Previous</button></li>
                {getPageNumbers().map(page => (
                    <li key={page} className={currentPage === page ? 'active' : ''}>
                        <button onClick={() => {
                            if (onPageChange) onPageChange(page)
                        }} >{page}</button>
                    </li>
                ))}
                <li style={currentPage === totalPages?{opacity: '.6'}:{}}><button disabled={currentPage === totalPages} onClick={handleNextPage}>Next</button></li>
            </ul>
        </div>
    );
};
export default DataTable;
