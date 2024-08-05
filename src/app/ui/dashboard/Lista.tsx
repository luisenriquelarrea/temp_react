import { useState, useEffect } from "react";
import { 
    getInputs, 
    getSeccionMenuListFiltered,
    getTableActions
} from '../../api';
import { arrayColumn, objectClean } from '../../funciones';
import Filters from '@/app/ui/dashboard/Filters';
import Pagination from "./Pagination";
import Table from "./Table";

const Lista = (props: any) => {
    const [inputsFilters, setInputsFilters] = useState([]);
    const [filterData, setFilterData] = useState({
        userId: props.user.userId
    });
    const [columns, setColumns] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [tableActions, setTableActions] = useState([]);
    const [xls, setXls] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [totalRows, setTotalRows] = useState(0);

    useEffect(() => {
        getInputs(props.seccionMenuId, 'filtro').then(response => {
            if(!response.ok){
                console.log("Error al obtener inputs filtro");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setInputsFilters(data);
            })
        }).catch(error => console.error(error));
        getInputs(props.seccionMenuId, 'lista').then(response => {
            if(!response.ok){
                console.log("Error al obtener inputs");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setColumns(data);
            })
        }).catch(error => console.error(error));

        getTableActions(props.seccionMenuId, props.user.grupo).then(response => {
            if(!response.ok){
                console.log("Error al obtener tableActions");
                console.log(response);
                return;
            }
            response.json().then(data => {
                if(arrayColumn(data, 'descripcion').includes('xls'))
                    setXls(true);
                setTableActions(data);
            })
        }).catch(error => console.error(error));
        setTable();
    }, []);

    const setTable = () => {
        getSeccionMenuListFiltered(props.seccionMenu, objectClean(filterData)).then(response => {
            if(!response.ok){
                console.log("Error al obtener lista filtrada");
                console.log(response);
                return;
            }
            response.json().then(data => {
                setDataTable(data);
            })
        }).catch(error => console.error(error));
    }

    const setTableToPaginate = (tableData: any) => {
        const startIndex = (currentPage - 1) * rowsPerPage; 
        const endIndex = startIndex + rowsPerPage; 
        return tableData.slice(startIndex, endIndex); 
    }

    return (
        <>
            <Filters
                seccionMenuId={ props.seccionMenuId }
                seccionMenu={ props.seccionMenu }
                inputsFilters={ inputsFilters }
                setFilterData={ setFilterData }
                setTable={ setTable } />
            <Table
                userId={ props.user.userId }
                seccionMenuId={ props.seccionMenuId }
                seccionMenu={ props.seccionMenu } 
                columns={ columns } 
                dataTable={ dataTable }
                tableActions={ tableActions }
                setTable={ setTable }
                xls={ xls } />
            {/*<Pagination 
                currentPage= { currentPage }
                totalRows={ totalRows }
                setCurrentPage={ setCurrentPage }
                setTableToPaginate={ setTableToPaginate }
                dataTable={ data }
                setDataTable={ setData } />*/}
        </>
    );
}

export default Lista;